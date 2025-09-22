# SSH Key Setup Guide for IONOS VPS

## Step 1: Generate SSH Key Pair

Run these commands on your local machine:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@apiportfolio.mysticdatanode.net" -f ~/.ssh/ionos_vps_key

# This creates two files:
# ~/.ssh/ionos_vps_key (private key - keep secret)
# ~/.ssh/ionos_vps_key.pub (public key - add to server)
```

## Step 2: Add Public Key to VPS

### Option A: Via SSH (if password access works)
```bash
# Copy public key to VPS
ssh-copy-id -i ~/.ssh/ionos_vps_key.pub apiportfolio@108.175.12.154
```

### Option B: Via Plesk Control Panel
1. Go to **Plesk Control Panel**
2. Navigate to **Account** → **SSH Keys**
3. Click **Add SSH Key**
4. Copy contents of `~/.ssh/ionos_vps_key.pub` into the key field
5. Give it a name like "GitHub Actions"
6. Click **Add**

### Option C: Manual Setup
```bash
# Login to VPS via password
ssh apiportfolio@108.175.12.154

# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key
cat >> ~/.ssh/authorized_keys << 'EOF'
[PASTE YOUR PUBLIC KEY CONTENT HERE]
EOF

chmod 600 ~/.ssh/authorized_keys
```

## Step 3: Test SSH Key Authentication

```bash
# Test the connection
ssh -i ~/.ssh/ionos_vps_key apiportfolio@108.175.12.154

# If successful, you should login without password prompt
```

## Step 4: Add Private Key to GitHub Secrets

1. **Copy private key content:**
   ```bash
   # On Windows
   type %USERPROFILE%\.ssh\ionos_vps_key
   
   # On Mac/Linux  
   cat ~/.ssh/ionos_vps_key
   ```

2. **Add to GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `SSH_PRIVATE_KEY`
   - Value: [Paste the entire private key content, including -----BEGIN and -----END lines]
   - Click **Add secret**

## Step 5: Test the New Deployment

After setting up SSH keys:
1. The new workflow `deploy-ssh-key.yml` will use SSH key authentication
2. This is more reliable than password authentication
3. Should resolve the SSH connection issues

## Troubleshooting

If SSH key authentication fails:
1. Check that the public key was added correctly to `~/.ssh/authorized_keys` on VPS
2. Verify file permissions: `chmod 600 ~/.ssh/authorized_keys`
3. Ensure SSH service allows key authentication (usually enabled by default)
4. Test manually before running GitHub Actions

## Security Benefits

- SSH keys are more secure than passwords
- Private key never leaves GitHub (encrypted in secrets)
- No risk of password brute force attacks
- Industry standard for automated deployments