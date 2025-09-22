#!/bin/bash

# VPS Node.js and PM2 Setup Script
# This script will be executed on the VPS to set up the Node.js environment

echo "=== VPS Node.js Setup Script ==="

# Install PM2 globally
echo "Installing PM2 globally..."
npm install -g pm2
echo "PM2 version: $(pm2 --version)"

# Create symbolic links to make node and npm available in standard locations
echo "Creating symbolic links for Node.js binaries..."
ln -sf /usr/bin/node /usr/local/bin/node
ln -sf /usr/bin/npm /usr/local/bin/npm
ln -sf /usr/bin/npx /usr/local/bin/npx

# Add Node.js to PATH for all users
echo "Setting up Node.js PATH for all users..."
cat >> /etc/profile << 'EOF'
# Node.js PATH
export PATH="/usr/bin:/usr/local/bin:$PATH"
EOF

# Set up PATH specifically for apiportfolio user
echo "Setting up .bashrc for apiportfolio user..."
sudo -u apiportfolio bash -c 'cat >> ~/.bashrc << "EOF"
# Node.js PATH
export PATH="/usr/bin:/usr/local/bin:$PATH"
EOF'

# Test Node.js access for apiportfolio user
echo "Testing Node.js access for apiportfolio user..."
sudo -u apiportfolio bash -c 'source ~/.bashrc && node --version && npm --version'

echo "=== Setup Complete ==="