import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/theme-provider'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { ChatDock } from '../components/chat/ChatDock'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Suryadi Zhang - Software Engineer (Full-Stack)',
  description: 'Full-Stack Software Engineer delivering responsive web apps and robust APIs with React/Next.js, Python/FastAPI, and Postgres.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  keywords: ['Software Engineer', 'Full-Stack Developer', 'React', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'Postgres'],
  authors: [{ name: 'Suryadi Zhang' }],
  openGraph: {
    title: 'Suryadi Zhang - Software Engineer (Full-Stack)',
    description: 'Full-Stack Software Engineer delivering responsive web apps and robust APIs with React/Next.js, Python/FastAPI, and Postgres.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suryadi Zhang - Software Engineer (Full-Stack)',
    description: 'Full-Stack Software Engineer delivering responsive web apps and robust APIs with React/Next.js, Python/FastAPI, and Postgres.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <ChatDock />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}