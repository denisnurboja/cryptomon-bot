'use strict';
// Resources:
//    https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016

const packageInfo = require('./package.json');
const express = require('express');
const ccxt = require('./ccxt');
const log = require('ololog').configure({ locate: false });
require('ansicolor').nice;
const request = require('request');

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


app.get('/', function (req, res) {
    res.json({ version: packageInfo.version });
});

app.get('/exchanges', function (req, res) {
    let exchanges = ccxt.exchanges;
    res.json(exchanges);
});

app.get('/exchanges/:exchangeId', function (req, res) {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    res.json(exchange);
});

app.get('/exchanges/:exchangeId/markets', async (req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    await exchange.loadMarkets();
    //log.blue(await exchange.fetchTicker('BTC/USD'));
    //log.green(exchange.markets);
    res.json(exchange.markets);
});

app.get('/exchanges/:exchangeId/markets/:marketId', async (req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    let marketId = req.params.marketId;
    await exchange.loadMarkets();
    let markets = await exchange.marketsById;
    let market = markets[marketId];
    res.json(market);
});

app.get('/exchanges/:exchangeId/symbols', async (req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    await exchange.loadMarkets();
    res.json(exchange.symbols);
});

app.get('/exchanges/:exchangeId/currencies', async (req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    await exchange.loadMarkets();
    res.json(exchange.currencies);
});

app.get('/exchanges/:exchangeId/ids', async (req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    await exchange.loadMarkets();
    res.json(exchange.ids);
});

app.get('/exchanges/:exchangeId/tickers', async (req, res, next) => {
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

app.get('/exchanges/:exchangeId/ohlcv/:symbol', async (req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    let symbol = req.params.symbol.toUpperCase();
    await exchange.loadMarkets();
    let ohlcv = await exchange.fetchOHLCV(symbol, '15m');
    res.json(ohlcv);
});

app.get('/chart/:exchangeId/:symbol', async (req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    //let symbol = req.params.symbol.toUpperCase();
    let symbol = ccxt.getSymbol(req.params.symbol.toUpperCase());
    let period = req.query.period || '15m';
    await exchange.loadMarkets();
    let ohlcv = await exchange.fetchOHLCV(symbol, period);
    // Split the data set into ohlc and volume
    let ohlc = ohlcv.map((item) => item.slice(0,5));
    let volume = ohlcv.map((item) => [item[0], item[5]]);
    /*
    let ohlc = [];
    let volume = [];
    let i = 0;
    for (i; i < ohlcv.length; i += 1) {
        ohlc.push([
            ohlcv[i][0], // the date
            ohlcv[i][1], // open
            ohlcv[i][2], // high
            ohlcv[i][3], // low
            ohlcv[i][4] // close
        ]);
        volume.push([
            ohlcv[i][0], // the date
            ohlcv[i][5] // the volume
        ]);
    }
    */
    // Generate the chart
    let chartOptions = {
        plotOptions: {
            candlestick: {
                color: 'red',
                upColor: 'green'
            }
        },
        credits: {
            enabled: false
        },
        rangeSelector: {
            //selected: 1
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        navigator: {
            enabled: false
        },        
        legend: {
            enabled: false
        },
        title: {
            text: symbol
        },
        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '70%',
            lineWidth: 1,
            resize: {
                enabled: false
            }
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '70%',
            height: '30%',
            offset: 0,
            lineWidth: 1
        }],
        series: [{
            type: 'candlestick',
            id: 'price',
            name: symbol,
            data: ohlc
        }, {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1
        }]
    };

    let serverOptions = {
        async: false,
        asyncRendering: false,
        noDownload: true,
        constr: 'StockChart',
        infile: chartOptions,
        scale: false,
        styledMode: true,
        type: "image/png",
        width: 1000,
        resources: {
            css: ".highcharts-background { fill: #f0f0f0; stroke: #333; stroke-width: 3px}; "
        }
    };
    res.setHeader('Content-Type', 'image/png');
    request.post({ url: 'http://export.highcharts.com/', json: serverOptions }).pipe(res);//, function (error, response, body) {
        //request.get('http://export.highcharts.com/' + body).pipe(res);
    //});
});


app.get('/exchanges/:exchangeId/tickers/:symbolId', async (req, res, next) => {
    let exchangeId = req.params.exchangeId;
    let exchange = ccxt.exchanges[exchangeId]();
    let symbolId = req.params.symbolId;
    await exchange.loadMarkets();
    let ticker = await exchange.fetchTicker(symbolId);
    res.json(ticker);
});


app.use(function (err, req, res, next) {
    log.bright.red.error(err);
    res.status(500).send();
});


const PORT = process.env.PORT || 8080;
const KEEPALIVE_FREQ = process.env.KEEPALIVE_FREQ || 900; // every 15 minutes

const server = app.listen(PORT, function () {
    //const host = process.env.HOST || 'cryptomon-bot.herokuapp.com'; //server.address().address;
    //const port = server.address().port;
    //const url = `http://${host}:${port}`;
    const url = `http://cryptomon-bot.herokuapp.com`;
    log.green('Web server started at', url.bright);

    // Keepalive hack
    const http = require('http');
    setInterval(function () {
        http.get(url);
        log.darkGray('[PING]', 'Keepalive request for', url.bright);
    }, KEEPALIVE_FREQ * 1000);
    log.yellow('Setting app keepalive frequency every', KEEPALIVE_FREQ.bright, 'seconds');
});