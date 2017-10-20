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


const formatValue = function(value) {
    return typeof value == 'undefined' ? 'N/A' : value;
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


const loadMarkets = async(ids = exchangeList) => {
    ids.forEach((id) => {
        let exchange = ccxt[id]();
        exchange.loadMarkets();
        log.darkGray(exchange.name, 'market data loaded.');
    })
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
const init = async() => {
    loadMarkets().then(() => {
        log.green(`Loaded market data from ${exchanges.length.toString().bright} exchanges`)
    });
};
init();


// Exports
module.exports = {
    exchanges: exchanges,
    formatValue: formatValue
};