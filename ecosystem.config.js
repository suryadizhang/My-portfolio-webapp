module.exports = {
  apps: [{
    name: 'portfolio-web',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/vhosts/apiportfolio.mysticdatanode.net/httpdocs',
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
    
    // Health check
    health_check_url: 'http://localhost:3000/api/health',
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true,
    // Restart policy
    restart_delay: 4000,
    max_restarts: 5,
    min_uptime: '10s'
  }]
};