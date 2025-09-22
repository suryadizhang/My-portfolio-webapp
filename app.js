#!/usr/bin/env node

/**
 * Plesk-compatible Node.js application entry point
 * This file serves as the main entry point for Plesk hosting
 */

const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');

// Set working directory to the application root
process.chdir(__dirname);

// Environment configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

console.log(`🔧 Starting application from: ${__dirname}`);
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🌐 Server: http://${hostname}:${port}`);

// Check if we have Next.js dependencies
let next;
try {
  next = require('next');
  console.log('✅ Next.js found, starting Next.js application...');
} catch (err) {
  console.error('❌ Next.js not found:', err.message);
  console.log('📦 Please run: npm install');
  process.exit(1);
}

// Check for build files
const buildPath = path.join(__dirname, 'apps', 'web', '.next');
const fs = require('fs');

if (!dev && !fs.existsSync(buildPath)) {
  console.error('❌ Production build not found at:', buildPath);
  console.log('🔧 Please run: npm run build');
  process.exit(1);
}

// Configure Next.js
const nextConfig = {
  dev,
  hostname,
  port,
  // For monorepo structure, point to the web app directory
  dir: fs.existsSync(path.join(__dirname, 'apps', 'web')) 
    ? path.join(__dirname, 'apps', 'web')
    : __dirname
};

console.log(`📁 Next.js app directory: ${nextConfig.dir}`);

// Initialize Next.js app
const app = next(nextConfig);
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      // Add CORS headers for API routes
      if (req.url.startsWith('/api/')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }
      }

      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('❌ Request handling error:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, hostname, (err) => {
    if (err) {
      console.error('❌ Server startup failed:', err);
      process.exit(1);
    }
    console.log(`✅ Server ready on http://${hostname}:${port}`);
    console.log(`🌐 Public URL: https://apiportfolio.mysticdatanode.net`);
  });

  // Graceful shutdown handlers
  const gracefulShutdown = (signal) => {
    console.log(`🔄 ${signal} received: shutting down gracefully`);
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

}).catch((err) => {
  console.error('❌ Next.js app preparation failed:', err);
  process.exit(1);
});