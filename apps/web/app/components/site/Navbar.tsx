"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route (or hash) change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      className={[
        "sticky top-0 z-50 w-full border-b border-border/60",
        "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      ].join(" ")}
      aria-label="Primary"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm">
              💻
            </span>
            <span>Suryadi Zhang</span>
          </Link>

          {/* Mobile toggle */}
          <button
            className="ml-auto inline-flex items-center justify-center rounded-md p-2 md:hidden hover:bg-muted/50 transition-colors"
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Open menu</span>
            <div className="flex flex-col gap-1.5">
              <span 
                className={[
                  "block h-0.5 w-5 bg-current transition-transform duration-200",
                  open ? "rotate-45 translate-y-2" : ""
                ].join(" ")} 
              />
              <span 
                className={[
                  "block h-0.5 w-5 bg-current transition-opacity duration-200",
                  open ? "opacity-0" : ""
                ].join(" ")} 
              />
              <span 
                className={[
                  "block h-0.5 w-5 bg-current transition-transform duration-200",
                  open ? "-rotate-45 -translate-y-2" : ""
                ].join(" ")} 
              />
            </div>
          </button>

          {/* Center links (desktop) */}
          <ul className="mx-auto hidden items-center gap-6 md:flex">
            <li>
              <Link 
                className={[
                  "text-sm font-medium hover:opacity-80 transition-opacity relative",
                  pathname === "/" ? "text-primary" : ""
                ].join(" ")} 
                href="/"
              >
                Home
                {pathname === "/" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            </li>
            <li>
              <Link 
                className={[
                  "text-sm font-medium hover:opacity-80 transition-opacity relative",
                  pathname === "/about" ? "text-primary" : ""
                ].join(" ")} 
                href="/about"
              >
                About
                {pathname === "/about" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            </li>
            <li>
              <Link 
                className={[
                  "text-sm font-medium hover:opacity-80 transition-opacity relative",
                  pathname === "/resume" ? "text-primary" : ""
                ].join(" ")} 
                href="/resume"
              >
                Resume
                {pathname === "/resume" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            </li>
            <li>
              <Link 
                className={[
                  "text-sm font-medium hover:opacity-80 transition-opacity relative",
                  pathname === "/projects" || pathname.startsWith("/projects/") ? "text-primary" : ""
                ].join(" ")} 
                href="/projects"
              >
                Projects
                {(pathname === "/projects" || pathname.startsWith("/projects/")) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            </li>
            <li>
              <Link 
                className={[
                  "text-sm font-medium hover:opacity-80 transition-opacity relative",
                  pathname === "/contact" ? "text-primary" : ""
                ].join(" ")} 
                href="/contact"
              >
                Contact
                {pathname === "/contact" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            </li>
          </ul>

          {/* Right side: color mode */}
          <div className="ml-4 hidden md:block">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="primary-nav"
          className={[
            "md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out",
            open ? "max-h-64" : "max-h-0",
          ].join(" ")}
        >
          <ul className="flex flex-col gap-3 py-3">
            <li>
              <Link 
                className={[
                  "block rounded px-2 py-1 text-sm font-medium hover:bg-muted transition-colors",
                  pathname === "/" ? "bg-muted/50 text-primary" : ""
                ].join(" ")} 
                href="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                className={[
                  "block rounded px-2 py-1 text-sm font-medium hover:bg-muted transition-colors",
                  pathname === "/about" ? "bg-muted/50 text-primary" : ""
                ].join(" ")} 
                href="/about"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                className={[
                  "block rounded px-2 py-1 text-sm font-medium hover:bg-muted transition-colors",
                  pathname === "/resume" ? "bg-muted/50 text-primary" : ""
                ].join(" ")} 
                href="/resume"
              >
                Resume
              </Link>
            </li>
            <li>
              <Link 
                className={[
                  "block rounded px-2 py-1 text-sm font-medium hover:bg-muted transition-colors",
                  pathname === "/projects" || pathname.startsWith("/projects/") ? "bg-muted/50 text-primary" : ""
                ].join(" ")} 
                href="/projects"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link 
                className={[
                  "block rounded px-2 py-1 text-sm font-medium hover:bg-muted transition-colors",
                  pathname === "/contact" ? "bg-muted/50 text-primary" : ""
                ].join(" ")} 
                href="/contact"
              >
                Contact
              </Link>
            </li>
            <li className="px-2 pt-2">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// --- theme toggle component ---
function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted/50 transition-colors"
        disabled
      >
        <span className="h-4 w-4">🌙</span>
        <span className="hidden sm:inline">Theme</span>
      </button>
    );
  }

  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted/50 transition-colors"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color mode"
    >
      <span className="h-4 w-4">{isDark ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}