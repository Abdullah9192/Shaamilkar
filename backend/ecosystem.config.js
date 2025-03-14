module.exports = {
  apps : [{
    name   : "backend",
    script : "./server.js",
    instances: "max", // Use all available CPU cores
    exec_mode: "cluster", // Cluster mode for better performance
    env: {
      NODE_ENV: "production",
    },
    env_development: {
      NODE_ENV: "development",
    },
    watch: true, // 
  }]
}
