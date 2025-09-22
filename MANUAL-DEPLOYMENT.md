# Manual Deployment Guide for IONOS VPS

## Option 1: Deploy via Plesk File Manager

### Step 1: Create Files Locally
1. Build the project: `npm run build`
2. Create deployment package manually:
   ```bash
   cd apps/web
   tar -czf ../../manual-deployment.tar.gz .next public package.json
   cd ../../
   tar -rzf manual-deployment.tar.gz app.js package.json
   ```

### Step 2: Upload via Plesk
1. Go to Plesk Control Panel
2. Navigate to **File Manager**
3. Go to `/httpdocs/` directory
4. Upload the `manual-deployment.tar.gz` file
5. Extract it using Plesk's extract feature
6. Ensure `app.js` is in the root directory

### Step 3: Configure Node.js in Plesk
1. Go to **Node.js** settings
2. Set **Application Startup File** to `app.js`
3. Click **Apply**
4. Click **Restart App**

## Option 2: SSH Configuration Check

### Check SSH Access in IONOS/Plesk:

1. **In Plesk Control Panel:**
   - Go to **Tools & Settings** → **SSH Terminal Access**
   - Ensure SSH is enabled for your domain/subscription
   - Check if your user has SSH access permissions

2. **SSH Key vs Password:**
   - Current setup uses password authentication
   - Consider enabling SSH key authentication for better security

3. **User Permissions:**
   - Verify the user has read/write access to `/var/www/vhosts/`
   - Check if the user can execute commands like `mkdir`, `tar`, etc.

### Test SSH Connection Manually:
```bash
ssh -p 22 apiportfolio@108.175.12.154
# Enter password when prompted
# Try basic commands:
whoami
pwd
ls -la /var/www/vhosts/
```

## Option 3: Alternative GitHub Actions with Different SSH Tool

Try using a different SSH action that might handle IONOS/Plesk better:
- `webfactory/ssh-agent`
- `shimataro/ssh-key-action`  
- Direct `rsync` approach

## Troubleshooting Checklist:

- [ ] SSH is enabled in Plesk for your user
- [ ] User has proper file system permissions
- [ ] Firewall allows SSH connections on port 22
- [ ] User password is correct in GitHub Secrets
- [ ] Domain name secret is correct (no typos)
- [ ] VPS IP address is accessible

## Quick Test:
Try accessing your VPS directly:
1. Open a terminal/command prompt
2. Run: `ssh apiportfolio@108.175.12.154`
3. Enter your password
4. If successful, the GitHub Actions should work too