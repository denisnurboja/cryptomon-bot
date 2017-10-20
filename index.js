const db = require('./db');
const bot = require('./bot');
const web = require('./web');
const ccxt = require('./ccxt');
const log = require('ololog').configure({ locate: false });
require('ansicolor').nice;