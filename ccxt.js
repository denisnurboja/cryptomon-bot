"use strict";

const ccxt = require('ccxt');
const table = require('as-table');

//console.log(ccxt.exchanges) // print all available exchanges
let formatPrice = function(price) {
    return typeof price == 'undefined' ? 'N/A' : price;
};

/*
async function init() {
    let exchanges = [];
    // instantiate all exchanges
    await Promise.all(ccxt.exchanges.map(async id => { exchanges.push(new(ccxt)[id]()); }))
}
init();
*/

module.exports = {
    exchangeList: ['bittrex', 'bitfinex', 'binance', 'gdax'],
    exchanges: {},

    getAllExchanges: function() {
        //return ccxt.exchanges;
        /*
        let exchanges = []
        // instantiate all exchanges
        await Promise.all(ccxt.exchanges.map(async id => {
            let exchange = new(ccxt)[id]()
            exchanges.push(exchange)
            await test(exchange, symbol)
        }));
        */
        return ccxt.exchanges;
    },
    getExchange: function(id) {
        if (ccxt.exchanges.indexOf(id) > -1) {
            let exchange = new(ccxt)[id]();
            exchange.loadMarkets();
            //await loadMarkets(exchange);
        }
        return exchange;
    },
    getExchanges: function(ids) {
        let exchanges = {};
        ids.forEach((id) => { exchanges[id] = module.exports.getExchange(id); });
        return exchanges;
    },
    getMarket: function(exchange, symbol) {
        return symbol;
    },

    init: function() {
        //module.exports.exchangeList.forEach(id => { module.exports.exchanges[id] = new(ccxt)[id](); });
        //let exchanges =
        //console.log(`Loaded ${module.exports.exchanges.keys} exchanges.`);
    }
}

//module.exports.init();
//const exchanges = ccxt.exchanges;
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