import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PHProvider } from './providers/PostHogProvider'
import { RiderProvider } from '@/providers/RiderProvider'
import { Header } from '@/components/Header'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'miked.live',
  description: 'Create a professional technical rider and stage plot in 5 minutes. No account needed.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-900 text-slate-100">
        <RiderProvider>
          <PHProvider>
            <div className="h-dvh overflow-hidden flex flex-col">
              <Header />
              <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
                {children}
              </main>
            </div>
          </PHProvider>
        </RiderProvider>
      </body>
    </html>
  )
}
