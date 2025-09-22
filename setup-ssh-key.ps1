# SSH Key Setup Script
$pubkey = Get-Content "$env:USERPROFILE\.ssh\ionos_vps_key.pub" -Raw
$pubkey = $pubkey.Trim()

Write-Host "Setting up SSH key on VPS..."
Write-Host "You'll need to enter the password for apiportfolio@108.175.12.154"

# Create SSH directory and add public key
$command = "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$pubkey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo 'SSH key added successfully'"

ssh apiportfolio@108.175.12.154 $command