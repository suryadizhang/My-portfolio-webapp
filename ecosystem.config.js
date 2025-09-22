module.exports = {
  apps: [{
    name: 'portfolio-web',
    script: 'npm',
    args: 'run start',
    cwd: '/var/www/vhosts/apiportfolio.mysticdatanode.net/httpdocs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_SITE_URL: 'https://apiportfolio.mysticdatanode.net'
    },
    error_file: '/var/log/portfolio-error.log',
    out_file: '/var/log/portfolio-out.log',
    log_file: '/var/log/portfolio-combined.log',
    time: true,
    
    // Health monitoring
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true
  }]
};