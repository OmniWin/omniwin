module.exports = {
  apps: [
    {
      name: "Process Tickets",
      script: "./events/processTickets.ts",
      interpreter: "ts-node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        RPC_URL: process.env.RPC_URL
        // RPC_URL: process.env.RPC_URL || "wss://goerli.infura.io/ws/v3/79bdc3b4b1a94c99b98a102ee1d87b9b"
      }
    },
    {
      name: "Process Lots",
      script: "./events/processLots.ts",
      interpreter: "ts-node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        RPC_URL: process.env.RPC_URL
        // RPC_URL: process.env.RPC_URL || "wss://goerli.infura.io/ws/v3/79bdc3b4b1a94c99b98a102ee1d87b9b"
      }
    }
  ]
};
