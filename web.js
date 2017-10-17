const express = require('express');
const packageInfo = require('./package.json');
const ccxt = require('ccxt');
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
    let exchange = new ccxt[exchangeId]();
    res.json(exchange);
});

app.get('/exchanges/:exchangeId/markets', function(req, res) {
    let exchangeId = req.params.exchangeId;
    let exchange = new ccxt[exchangeId]();
    exchange.loadMarkets();
    res.json(exchange.markets);
});

app.get('/exchanges/:exchangeId/markets/:marketId', function(req, res) {
    let exchangeId = req.params.exchangeId;
    let exchange = new ccxt[exchangeId]();
    let marketId = req.params.marketId;
    exchange.loadMarkets();
    let market = exchange.marketsById().find(marketId);
    res.json(market);
});

app.get('/exchanges/:exchangeId/symbols', function(req, res) {
    let exchangeId = req.params.exchangeId;
    let exchange = new ccxt[exchangeId]();
    exchange.loadMarkets();
    res.json(exchange.symbols);
});

app.get('/exchanges/:exchangeId/currencies', function(req, res) {
    let exchangeId = req.params.exchangeId;
    let exchange = new ccxt[exchangeId]();
    exchange.loadMarkets();
    res.json(exchange.currencies);
});

app.get('/exchanges/:exchangeId/ids', function(req, res) {
    let exchangeId = req.params.exchangeId;
    let exchange = new ccxt[exchangeId]();
    exchange.loadMarkets();
    res.json(exchange.ids);
});

app.get('/exchanges/:exchangeId/tickers', function(req, res) {
    let exchangeId = req.params.exchangeId;
    let exchange = new ccxt[exchangeId]();
    exchange.loadMarkets();
    let tickers = [];
    for (let symbol of exchange.symbols) {
        sleep(exchange.rateLimit);
        tickers.push(exchange.fetchTicker(symbol));
    }
    res.json(tickers);
});

app.get('/exchanges/:exchangeId/tickers/:symbolId', function(req, res) {
    let exchangeId = req.params.exchangeId;
    let exchange = new ccxt[exchangeId]();
    let symbolId = req.params.symbolId;
    exchange.loadMarkets();
    let ticker = exchange.fetchTicker(symbolId);
    res.json(ticker);
});


app.use(function(err, req, res, next) {
    log.bright.red.error(err);
    res.status(500).send();
});

const server = app.listen(process.env.PORT || 8080, function() {
    const host = server.address().address;
    const port = server.address().port;
    //console.log('Web server started at http://%s:%s', host, port);
    log.green('Web server started at http://', host, ':', port);
});