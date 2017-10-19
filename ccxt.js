"use strict";

const ccxt = require('ccxt');
const table = require('as-table');
const log = require('ololog').configure({ locate: false });
require('ansicolor').nice;

const exchangeList = ['binance', 'bitbay', 'bitfinex', 'bitstamp', 'bittrex', 'cex', 'cryptopia', 'gatecoin', 'gdax', 'kraken', 'poloniex'];
const exchanges = ccxt.exchanges.filter((id) => exchangeList.includes(id));

let formatPrice = function(price) {
    return typeof price == 'undefined' ? 'N/A' : price;
};

const loadAllMarkets = async() => {
    exchangeList.forEach((id) => {
        let exchange = ccxt[id]();
        exchange.loadMarkets();
        log(exchange.name, 'market data loaded.');
    })
}


/*
const getExchange = function(id) {
  let exchange = new ccxt[id]();
  return exchange;
}

const getMarkets = async(id) => {
    let exchange = getExchange(id);
    let markets = await exchange.loadMarkets();
    return markets;
}

const getMarketSymbols = async(id) => {
    let exchange = new ccxt[id]();
    let markets = getMarkets(id);
    let symbols = Object.keys(markets);
    return symbols;
}
*/

let getExchange = function(id) {
    if (ccxt.exchanges.indexOf(id) > -1) {
        let exchange = new(ccxt)[id]();
        exchange.loadMarkets();
        //await loadMarkets(exchange);
    }
    return exchange;
};

let getExchanges = function(ids) {
    let exchanges = {};
    ids.forEach((id) => { exchanges[id] = module.exports.getExchange(id); });
    return exchanges;
};

let getMarket = function(exchange, symbol) {
    return symbol;
};

// Init
const init = async() => {
    loadAllMarkets().then(() => { log.green(`Loaded market data from ${ccxt.exchanges.length.toString()} exchanges`) });
};
init();

module.exports = {
    exchanges: exchanges,
    formatPrice: formatPrice
};