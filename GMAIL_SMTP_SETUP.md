# 📧 Gmail SMTP Setup Guide

This guide will walk you through setting up Gmail SMTP for your portfolio's contact form with automated email responses.

## 🔐 **Step 1: Enable 2-Factor Authentication**

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Click on "Security" in the left sidebar

2. **Enable 2-Step Verification**
   - Find "2-Step Verification" section
   - Click "Get Started" or "Turn On" if not already enabled
   - Follow the setup process with your phone number
   - **Important**: 2FA must be enabled to generate app passwords

## 🔑 **Step 2: Generate App-Specific Password**

1. **Access App Passwords**
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords

2. **Create New App Password**
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other (custom name)"
   - Enter a name like: "Portfolio Contact Form"
   - Click "Generate"

3. **Copy the Password**
   - Google will show you a 16-character password (like: `abcd efgh ijkl mnop`)
   - **Copy this immediately** - you won't be able to see it again!
   - Remove the spaces when using it: `abcdefghijklmnop`

## 💻 **Step 3: Local Development Setup**

Your `.env.local` file has been updated with the Gmail SMTP configuration. You just need to:

1. **Update the app password**:
   ```bash
   # Replace this line in your .env.local:
   SMTP_PASS=your_16_character_app_password_here
   
   # With your actual app password:
   SMTP_PASS=abcdefghijklmnop
   ```

2. **Update the salt for security**:
   ```bash
   # Replace this line:
   IP_SALT=local_development_salt_change_this_to_random_string
   
   # With a random string:
   IP_SALT=my_super_random_salt_string_12345
   ```

## 🚀 **Step 4: Production Setup (GitHub Secrets)**

For production deployment, add these secrets to your GitHub repository:

### **How to Add GitHub Secrets:**

1. **Go to your repository**: https://github.com/suryadizhang/My-portfolio-webapp
2. **Click Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Add each secret** one by one:

```bash
# Email Configuration
SMTP_HOST              = smtp.gmail.com
SMTP_PORT              = 587
SMTP_SECURE            = false
SMTP_USER              = suryadizhang.swe@gmail.com
SMTP_PASS              = abcdefghijklmnop  # Your app password
FROM_EMAIL             = "Suryadi Zhang <suryadizhang.swe@gmail.com>"
TO_EMAIL               = suryadizhang.swe@gmail.com
IP_SALT                = production_random_salt_different_from_local
```

### **Security Best Practice:**
- Use a **different** `IP_SALT` for production than development
- Never commit your app password to git
- Regularly rotate your app passwords

## 🧪 **Step 5: Testing the Setup**

### **Local Testing:**

1. **Start your development server**:
   ```bash
   cd "c:\Users\surya\projects\my portfolio\apps\web"
   npm run dev
   ```

2. **Test the contact form**:
   - Go to: http://localhost:3000/contact
   - Fill out the form with your own email address
   - Submit the form

3. **Check your emails**:
   - **Your inbox**: Should receive a contact notification
   - **Test email address**: Should receive a thank you message

### **Verify API Health:**

Visit: http://localhost:3000/api/contact (GET request)

You should see something like:
```json
{
  "status": "operational",
  "timestamp": "2025-09-23T...",
  "emailService": {
    "resend": false,
    "smtp": true
  },
  "configuration": {
    "fromEmail": true,
    "toEmail": true,
    "rateLimiting": true
  }
}
```

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"Authentication failed" error**
   - Make sure 2FA is enabled on your Gmail account
   - Double-check your app password is correct (16 characters, no spaces)
   - Make sure you're using `suryadizhang.swe@gmail.com`

2. **"Connection refused" error**
   - Check your internet connection
   - Verify SMTP settings are correct
   - Try using port 465 with `SMTP_SECURE=true` as alternative

3. **Emails not being delivered**
   - Check spam folders
   - Verify the FROM_EMAIL format is correct
   - Make sure TO_EMAIL matches your actual email

### **Alternative SMTP Settings (if needed):**

If port 587 doesn't work, try:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

## 🎯 **Expected Behavior**

When everything is set up correctly:

1. **User submits contact form**
2. **System sends two emails**:
   - **To you**: Notification with contact details and quick action buttons
   - **To user**: Professional thank you message with your contact info
3. **Form shows success message**: "Thank you for your message! I'll get back to you soon. A confirmation email has been sent to your inbox."

## 📋 **Next Steps After Setup**

1. **Test thoroughly** with different email addresses
2. **Monitor the contact logs** in `apps/web/data/logs/contacts.jsonl`
3. **Deploy to production** with GitHub Actions
4. **Set up monitoring** to track email delivery rates

---

**Need Help?**  
If you encounter issues, check the server logs or contact me for assistance. The Gmail SMTP setup is robust and should work reliably once configured properly!