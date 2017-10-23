"use strict";

const ccxt = require('ccxt');
const table = require('as-table');
const log = require('ololog').configure({ locate: false });
require('ansicolor').nice;

const exchangeList = ['binance', 'bitbay', 'bitfinex', 'bitstamp', 'bittrex', 'cex', 'cryptopia', 'gatecoin', 'gdax', 'kraken', 'poloniex'];
//const exchangeList = ['binance', 'bitbay'];
let exchanges = ccxt.exchanges.filter((id) => exchangeList.includes(id));
exchangeList.forEach((id) => exchanges[id] = ccxt[id]);
//exchanges = ccxt;


process.on('uncaughtException', e => {
    log.bright.red.error(e);
    //process.exit(1);
});
process.on('unhandledRejection', e => {
    log.bright.red.error(e);
    //process.exit(1);
});


function formatValue(value) {
    return typeof value == 'undefined' ? 'N/A' : value;
};

function getSymbol(symbol) {
    if (!symbol.includes('/')) { // Default to BTC if currency was provided instead of pair symbol
        symbol = symbol.concat('/BTC');
    }
    return symbol;
};

/*
const getExchanges = function(ids = exchangeList) {
    let exchanges = [];
    ids.forEach((id) => {
        let exchange = ccxt[id]();
        exchange.loadMarkets();
        //log.darkGray(exchange.name, 'market data loaded.');
        exchanges[id] = exchange;
    });
    exchanges.length = Object.keys(exchanges).length;
    log.green('Loaded market data from', exchanges.length.toString().bright, 'exchanges');
    return exchanges;
};
const exchanges = getExchanges();
*/

let symbols = [];
let currencies = {};

async function loadMarkets(ids = exchangeList) {
    for(let id of ids) {
        let exchange = ccxt[id]();
        await exchange.loadMarkets().then(() => {
            for(let sym of exchange.symbols) {
                if(symbols[sym]==undefined)  { symbols[sym] = []; }
                symbols[sym].push(exchange.id); 
            }; // Exchanges per symbol
            for(let cur of exchange.currencies) {
                if(currencies[cur]==undefined)  { currencies[cur] = []; }
                currencies[cur].push(exchange.id); 
            }; // Exchanges per currency
            log.darkGray(exchange.name, 'market data loaded');
         });
    };
}

/*
const getMarketSymbols = async(id) => {
    let exchange = new ccxt[id]();
    let markets = getMarkets(id);
    let symbols = Object.keys(markets);
    return symbols;
}

let getMarket = function(exchange, symbol) {
    return symbol;
};
*/

// Init
async function init() {
    await loadMarkets().then(() => {
        log.green(`Loaded market data from ${exchanges.length.toString().bright} exchanges`);
    });
};
init();


// Exports
module.exports = {
    exchanges: exchanges,
    symbols: symbols,
    currencies: currencies,
    formatValue: formatValue,
    getSymbol: getSymbol
};