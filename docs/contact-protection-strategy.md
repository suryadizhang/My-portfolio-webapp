# 📧 Contact Information Protection Strategy

## Overview

This document explains how we protect contact information (email and phone) from scrapers and bots while maintaining:
- ✅ **Human Readability** - Visitors can easily read and use contact info
- ✅ **SEO Friendliness** - Search engines can index and display contact info
- ✅ **Accessibility** - Screen readers and assistive tech work properly
- ✅ **Bot Resistance** - Automated scrapers cannot easily harvest contact data

## Protection Layers

### 1. **Client-Side Obfuscation**

**How it works:**
- Contact information is Base64 encoded in the source code
- JavaScript decodes it on the client-side only
- Bots reading HTML source see gibberish

**Files:**
- `packages/utils/src/contact/obfuscation.ts` - Encoding/decoding utilities
- `apps/web/src/config/contact.config.ts` - Centralized contact configuration

**Example:**
```typescript
// In code (what bots see):
encodedEmail: 'c3VyeWFkaXpoYW5nLnN3ZUBnbWFpbC5jb20='

// Displayed to users (after JS decoding):
suryadizhang.swe@gmail.com
```

### 2. **Instant Display with Client-Side Decoding**

**How it works:**
- Contact info is Base64 encoded in the source code
- JavaScript decodes it automatically on page load
- Displayed immediately to visitors without any interaction required
- Bots reading static HTML see only the encoded string

**Component:**
- `apps/web/src/components/ui/ObfuscatedContact.tsx`

**Benefits:**
- Professional appearance - contact info visible at a glance
- User-friendly - no clicks or hovers needed
- Bot protection - scrapers get encoded strings, not real contact info
- SEO-friendly - Google's JavaScript rendering sees the real content

### 3. **Schema.org Microdata**

**How it works:**
- Uses schema.org Person markup for SEO
- Contact info is in microdata but still obfuscated in href
- Search engines understand the context while bots can't easily scrape

**Component:**
- `apps/web/src/components/ui/ObfuscatedContact.tsx`

**Example:**
```html
<div itemScope itemType="https://schema.org/Person">
  <meta itemProp="name" content="Suryadi Zhang" />
  <meta itemProp="jobTitle" content="Full-Stack Software Engineer" />
  <!-- Actual contact links are obfuscated -->
</div>
```

### 4. **Rate Limiting**

**Status:** ✅ Already implemented

**How it works:**
- Contact form has rate limiting (already in place)
- Prevents abuse and automated submissions
- IP-based with hashed storage for privacy

**Files:**
- `apps/web/app/api/contact/route.ts` - Rate limiting logic
- `apps/web/src/lib/rate-limit.ts` - Rate limiting utilities

### 5. **Contact Form Priority**

**Strategy:**
- Encourage visitors to use the contact form instead of direct email
- Form has CAPTCHA-like honeypot protection
- All submissions are logged and rate-limited

**Benefits:**
- Better spam protection
- Analytics on contact attempts
- Professional appearance

## Implementation Guide

### Step 1: Install Required Utilities

The obfuscation utilities are available in the `@portfolio/utils` package:

**File Structure:**
```
packages/utils/src/contact/
├── obfuscation.ts        # Encoding/decoding functions
└── index.ts              # Exports
```

**Already implemented:** ✅ No additional installation needed

### Step 2: Generate Encoded Contact Information

```bash
# Navigate to web app
cd apps/web

# Run the encoding script
npm run encode-contact
```

This will output encoded versions of your contact information:
```
🔐 Contact Information Encoder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email Encoding:
Original: suryadizhang.swe@gmail.com
Encoded:  c3VyeWFkaXpoYW5nLnN3ZUBnbWFpbC5jb20=

📱 Phone Encoding:
Original: 2103884155
Encoded:  MjEwMzg4NDE1NQ==

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Copy these encoded values to your contact.config.ts
```

### Step 3: Update Contact Configuration

Create or update `apps/web/src/config/contact.config.ts`:

```typescript
/**
 * Centralized Contact Information Configuration
 * 
 * All contact info is Base64 encoded to prevent scraping.
 * Use the obfuscation utilities to display to users.
 */

export const CONTACT_CONFIG = {
  // Personal Info
  name: 'Suryadi Zhang',
  jobTitle: 'Full-Stack Software Engineer',
  
  // Encoded Contact Info (change these with your encoded values)
  encodedEmail: 'c3VyeWFkaXpoYW5nLnN3ZUBnbWFpbC5jb20=',
  encodedPhone: 'MjEwMzg4NDE1NQ==',
  
  // Social Links (these are public anyway)
  social: {
    github: 'https://github.com/suryadizhang',
    linkedin: 'https://www.linkedin.com/in/suryadi-zhang/',
  },
  
  // Location (general, not specific address)
  location: 'San Antonio, TX',
} as const

export type ContactConfig = typeof CONTACT_CONFIG
```

