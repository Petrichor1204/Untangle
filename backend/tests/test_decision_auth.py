"""
Authorization tests for PATCH /dashboard/intakes/{token}/decision.

A stylist must only be able to mutate intakes that belong to them. A regression
here would let any logged-in stylist edit any other stylist's bookings — a
serious security bug. We test the happy path (own intake) and the deny path
(someone else's intake).
"""


def _register_stylist(client, slug, email):
    res = client.post("/auth/register", json={
        "name": f"Stylist {slug}",
        "email": email,
        "password": "hunter22",
        "role": "stylist",
        "slug": slug,
    })
    assert res.status_code == 200, res.text
    data = res.json()
    return data["access_token"]


def _create_service(client, token):
    res = client.post(
        "/services",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "Braids", "base_price": 150.0, "base_time_hours": 3.0},
    )
    assert res.status_code == 200, res.text
    return res.json()["id"]


def _start_and_submit_intake(client, slug, service_id):
    """Spin up an intake session and submit a hair profile so the decision
    endpoint has a real, fully-formed target to operate on."""
    start = client.post(f"/intake/{slug}/start", json={
        "client_name": "Jordan Client",
        "client_email": "jordan@example.com",
        "service_id": service_id,
    })
    assert start.status_code == 200, start.text
    token = start.json()["token"]

    submit = client.post(f"/intake/{token}/submit", json={
        "length": "shoulder", "density": "medium", "porosity": "medium",
        "thickness": "medium", "condition": "healthy",
        "last_relaxer": "never", "last_color": "never", "last_heat": "rarely",
        "has_breakage": False,
        "is_washed": True, "is_detangled": True, "is_product_free": True,
    })
    assert submit.status_code == 200, submit.text
    return token


def test_stylist_can_update_their_own_intake(client):
    stylist_token = _register_stylist(client, "alice", "alice@example.com")
    service_id = _create_service(client, stylist_token)
    intake_token = _start_and_submit_intake(client, "alice", service_id)

    res = client.patch(
        f"/dashboard/intakes/{intake_token}/decision",
        headers={"Authorization": f"Bearer {stylist_token}"},
        json={"status": "confirmed", "stylist_note": "looks good"},
    )
    assert res.status_code == 200
    assert res.json()["status"] == "confirmed"


def test_other_stylist_cannot_update_someone_elses_intake(client):
    """Stylist B should get a 404 (not 200, not 403 with mutation) when
    attempting to mutate Stylist A's intake."""
    alice_token = _register_stylist(client, "alice", "alice@example.com")
    bob_token = _register_stylist(client, "bob", "bob@example.com")

    alice_service = _create_service(client, alice_token)
    alice_intake = _start_and_submit_intake(client, "alice", alice_service)

    res = client.patch(
        f"/dashboard/intakes/{alice_intake}/decision",
        headers={"Authorization": f"Bearer {bob_token}"},
        json={"status": "confirmed", "stylist_note": "I am not Alice"},
    )
    assert res.status_code == 404, (
        f"expected 404 to hide existence, got {res.status_code}: {res.text}"
    )

    # And critically — verify the intake actually wasn't mutated.
    detail = client.get(
        f"/dashboard/intakes/{alice_intake}",
        headers={"Authorization": f"Bearer {alice_token}"},
    )
    assert detail.status_code == 200
    body = detail.json()
    assert body["status"] != "confirmed"
    assert body["stylist_note"] != "I am not Alice"


def test_unauthenticated_request_is_rejected(client):
    alice_token = _register_stylist(client, "alice", "alice@example.com")
    alice_service = _create_service(client, alice_token)
    alice_intake = _start_and_submit_intake(client, "alice", alice_service)

    res = client.patch(
        f"/dashboard/intakes/{alice_intake}/decision",
        json={"status": "confirmed"},
    )
    assert res.status_code in (401, 403)
