"use strict";

//const ccxt = require('ccxt')
const ccxt = require('./ccxt')
const log = require('ololog').configure({ locate: false })
require('ansicolor').nice;

try {
    let exchanges = ccxt.getExchanges(['bittrex', 'bitfinex', 'binance', 'gdax']);
    let exchange = exchanges['binance'];
    exchange.loadMarkets();
    console.log(Object.keys(exchange.markets));
    log('Loaded', Object.keys(exchange.markets).length.toString().yellow, 'markets,', exchange.symbols.length.toString().bright.green, 'symbols and', exchange.currencies.length.toString().bright.cyan, 'currencies from', exchange.name.green);
} catch (e) {
    //log.bright.red(exchange.id, '[Error] ' + e.message);
    log.bright.red('[Error] ' + e.message);
}

/*


process.on('uncaughtException', e => {
    log.bright.red.error(e);
    process.exit(1);
});
process.on('unhandledRejection', e => {
    log.bright.red.error(e);
    process.exit(1);
});

let exchangeList = ['binance', 'gdax'];
//let exchangeList = ['bittrex', 'bitfinex', 'binance', 'gdax'];
//let symbolList = ['BTC', 'bitfinex', 'binance', 'gdax'];

let exchanges = {};

let loadMarkets = async function(exchange) {
    try {
        await exchange.loadMarkets();
        log(exchange.name.green, 'loaded', exchange.symbols.length.toString().bright.green, 'symbols');
    } catch (e) {
        if (e instanceof ccxt.DDoSProtection) {
            log.bright.yellow(exchange.id, '[DDoS Protection] ' + e.message);
        } else if (e instanceof ccxt.RequestTimeout) {
            log.bright.yellow(exchange.id, '[Request Timeout] ' + e.message);
        } else if (e instanceof ccxt.AuthenticationError) {
            log.bright.yellow(exchange.id, '[Authentication Error] ' + e.message);
        } else if (e instanceof ccxt.ExchangeNotAvailable) {
            log.bright.yellow(exchange.id, '[Exchange Not Available] ' + e.message);
        } else if (e instanceof ccxt.ExchangeError) {
            log.bright.yellow(exchange.id, '[Exchange Error] ' + e.message);
        } else if (e instanceof ccxt.NetworkError) {
            log.bright.yellow(exchange.id, '[Network Error] ' + e.message);
        } else {
            throw e;
        }
    }
}

let loadExchange = async function(id) {
    if (ccxt.exchanges.indexOf(id) > -1) {
        let exchange = new(ccxt)[id]();
        await loadMarkets(exchange);
        exchanges[id] = exchange;
    }
}

let loadExchanges = async function(ids) {
        ids.forEach((id) => { loadExchange(id); });
    }
    //loadExchanges(exchangeList);


async function init() {
    exchangeIds.forEach((id) => {
        let ccxtExchange = new ccxt[id]();
        let exchange = {};
        exchange.id = ccxtExchange.id;
        exchange.name = ccxtExchange.name;
        //exchange.version = ccxtExchange.version;
        exchange.countries = ccxtExchange.countries;
        exchange.logo = ccxtExchange.urls.logo;
        exchange.www = ccxtExchange.urls.www;
        //exchange.api = ccxtExchange.urls.api;
        //exchange.doc = ccxtExchange.urls.doc;
        ccxtExchange.loadMarkets();
        exchange.markets = ccxtExchange.markets;
        exchanges[id] = exchange;
    });
}
//initExchange('bittrex');






let exchange = new ccxt.binance({
    apiKey: '4FlEDtxDl35gdEiobnfZ72vJeZteE4Bb7JdvqzjIjHq',
    secret: 'D4DXM8DZdHuAq9YptUsb42aWT1XBnGlIJgLi8a7tzFH',
})


try {
    exchange.loadMarkets();
    log(exchange.name.green, 'loaded', exchange.symbols.length.toString().bright.green, 'symbols and', exchange.currencies.length.toString().bright.cyan, 'currencies');
} catch (e) {
    log.bright.red(exchange.id, '[Error] ' + e.message);
}
*/

/*
await exchange.loadMarkets()
console.log(exchange.symbols)

let symbol = exchange.symbols[0]
console.log(symbol)

let ticker = await exchange.fetchTicker(symbol)
console.log(ticker)

let orderbook = await exchange.fetchOrderBook(symbol)
console.log(orderbook)

let balance = await exchange.fetchBalance()
console.log(balance)
*/