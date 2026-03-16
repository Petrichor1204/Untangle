import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-50 font-body text-warm-900">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-warm-100">
        <span className="font-brand text-3xl text-warm-700">Hairly</span>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm text-warm-600 hover:text-warm-800 transition-colors font-medium">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-warm-700 text-warm-50 px-5 py-2.5 rounded-full hover:bg-warm-800 transition-colors font-semibold"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center">
        <p className="text-warm-500 text-xs font-bold tracking-[0.25em] uppercase mb-6">
          For textured-hair stylists
        </p>
        <h1 className="font-display text-6xl md:text-7xl text-warm-900 leading-[1.05] mb-7">
          Every client deserves a stylist<br />
          <span className="italic text-warm-600">who already knows their hair.</span>
        </h1>
        <p className="text-warm-600 text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Hairly gathers your client's full hair profile before the appointment —
          so you can walk in prepared, price it right, and do the work you're built for.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-block bg-warm-700 text-warm-50 font-semibold text-base px-8 py-4 rounded-full hover:bg-warm-800 transition-colors shadow-warm-md"
          >
            Create your intake link →
          </Link>
          <span className="text-sm text-warm-400">Free. No credit card.</span>
        </div>
      </section>

      {/* Warm divider quote */}
      <div className="bg-warm-100 border-y border-warm-200 py-8 px-8">
        <p className="font-display text-2xl italic text-warm-700 text-center max-w-2xl mx-auto leading-relaxed">
          "Your clients trust you with their crown. Hairly helps you honour that trust
          before they even sit down."
        </p>
      </div>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-8 py-24">
        <p className="text-warm-500 text-xs font-bold tracking-[0.25em] uppercase text-center mb-4">
          How it works
        </p>
        <h2 className="font-display text-4xl text-warm-900 text-center mb-16">
          Three gentle steps. Zero surprises.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: '01',
              title: 'Share your link',
              body: 'You get a personal intake URL — hairly.app/intake/you. Send it to your client before every appointment. That\'s it.',
              color: 'bg-warm-100 border-warm-200',
            },
            {
              n: '02',
              title: 'Client fills it out',
              body: 'Five short sections covering hair details, history, prep status, and style goals. Takes about three minutes.',
              color: 'bg-lav-50 border-lav-100',
            },
            {
              n: '03',
              title: 'You come prepared',
              body: 'Their full profile lands in your dashboard with an estimated service time and suggested price range — before they knock.',
              color: 'bg-warm-100 border-warm-200',
            },
          ].map(({ n, title, body, color }) => (
            <div key={n} className={`${color} border rounded-3xl p-8`}>
              <div className="font-display text-5xl text-warm-300 mb-4 leading-none">{n}</div>
              <h3 className="font-display text-xl text-warm-900 mb-2">{title}</h3>
              <p className="text-sm text-warm-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problems — warmer framing */}
      <section className="bg-warm-800 py-24 px-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-warm-300 text-xs font-bold tracking-[0.25em] uppercase mb-4">
              The reality
            </p>
            <h2 className="font-display text-4xl text-warm-50 leading-tight mb-6">
              The information was always available.<br />
              <span className="italic text-warm-300">No one was asking for it.</span>
            </h2>
            <p className="text-warm-300 text-sm leading-relaxed">
              Hairly doesn't replace the relationship between you and your client.
              It just makes sure you have what you need to show up fully for them.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { before: 'Guessing the density until you\'re already in it', after: 'You see it in the profile first' },
              { before: 'Surprise relaxer from two months ago', after: 'Flagged before the appointment' },
              { before: 'Booking two hours for a five-hour job', after: 'Estimate calculated automatically' },
              { before: 'Difficult price conversations mid-service', after: 'Suggested range agreed up front' },
            ].map(({ before, after }) => (
              <div key={before} className="bg-warm-700 border border-warm-600 rounded-2xl p-4">
                <p className="text-xs text-warm-400 line-through mb-1">{before}</p>
                <p className="text-sm text-warm-100 font-semibold">→ {after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample estimate */}
      <section className="max-w-4xl mx-auto px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-warm-500 text-xs font-bold tracking-[0.25em] uppercase mb-4">
              What you'll see
            </p>
            <h2 className="font-display text-4xl text-warm-900 mb-4">
              A full picture,<br />before you begin.
            </h2>
            <p className="text-warm-600 text-sm leading-relaxed mb-6">
              Hairly uses your client's hair length, density, condition, and prep status
              to estimate service time and suggest a price range.
              No algorithms. Just the logic you already carry in your head — written down.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-warm-600 text-warm-50 font-semibold px-6 py-3 rounded-full hover:bg-warm-700 transition-colors text-sm"
            >
              Set up your intake link
            </Link>
          </div>

          {/* Sample card */}
          <div className="bg-warm-100 border border-warm-200 rounded-3xl p-7 shadow-warm">
            <p className="text-xs font-bold text-warm-500 uppercase tracking-widest mb-5">
              Sample Hairly estimate
            </p>
            <div className="space-y-3">
              {[
                { label: 'Client', value: 'Maya J.' },
                { label: 'Service', value: 'Knotless braids' },
                { label: 'Hair', value: '4B · High density · Mid-back' },
                { label: 'Prep status', value: '⚠ Not detangled (+30 min)', warn: true },
                { label: 'Est. service time', value: '6.5 hours', highlight: true },
                { label: 'Suggested price', value: '$240 – $280', highlight: true },
              ].map(({ label, value, highlight, warn }) => (
                <div key={label} className="flex justify-between items-center border-b border-warm-200 pb-3 last:border-0 last:pb-0">
                  <span className="text-xs text-warm-500 font-medium">{label}</span>
                  <span className={`text-sm font-bold ${highlight ? 'text-warm-700' : warn ? 'text-amber-600' : 'text-warm-800'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-lav-100 border-y border-lav-200 py-20 px-8 text-center">
        <p className="text-lav-500 text-xs font-bold tracking-[0.25em] uppercase mb-4">
          You've got this
        </p>
        <h2 className="font-display text-5xl text-warm-900 mb-4 leading-tight">
          Your clients come to you<br />because they trust you.
        </h2>
        <p className="text-warm-600 mb-10 max-w-md mx-auto text-sm leading-relaxed">
          Hairly gives you the information to honour that trust.
          Set up your intake link in under two minutes.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-warm-700 text-warm-50 font-semibold text-base px-10 py-4 rounded-full hover:bg-warm-800 transition-colors shadow-warm-md"
        >
          Create your free account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 flex items-center justify-between border-t border-warm-100">
        <span className="font-brand text-xl text-warm-600">Hairly</span>
        <span className="text-xs text-warm-400">© {new Date().getFullYear()} · For textured-hair stylists</span>
      </footer>
    </div>
  )
}
