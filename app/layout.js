import './globals.css'

export const metadata = {
  title: 'Untangle — Smarter Consultations for Textured-Hair Stylists',
  description: 'Send clients a Untangle intake link before their appointment. Get their full hair profile before they sit in your chair.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
