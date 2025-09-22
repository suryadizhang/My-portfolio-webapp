import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '../components/footer'
import { ChatDock } from '../components/chat/ChatDock'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Suryadi Zhang — Full-Stack Software Engineer",
  description:
    "React/Next.js + Python/FastAPI + Postgres. Live booking apps, solid APIs, and CI/CD.",
  openGraph: {
    title: "Suryadi Zhang — Full-Stack Software Engineer",
    description:
      "Live booking + admin, API design, and CI/CD with GitHub Actions.",
    url: "https://suryadizhang.dev",
    siteName: "Suryadi Zhang",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white text-slate-900`}>
        <div className="min-h-screen flex flex-col">
          {children}
          <Footer />
          <ChatDock />
        </div>
      </body>
    </html>
  );
}