/**
 * Accessibility Enhancement Component
 * Provides keyboard navigation, screen reader improvements, and ARIA enhancements
 */

'use client';

import React, { useEffect } from 'react';

export function AccessibilityEnhancements() {
  useEffect(() => {
    // Add focus management for keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content with Ctrl/Cmd + /
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Escape key to close modals/overlays
      if (event.key === 'Escape') {
        const focusableElements = document.querySelectorAll(
          '[data-focus-trap="true"] button, [data-focus-trap="true"] [href], [data-focus-trap="true"] input, [data-focus-trap="true"] select, [data-focus-trap="true"] textarea, [data-focus-trap="true"] [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          firstElement.focus();
        }
      }
    };

    // Add high contrast mode detection
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handleContrastChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };

    // Add reduced motion detection
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    };

    // Add focus visible polyfill for older browsers
    const handleMouseDown = () => {
      document.documentElement.classList.add('mouse-focus');
    };

    const handleKeyboardFocus = () => {
      document.documentElement.classList.remove('mouse-focus');
    };

    // Initialize
    handleContrastChange({ matches: mediaQuery.matches } as MediaQueryListEvent);
    handleMotionChange({ matches: motionQuery.matches } as MediaQueryListEvent);

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyboardFocus);
    mediaQuery.addListener(handleContrastChange);
    motionQuery.addListener(handleMotionChange);

    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.setAttribute('id', 'page-announcer');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyboardFocus);
      mediaQuery.removeListener(handleContrastChange);
      motionQuery.removeListener(handleMotionChange);
      if (announcer.parentNode) {
        announcer.parentNode.removeChild(announcer);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}

/**
 * Screen Reader Only component for important announcements
 */
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/**
 * Focus Trap component for modal/overlay accessibility
 */
export function FocusTrap({ 
  children, 
  isActive = true,
  restoreFocus = true 
}: { 
  children: React.ReactNode;
  isActive?: boolean;
  restoreFocus?: boolean;
}) {
  useEffect(() => {
    if (!isActive) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement;
    const trapElement = document.querySelector('[data-focus-trap="true"]') as HTMLElement;
    
    if (!trapElement) return;

    const focusableElements = trapElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab: focus previous element
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab: focus next element
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    // Focus first element when trap becomes active
    if (firstElement) {
      firstElement.focus();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to previously focused element
      if (restoreFocus && previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isActive, restoreFocus]);

  return (
    <div data-focus-trap={isActive ? "true" : "false"}>
      {children}
    </div>
  );
}

/**
 * Hook for managing page announcements to screen readers
 */
export function usePageAnnouncer() {
  const announce = (message: string) => {
    const announcer = document.getElementById('page-announcer');
    if (announcer) {
      // Clear previous message
      announcer.textContent = '';
      
      // Add new message after a brief delay to ensure it's announced
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
      
      // Clear message after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 5000);
    }
  };

  return { announce };
}