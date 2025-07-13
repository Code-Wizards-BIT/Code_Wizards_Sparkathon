import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
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
      <body>
        {children}
        <Analytics/>
      </body>
    </html>
  )
}