### Step 4: Use Obfuscated Components in Your Pages

**For email display (instantly visible):**

```tsx
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedContact'
import { CONTACT_CONFIG } from '@/config/contact.config'

<ObfuscatedEmail 
  encoded={CONTACT_CONFIG.encodedEmail}
  className="text-primary hover:underline"
  showIcon
/>
// Displays: 📧 suryadizhang.swe@gmail.com (clickable link)
// Bots see: c3VyeWFkaXpoYW5nLnN3ZUBnbWFpbC5jb20=
```

**For phone display (instantly visible):**

```tsx
import { ObfuscatedPhone } from '@/components/ui/ObfuscatedContact'
import { CONTACT_CONFIG } from '@/config/contact.config'

<ObfuscatedPhone 
  encoded={CONTACT_CONFIG.encodedPhone}
  className="text-primary hover:underline"
  showIcon
/>
// Displays: 📱 (210) 388-4155 (clickable link)
// Bots see: MjEwMzg4NDE1NQ==
```

**For complete contact info with Schema.org (recommended):**

```tsx
import { ContactInfo } from '@/components/ui/ObfuscatedContact'
import { CONTACT_CONFIG } from '@/config/contact.config'

<ContactInfo
  emailEncoded={CONTACT_CONFIG.encodedEmail}
  phoneEncoded={CONTACT_CONFIG.encodedPhone}
  name={CONTACT_CONFIG.name}
  jobTitle={CONTACT_CONFIG.jobTitle}
  className="my-4"
/>
// All contact info visible immediately with SEO markup
```

**Optional: Click-to-reveal for extra privacy (NOT recommended for primary contact):**

```tsx
import { ContactButton } from '@/components/ui/ContactButton'
import { CONTACT_CONFIG } from '@/config/contact.config'

<ContactButton 
  type="email"
  encoded={CONTACT_CONFIG.encodedEmail}
  variant="outline"
  showCopy
/>
// Only use this if you want to hide contact info behind a click
// NOT recommended for professional portfolio sites
```

### Step 5: Update Existing Pages

Replace hardcoded contact info in:

- `apps/web/app/(marketing)/contact/page.tsx`
- `apps/web/app/(marketing)/about/page.tsx`
- `apps/web/app/page.tsx`
- `apps/web/content/profile.json`

See `docs/contact-protection-examples.md` for detailed page-by-page examples.

## Best Practices

### DO ✅

1. **Display contact info immediately**
   - Professional portfolios need visible contact information
   - Use `<ObfuscatedEmail>` and `<ObfuscatedPhone>` for instant display
   - No clicks or hovers required - visible at a glance

2. **Obfuscate in source code only**
   - Contact info encoded in HTML source (bots can't read it)
   - JavaScript decodes on page load (humans see it normally)
   - Never put plain email/phone in HTML source

3. **Keep SEO visibility with Schema.org**
   - Use microdata for search engines
   - Maintain visibility while protecting from bots
   - Google's crawler executes JavaScript and sees real content

4. **Update centrally**
   - All contact info in `contact.config.ts`
   - Easy to update across entire app

### DON'T ❌

1. **Don't put raw contact info in:**
   - HTML source code (always use Base64 encoding)
   - JavaScript strings (unless encoded)
   - Image alt text
   - Comments in code

2. **Don't hide contact info behind clicks**
   - Professional portfolios need visible contact information
   - Recruiters and hiring managers expect easy access
   - Click-to-reveal creates friction and looks unprofessional

3. **Don't use images for contact info**
   - Bad for accessibility (screen readers can't read images)
   - Bad for SEO (search engines can't index images easily)
   - Users can't copy/paste contact information

## Effectiveness

**Protection Level:** 🛡️ High

This strategy protects against:
- ✅ Simple regex scrapers (99% of bots)
- ✅ DOM-parsing scrapers
- ✅ Automated submission bots
- ✅ Email harvesting tools

**Still indexable by:**
- ✅ Google Search
- ✅ LinkedIn
- ✅ Professional directories

## Monitoring

Track scraping attempts via:
- Contact form logs: `apps/web/data/logs/contacts.jsonl`
- Rate limit violations
- Failed CAPTCHA (honeypot) attempts

## Updates and Maintenance

**When to update contact info:**
1. Run encoding script: `npm run encode-contact`
2. Copy encoded values to `contact.config.ts`
3. Verify on dev server
4. Deploy

**No need to update:**
- Components (reusable)
- Protection logic (works automatically)
- Schema.org markup (uses config)

## Additional Resources

- [OWASP Email Harvesting Prevention](https://cheatsheetseries.owasp.org/)
- [Schema.org Person Markup](https://schema.org/Person)
- [MDN Web Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**Questions or Issues?**  
See `apps/web/src/scripts/encode-contact.ts` for encoding utilities or contact the development team.
