'use client'

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

export default function GlobalError({ error }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          color: '#3f2a1d',
          background: '#faf6f1',
        }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Something went wrong.</h1>
          <p style={{ color: '#7a6354', maxWidth: 420, textAlign: 'center' }}>
            We&apos;ve been notified and are looking into it. Please refresh the page or try again in a moment.
          </p>
        </div>
      </body>
    </html>
  )
}
