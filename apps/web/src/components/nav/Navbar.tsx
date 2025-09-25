'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white text-sm font-bold">
            SZ
          </span>
          <span>Surya Zhang</span>
        </Link>

        <button
          className="sm:hidden inline-flex items-center justify-center p-2 border rounded hover:bg-gray-50"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <ul className="hidden sm:flex gap-6">
          <li><a href="#about" className="hover:text-brand transition-colors">About</a></li>
          <li><a href="#resume" className="hover:text-brand transition-colors">Resume</a></li>
          <li><a href="#project" className="hover:text-brand transition-colors">Projects</a></li>
          <li><a href="#contact" className="hover:text-brand transition-colors">Contact</a></li>
        </ul>
      </div>

      {open && (
        <div className="sm:hidden border-t bg-white">
          <ul className="px-4 py-3 space-y-2">
            <li><a href="#about" onClick={() => setOpen(false)} className="block py-2 hover:text-brand transition-colors">About</a></li>
            <li><a href="#resume" onClick={() => setOpen(false)} className="block py-2 hover:text-brand transition-colors">Resume</a></li>
            <li><a href="#project" onClick={() => setOpen(false)} className="block py-2 hover:text-brand transition-colors">Projects</a></li>
            <li><a href="#contact" onClick={() => setOpen(false)} className="block py-2 hover:text-brand transition-colors">Contact</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
}