import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import Providers from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'Tractor 360°', template: '%s | Tractor 360°' },
  description: 'Unified data intelligence platform for tractor manufacturing organizations. One Tractor. One Customer. One Complete Data View.',
  keywords: ['tractor', 'agriculture', 'enterprise', 'data management', 'CRM'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
