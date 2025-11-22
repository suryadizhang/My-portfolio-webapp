# Contact Protection Implementation - Example Usage

## Overview

This guide shows **real-world examples** of implementing contact information protection across your portfolio. All examples use the centralized configuration and reusable components.

**Key Principle:** Contact information is **instantly visible** to visitors (professional requirement) but **encoded in HTML source** to prevent bot scraping.

**Key Files:**

- **Config:** `apps/web/src/config/contact.config.ts` - Centralized contact data
- **Utils:** `packages/utils/src/contact/obfuscation.ts` - Encoding/decoding
- **Components:** `apps/web/src/components/ui/ObfuscatedContact.tsx` - Reusable UI
- **Script:** `apps/web/src/scripts/encode-contact.ts` - Generate encoded values

---

## Quick Start

### How It Works:

1. **In HTML source** (what bots see): `encodedEmail: 'c3VyeWFkaXpoYW5nLnN3ZUBnbWFpbC5jb20='`
2. **On page load** (what JavaScript does): Decodes Base64 automatically
3. **What users see**: `suryadizhang.swe@gmail.com` - instantly visible, fully clickable

This protects against 99% of scrapers while maintaining professional appearance and SEO visibility.

---

Here's how to implement the contact protection in your pages:

### 1. Update Contact Page

```tsx
// apps/web/app/(marketing)/contact/page.tsx
'use client'

import React from 'react'
import { profileData } from '../../../src/lib/profile-data'
import { Button } from '@portfolio/ui'
import { Mail, MapPin, Github, Linkedin } from 'lucide-react'
import { ContactModal } from '../../../src/components/ContactModal'
import { ObfuscatedEmail, ObfuscatedPhone } from '../../../src/components/ui/ObfuscatedContact'
import { ContactButton } from '../../../src/components/ui/ContactButton'
import { CONTACT_CONFIG } from '../../../src/config/contact.config'

export default function ContactPage() {
  // ...existing state and handlers...

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Contact Info Section */}
      <div className="space-y-6">
        {/* Email - Use ObfuscatedEmail component */}
        <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Email</h3>
            <ObfuscatedEmail 
              encoded={CONTACT_CONFIG.encodedEmail}
              className="text-muted-foreground hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Alternative: Interactive Email Button */}
        <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Email</h3>
            <ContactButton 
              type="email"
              encoded={CONTACT_CONFIG.encodedEmail}
              variant="outline"
              showCopy
            />
          </div>
        </div>

        {/* Phone - Use ObfuscatedPhone or ContactButton */}
        <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Phone</h3>
            <ContactButton 
              type="phone"
              encoded={CONTACT_CONFIG.encodedPhone}
              variant="outline"
              showCopy
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 2. Update About Page

```tsx
// apps/web/app/(marketing)/about/page.tsx
import { ObfuscatedEmail } from '../../../src/components/ui/ObfuscatedContact'
import { CONTACT_CONFIG } from '../../../src/config/contact.config'

export default function AboutPage() {
  return (
    <div>
      {/* Contact section */}
      <div className="flex items-center gap-2 text-gray-600">
        <Mail className="h-5 w-5 text-blue-600" />
        <ObfuscatedEmail 
          encoded={CONTACT_CONFIG.encodedEmail}
          className="hover:text-blue-600"
        />
      </div>
    </div>
  )
}
```

### 3. Update HomePage

```tsx
// apps/web/app/page.tsx
import { ContactInfo } from '../src/components/ui/ObfuscatedContact'
import { CONTACT_CONFIG } from '../src/config/contact.config'

export default function HomePage() {
  return (
    <div>
      {/* Hero section with contact info */}
      <ContactInfo
        emailEncoded={CONTACT_CONFIG.encodedEmail}
        phoneEncoded={CONTACT_CONFIG.encodedPhone}
        name={CONTACT_CONFIG.name}
        jobTitle={CONTACT_CONFIG.jobTitle}
        className="my-8"
      />
    </div>
  )
}
```

### 4. Update Profile JSON (for RAG/AI)

```json
{
  "name": "Suryadi Zhang",
  "contact": {
    "email": "[Contact form preferred]",
    "website": "https://myportfolio.mysticdatanode.net",
    "github": "https://github.com/suryadizhang",
    "linkedin": "https://www.linkedin.com/in/suryadi-zhang/"
  }
}
```

## SEO-Friendly Footer Example

```tsx
// components/Footer.tsx
import { ContactInfo } from '../components/ui/ObfuscatedContact'
import { CONTACT_CONFIG } from '../config/contact.config'

export function Footer() {
  return (
    <footer 
      className="bg-gray-50 dark:bg-gray-900"
      itemScope 
      itemType="https://schema.org/Person"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info with Schema.org */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ContactInfo
              emailEncoded={CONTACT_CONFIG.encodedEmail}
              phoneEncoded={CONTACT_CONFIG.encodedPhone}
              name={CONTACT_CONFIG.name}
              jobTitle={CONTACT_CONFIG.jobTitle}
            />
            {/* SEO metadata (hidden but indexed) */}
            <meta itemProp="url" content={CONTACT_CONFIG.social.website} />
            <meta itemProp="sameAs" content={CONTACT_CONFIG.social.linkedin} />
            <meta itemProp="sameAs" content={CONTACT_CONFIG.social.github} />
          </div>
        </div>
      </div>
    </footer>
  )
}
```

## Alternative: CSS-Only Obfuscation

For ultra-simple pages, use CSS direction:

```tsx
export function CSSObfuscatedEmail() {
  return (
    <div style={{ unicodeBidi: 'bidi-override', direction: 'rtl' }}>
      moc.liamg@ews.gnahziday rus
    </div>
  )
}
// Renders as: suryadizhang.swe@gmail.com (but reversed in HTML)
```

## Testing

1. **Test encoding:**
```bash
cd apps/web
npm run encode-contact
```

2. **Test components:**
- Open dev tools → Network tab
- Click "reveal email" button
- Verify no email visible in HTML source before click

3. **Test SEO:**
- View page source → Search for "schema.org"
- Use Google's Rich Results Test
- Verify contact info is indexable

## Migration Checklist

- [ ] Run `npm run encode-contact` to get encoded values
- [ ] Update `apps/web/src/config/contact.config.ts` with encoded values
- [ ] Replace hardcoded emails in `/contact` page
- [ ] Replace hardcoded emails in `/about` page
- [ ] Replace hardcoded emails in homepage
- [ ] Update `profile.json` to encourage form usage
- [ ] Test all contact links work
- [ ] Verify SEO metadata intact
- [ ] Check mobile responsiveness
- [ ] Deploy and monitor scraping logs

## Notes

- **Contact form is still the preferred method** - Direct contact as backup
- **Schema.org preserved** - Search engines can still index
- **Accessibility maintained** - Screen readers work normally
- **User experience unchanged** - One click reveals contact info
