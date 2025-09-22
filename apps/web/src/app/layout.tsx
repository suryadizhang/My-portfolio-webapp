import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '../components/footer'
import { ChatDock } from '../components/chat/ChatDock'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? 'https://suryadizhang.dev' 
    : 'http://localhost:3000'
  ),
  title: {
    default: "Suryadi Zhang — Full-Stack Software Engineer",
    template: "%s | Suryadi Zhang"
  },
  description:
    "React/Next.js + Python/FastAPI + Postgres. Live booking apps, solid APIs, and CI/CD.",
  keywords: [
    "Full-Stack Developer",
    "Software Engineer",
    "React",
    "Next.js",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "TypeScript",
    "API Development",
    "CI/CD",
    "GitHub Actions"
  ],
  authors: [{ name: "Suryadi Zhang", url: "https://suryadizhang.dev" }],
  creator: "Suryadi Zhang",
  publisher: "Suryadi Zhang",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://suryadizhang.dev",
    siteName: "Suryadi Zhang",
    title: "Suryadi Zhang — Full-Stack Software Engineer",
    description:
      "Live booking + admin, API design, and CI/CD with GitHub Actions.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Suryadi Zhang - Full-Stack Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suryadi Zhang — Full-Stack Software Engineer",
    description: "Live booking + admin, API design, and CI/CD with GitHub Actions.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you have them configured
    // google: "your-google-site-verification",
    // yandex: "your-yandex-verification",
    // yahoo: "your-yahoo-verification",
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