"use strict";

const ccxt = require('ccxt')
    //const ccxt = require('./ccxt')
const log = require('ololog').configure({ locate: false })
require('ansicolor').nice;


process.on('uncaughtException', e => {
    log.bright.red.error(e);
    process.exit(1);
});
process.on('unhandledRejection', e => {
    log.bright.red.error(e);
    process.exit(1);
});



let bittrex = ccxt.bittrex({
    'verbose': true,
    'userAgent': 'Mozilla/5.0 (Windows NT 6.1)',
    'apiKey': '60f38a5818934fc08308778f94d3d8c4',
    'secret': '9d294ddb5b944403b58e5298653720c1',
    //'proxy': 'http://www-proxy.iaea.org:3128'
    //'proxy': 'https://cors-anywhere.herokuapp.com/' // Ref: https://github.com/Rob--W/cors-anywhere/
})

async function test() {
    // as stated in the manual, the next line of code is mandatory
    // load your products prior to all other calls, don't forget it
    //await bittrex.loadMarkets()
    //bittrex.enableRateLimit = false
    //console.log(await bittrex.loadMarkets())
    var exchangeNames = []
        /*
        for (let id of ccxt.exchanges) {
            exchangeNames.push(new ccxt[id]().name)
            log.yellow(new ccxt[id]().name)
        }
        */
    var exchangeNames = Array.from(ccxt.exchanges, (id) => new ccxt[id]().name)
    console.log(exchangeNames)
}
test()

const http = require('http')
async function test1() {
    const url = 'http://bittrex.com/api/v1.1/public/getmarkets';
    http.get(url, function(res) {
        let body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            let resp = JSON.parse(body);
            console.log("Got a response: ", resp);
        });
    }).on('error', function(e) {
        console.log("Got an error: ", e);
    });
}
//test1() // ETIMEDOUT

const https = require('https')
async function test2() {
    const url = 'https://bittrex.com/api/v1.1/public/getmarkets';
    https.get(url, function(res) {
        let body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            let resp = JSON.parse(body);
            console.log("Got a response: ", resp);
        });
    }).on('error', function(e) {
        console.log("Got an error: ", e);
    });
}
//test2() // ETIMEDOUT

const request = require('request');
async function test3() {
    const url = 'https://bittrex.com/api/v1.1/public/getmarkets';
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            // data is already parsed as JSON:
            console.log(data);
        }
    });
}
//test3()

/*
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



/*
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