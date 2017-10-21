'use strict';
// Resources:
//    https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016

const packageInfo = require('./package.json');
const express = require('express');
const ccxt = require('./ccxt');
const log = require('ololog').configure({ locate: false });
require('ansicolor').nice;

const app = express();


process.on('uncaughtException', e => {
    log.bright.red.error(e);
    //process.exit(1);
});
process.on('unhandledRejection', e => {
    log.bright.red.error(e);
    //process.exit(1);
});

let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))


app.get('/', function(req, res) {
    res.json({ version: packageInfo.version });
});

app.get('/exchanges', function(req, res) {
    let exchanges = ccxt.exchanges;
    res.json(exchanges);
});

app.get('/exchanges/:exchangeId', function(req, res) {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    res.json(exchange);
});

app.get('/exchanges/:exchangeId/markets', async(req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    await exchange.loadMarkets();
    //log.blue(await exchange.fetchTicker('BTC/USD'));
    //log.green(exchange.markets);
    res.json(exchange.markets);
});

app.get('/exchanges/:exchangeId/markets/:marketId', async(req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    let marketId = req.params.marketId;
    await exchange.loadMarkets();
    let markets = await exchange.marketsById;
    let market = markets[marketId];
    res.json(market);
});

app.get('/exchanges/:exchangeId/symbols', async(req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    await exchange.loadMarkets();
    res.json(exchange.symbols);
});

app.get('/exchanges/:exchangeId/currencies', async(req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    await exchange.loadMarkets();
    res.json(exchange.currencies);
});

app.get('/exchanges/:exchangeId/ids', async(req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    await exchange.loadMarkets();
    res.json(exchange.ids);
});

app.get('/exchanges/:exchangeId/tickers', async(req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    await exchange.loadMarkets();
    //let tickers = exchange.fetchTickers(); // Not implemented yet!
    let tickers = [];
    for (let symbol of exchange.symbols) {
        sleep(exchange.rateLimit);
        tickers.push(await exchange.fetchTicker(symbol));
    }
    res.json(tickers);
});

app.get('/exchanges/:exchangeId/tickers/:symbolId', async(req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    let symbolId = req.params.symbolId;
    await exchange.loadMarkets();
    let ticker = await exchange.fetchTicker(symbolId);
    res.json(ticker);
});


app.use(function(err, req, res, next) {
    log.bright.red.error(err);
    res.status(500).send();
});


const PORT = process.env.PORT || 8080;
const KEEPALIVE_FREQ = (process.env.KEEPALIVE_FREQ || 15 * 60); // every 15 minutes

const server = app.listen(PORT, function() {
    //const host = process.env.HOST || 'cryptomon-bot.herokuapp.com'; //server.address().address;
    //const port = server.address().port;
    //const url = `http://${host}:${port}`;
    const url = `http://cryptomon-bot.herokuapp.com`;
    log.green('Web server started at', url.bright);

    // Keepalive hack
    const http = require('http');
    setInterval(function() {
        http.get(url);
        log.darkGray('[PING]', 'Keepalive request for', url.bright);
    }, KEEPALIVE_FREQ * 1000);
    log.yellow('Setting app keepalive frequency every', KEEPALIVE_FREQ.bright, 'minutes');
});