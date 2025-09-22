#!/bin/bash

# IONOS VPS Setup Script for Docker Deployment
# Run this script on the VPS to install Docker and set up the environment

set -euo pipefail

echo "=== IONOS VPS Docker Setup ==="

# Update system packages
echo "Updating system packages..."
sudo dnf update -y

# Install Docker Engine
echo "Installing Docker Engine..."
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
echo "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
echo "Adding user to docker group..."
sudo usermod -aG docker $USER

# Install Docker Compose (standalone)
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create deployment directories
echo "Creating deployment directories..."
sudo mkdir -p /var/www/vhosts/apiportfolio.mysticdatanode.net/app
sudo chown -R $USER:$USER /var/www/vhosts/apiportfolio.mysticdatanode.net/app

# Verify installation
echo "Verifying Docker installation..."
docker --version
docker-compose --version

# Test Docker without sudo
echo "Testing Docker access..."
docker run hello-world

echo "=== Setup completed successfully! ==="
echo "Please log out and log back in for group changes to take effect."
echo "Or run: newgrp docker"