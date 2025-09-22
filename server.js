#!/usr/bin/env node

/**
 * Production server startup script for Next.js application
 * This file is used by Plesk to start the Node.js application
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

console.log(`🚀 Starting Next.js application in ${dev ? 'development' : 'production'} mode...`);
console.log(`📍 Server will run on http://${hostname}:${port}`);

// In production, try to use the standalone server first
if (!dev && process.env.NODE_ENV === 'production') {
  const standaloneServer = path.join(__dirname, '.next/standalone/server.js');
  
  if (fs.existsSync(standaloneServer)) {
    console.log('🎯 Using Next.js standalone server...');
    
    // Set environment variables for standalone server
    process.env.HOSTNAME = hostname;
    process.env.PORT = port.toString();
    
    try {
      require(standaloneServer);
      return; // Exit this script if standalone server starts successfully
    } catch (error) {
      console.warn('⚠️ Standalone server failed, falling back to regular Next.js server:', error.message);
    }
  } else {
    console.log('� No standalone server found, using regular Next.js server');
  }
}

// Fallback to regular Next.js server
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, (err) => {
    if (err) {
      console.error('❌ Failed to start server:', err);
      process.exit(1);
    }
    console.log(`✅ Server ready on http://${hostname}:${port}`);
    console.log(`🌐 Application URL: https://apiportfolio.mysticdatanode.net`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🔄 SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
  });
});