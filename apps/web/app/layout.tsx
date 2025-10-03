import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import './globals.css'
import Footer from '../src/components/footer'
import { ThemeProvider } from './components/site/theme-provider'
import Navbar from './components/site/Navbar'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        
        {/* Chat widget will be loaded via external script after page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window === 'undefined') return;
                  
                  function loadChatWidget() {
                    try {
                      if (document.getElementById('chat-widget-container')) return;
                      
                      const script = document.createElement('script');
                      script.src = '/chat-widget.js';
                      script.async = true;
                      script.defer = true;
                      script.onload = function() {
                        console.log('Chat widget loaded successfully');
                      };
                      script.onerror = function(e) {
                        console.warn('Chat widget failed to load:', e);
                      };
                      document.body.appendChild(script);
                    } catch (e) {
                      console.warn('Error loading chat widget:', e);
                    }
                  }
                  
                  function initChatWidget() {
                    try {
                      if (document.readyState === 'complete') {
                        setTimeout(loadChatWidget, 1000);
                      } else {
                        window.addEventListener('load', function() {
                          setTimeout(loadChatWidget, 1000);
                        });
                      }
                    } catch (e) {
                      console.warn('Error initializing chat widget:', e);
                    }
                  }
                  
                  initChatWidget();
                } catch (e) {
                  console.warn('Chat widget initialization failed:', e);
                }
              })();
            `
          }}
        />
      </body>
    </html>
  );
}