require('dotenv').config({ path: '../.env' })
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  networks: {
    amoy: {
      provider: () =>
        new HDWalletProvider(
          process.env.TRUFFLE_DEPLOYMENT_KEY,
          process.env.ANKR_POLYGON_RPC_URL,
        ),
      network_id: 80002, // Polygon Amoy's network ID
      confirmations: 2, // Number of confirmations to wait for
      timeoutBlocks: 200, // Timeout for blocks
      skipDryRun: true, // Skip dry run before migrations,
      gasPrice: 100 * 1e9, // 100 GWEI (Get more polygon Amoy from here: https://faucet.polygon.technology/)
    },
  },

  // Specify Solidity compiler version
  compilers: {
    solc: {
      version: '0.8.21', // Match the Solidity version in your contract
    },
  },
}
