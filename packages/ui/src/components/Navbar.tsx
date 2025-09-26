'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
  onClick?: () => void;
}

export interface NavbarProps {
  /** Brand name or component */
  brand?: React.ReactNode;
  /** Brand URL */
  brandHref?: string;
  /** Navigation items */
  items?: NavItem[];
  /** Custom classes for styling */
  className?: string;
  /** Fixed position */
  fixed?: 'top' | 'bottom' | false;
  /** Background style */
  variant?: 'light' | 'dark' | 'transparent';
  /** Expand breakpoint */
  expand?: 'sm' | 'md' | 'lg' | 'xl' | 'always';
  /** Right side content (theme toggle, etc) */
  rightContent?: React.ReactNode;
}

const expandClasses = {
  sm: 'sm:flex',
  md: 'md:flex',
  lg: 'lg:flex',
  xl: 'xl:flex',
  always: 'flex'
};

const expandHiddenClasses = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
  xl: 'xl:hidden',
  always: 'hidden'
};

export default function Navbar({
  brand = 'Brand',
  brandHref = '/',
  items = [],
  className = '',
  fixed = false,
  variant = 'light',
  expand = 'lg',
  rightContent
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [isOpen]);

  // Base classes
  const baseClasses = 'w-full z-50 transition-all duration-200';
  
  // Position classes
  const positionClasses: Record<string, string> = {
    top: 'sticky top-0',
    bottom: 'fixed bottom-0',
    'false': ''
  };

  // Variant classes
  const variantClasses = {
    light: 'bg-white/95 backdrop-blur-sm border-b border-gray-200 text-gray-900',
    dark: 'bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 text-white',
    transparent: 'bg-transparent'
  };

  return (
    <nav className={`${baseClasses} ${positionClasses[fixed.toString()]} ${variantClasses[variant]} ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link 
            href={brandHref} 
            className="flex items-center space-x-2 font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            {typeof brand === 'string' ? (
              <>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                  {brand.charAt(0).toUpperCase()}
                </span>
                <span>{brand}</span>
              </>
            ) : (
              brand
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden ${expandClasses[expand]} items-center space-x-6`}>
            {items.map((item, index) => (
              <div key={index}>
                {item.isExternal ? (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {item.label}
                    <svg className="inline-block ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    onClick={item.onClick}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            {rightContent && (
              <div className="ml-2">
                {rightContent}
              </div>
            )}
          </div>

          {/* Mobile right content and menu button */}
          <div className={`${expandHiddenClasses[expand]} flex items-center space-x-2`}>
            {rightContent && <div>{rightContent}</div>}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={handleToggle}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${expandHiddenClasses[expand]} ${isOpen ? 'block' : 'hidden'}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
            {items.map((item, index) => (
              <div key={index}>
                {item.isExternal ? (
                  <a
                    href={item.href}
                    onClick={() => {
                      item.onClick?.();
                      handleLinkClick();
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {item.label}
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => {
                      item.onClick?.();
                      handleLinkClick();
                    }}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}