import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Supply Demand Chain Management',
  description: 'Created by Code Wizards',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
