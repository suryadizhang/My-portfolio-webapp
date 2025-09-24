# Email Configuration Guide

This guide will help you set up automated email responses for your portfolio contact form using either Resend (recommended) or Gmail SMTP.

## Email Features

✅ **Contact Form Notifications** - Receive emails when someone contacts you  
✅ **Automated Thank You Responses** - Send automatic confirmation emails to users  
✅ **Professional Templates** - Beautiful HTML email templates  
✅ **Rate Limiting** - Prevent spam and abuse  
✅ **Contact Logging** - Track all contact attempts for analytics

## Option 1: Resend (Recommended)

[Resend](https://resend.com) offers reliable email delivery with better deliverability rates.

### Setup Steps:

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account (100 emails/day free)

2. **Get API Key**
   - Go to your Resend dashboard
   - Navigate to API Keys
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Configure Domain (Optional but Recommended)**
   - Add your domain in Resend dashboard
   - Add DNS records for better deliverability
   - Verify domain ownership

4. **Environment Variables**
   ```bash
   # Add to your .env.local
   RESEND_API_KEY=re_your_api_key_here
   FROM_EMAIL="Suryadi Zhang <portfolio@yourdomain.com>"
   TO_EMAIL=suryadizhang.swe@gmail.com
   ```

## Option 2: Gmail SMTP

Use Gmail's SMTP server with an app-specific password.

### Setup Steps:

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Security → 2-Step Verification
   - Enable 2FA if not already enabled

2. **Generate App Password**
   - Go to Google Account → Security
   - Under "2-Step Verification", click "App passwords"
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Environment Variables**
   ```bash
   # Add to your .env.local
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=suryadizhang.swe@gmail.com
   SMTP_PASS=your_16_character_app_password
   FROM_EMAIL="Suryadi Zhang <suryadizhang.swe@gmail.com>"
   TO_EMAIL=suryadizhang.swe@gmail.com
   ```

## Security Configuration

Add these optional security settings:

```bash
# For privacy-compliant IP hashing
IP_SALT=your_random_long_string_here
```

## Testing the Setup

1. **Start your development server**
   ```bash
   cd apps/web
   npm run dev
   ```

2. **Test the contact form**
   - Go to `/contact` on your site
   - Fill out and submit the form
   - Check your email for notifications

3. **Check the API health**
   - Visit `/api/contact` (GET request)
   - Should show service status and configuration

## Email Templates

The system includes two types of emails:

### 1. Contact Notification (to you)
- Beautiful HTML template with contact details
- Quick action buttons for replying
- Company research links
- Contact categorization

### 2. Thank You Email (to user)
- Professional confirmation message
- Links to your social profiles
- Message summary for reference
- Your contact information

## Troubleshooting

### Common Issues:

1. **Emails not sending**
   - Check API key/credentials are correct
   - Verify environment variables are loaded
   - Check server logs for errors

2. **Low deliverability with Gmail**
   - Consider switching to Resend
   - Make sure 2FA and app passwords are set up correctly

3. **Rate limiting errors**
   - Default limit is 5 emails per 15 minutes per IP
   - Adjust in the contact API if needed

### Development Testing:

For development, you can use a service like [Mailtrap](https://mailtrap.io) to catch emails without sending them:

```bash
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_password
```

## Production Deployment

### Vercel Environment Variables:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the email configuration variables

### Domain Configuration:

If using a custom domain, make sure to:
- Update `NEXT_PUBLIC_SITE_URL` to your production URL
- Configure proper DNS records if using Resend
- Update any hardcoded links in email templates

## Contact Analytics

The system automatically logs all contact attempts to `apps/web/data/logs/contacts.jsonl` including:
- Contact details (name, email, subject)
- Timestamp and IP hash
- Success/failure status
- User agent information

This helps you track engagement and troubleshoot issues.

---

**Need Help?**  
If you encounter any issues with email setup, check the server logs or contact me at suryadizhang.swe@gmail.com.