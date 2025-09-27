module.exports = {
  apps: [{
    name: 'portfolio-web',
    // For standalone builds, run the server.js directly
    script: 'apps/web/server.js',
    cwd: '/var/www/vhosts/apiportfolio.mysticdatanode.net/portfolio-app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0',
      NEXT_PUBLIC_SITE_URL: 'https://apiportfolio.mysticdatanode.net'
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Health check - check root instead of non-existent /api/health
    health_check_url: 'http://localhost:3000/',
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true,
    // Restart policy
    restart_delay: 4000,
    max_restarts: 5,
    min_uptime: '10s'
  }]
};