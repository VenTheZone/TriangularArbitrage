// Load logger library
const logger = require('./lib/LoggerCore');
const Web3 = require('web3');

var env = require('node-env-file');
try {
  env(__dirname + '/.keys');
} catch (e) {
  console.warn('No .keys was provided, running with defaults.');
}
env(__dirname + '/conf.ini');

const web3 = new Web3('https://rpc-mainnet.maticvigil.com');

logger.info('\n\n\n----- Bot Starting : -----\n\n\n');

var exchangeAPI = {};

logger.info('--- Loading Exchange API');

// TODO: Add Uniswap/Polygon logic here
// const uniswap = new Uniswap(web3); // Placeholder, actual Uniswap API initialization may differ

var botOptions = {
  UI: {
    title: 'Top Potential Arbitrage Triplets, via Uniswap on Polygon'
  },
  arbitrage: {
    paths: process.env.uniswapColumns.split(','),
    start: process.env.uniswapStartingPoint
  },
  storage: {
    logHistory: false
  },
  trading: {
    paperOnly: true,
    minQueuePercentageThreshold: 3,
    minHitsThreshold: 5
  }
},
ctrl = {
  options: botOptions,
  storage: {
    trading: {
      queue: [],
      active: []
    },
    candidates: [],
    streams: [],
    pairRanks: []
  },
  logger: logger,
  exchange: exchangeAPI // This will hold your Uniswap/Polygon API later
};

ctrl.UI = require('./lib/UI')(ctrl.options),
ctrl.events = require('./lib/EventsCore')(ctrl);

// We're ready to start. Load up the webhook streams and start making it rain.
require('./lib/BotCore')(ctrl);

ctrl.logger.info('----- Bot Startup Finished -----');
