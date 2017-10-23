'use strict';
// Resources:
//    https://github.com/botgram/botgram
//    https://tutorials.botsfloor.com/creating-a-bot-using-the-telegram-bot-api-5d3caed3266d
//    https://blog.srnd.org/intro-to-node-js-making-a-telegram-bot-964b8cfe1129?gi=3b717c902aa9
//    http://mvalipour.github.io/node.js/2015/11/10/build-telegram-bot-nodejs-heroku
//    http://qpbp.name/tutorials/2016/07/13/deploying-telegram-bot-to-heroku.html
//    https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
//    http://www.unicode.org/emoji/charts/full-emoji-list.html
//    https://www.npmjs.com/package/tgfancy

const TeleBot = require('telebot');
const ccxt = require('./ccxt');
const log = require('ololog').configure({ locate: false });
require('ansicolor').nice;
const db = require('./db');


process.on('uncaughtException', e => {
    log.bright.red.error(e);
});
process.on('unhandledRejection', e => {
    log.bright.red.error(e);
});


const bot = new TeleBot({
    token: process.env.TELEGRAM_TOKEN,
    polling: {
        interval: 5000, // Optional. How often check updates (in ms).
        timeout: 0, // Optional. Update polling timeout (0 - short polling).
        limit: 100, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
        proxy: process.env.HTTP_PROXY // Optional. An HTTP proxy to be used.
    },
    //    allowedUpdates: [], // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates.
    //    usePlugins: ['askUser', 'commandButton'], // Optional. List of built-in plugins.
    logging: false
});


// General events
bot.on(['/start'], (msg) => {
    /*  
        // Command keyboard
        const replyMarkup = bot.keyboard([
            // ['/alarm', '/monitor', '/help']
            [bot.button('/settings', 'Settings'), bot.button('/help', 'Help'), bot.button('/about', 'About')]
        ], { resize: true, once: false });
    */
    const replyMarkup = bot.inlineKeyboard([
        [
            //bot.inlineButton('💱 Exchanges', { callback: '/exchanges' }), bot.inlineButton('💲 Coins', { callback: '/coins' }),
            //bot.inlineButton('⏰ Alarm', { callback: '/alarm' }), bot.inlineButton('📢 Signal', { callback: '/signal' }),
            bot.inlineButton('⚒ Settings', { callback: '/set' }), bot.inlineButton('❗️ Help', { callback: '/help' }), bot.inlineButton('❓ About', { callback: '/about' })
        ]
    ]);
    return bot.sendMessage(msg.from.id, `Hi, <b>${ msg.from.first_name }</b>!`, { parseMode: 'HTML', replyMarkup }).then(function() {
        //bot.sendMessage(msg.from.id, '<b>Available commands:</b>', { parseMode: 'HTML', replyMarkup });
    });
    // return bot.sendMessage(msg.from.id, '😺 Use commands: /alarm, /monitor, /about and /help', { parseMode: 'HTML', replyMarkup });
});

bot.on('/about', (msg) => {
    return bot.sendMessage(msg.from.id, '<b>About</b> not implemented yet', { parseMode: 'HTML' });
});

bot.on(['/help', '/h'], (msg) => {
    return bot.sendMessage(msg.from.id, '<b>Help</b> not implemented yet', { parseMode: 'HTML' });
});


// Settings events
bot.on([/^\/set$/i, /^\/set (.*)$/i], (msg, param) => {
    let settings = db.settings.get(msg.from.id);
    if(settings==undefined) {
        settings = {};
        db.settings.put(msg.from.id, settings);
    }
    let p = param.match[1];
    let key = '';
    let value = '';
    if(p==undefined) {    // show all settings
        if(Object.keys(settings).length==0) {
            return bot.sendMessage(msg.from.id, `<b>Settings:</b>\nNo settings exist yet`, { parseMode: 'HTML' });        
        } else {
            let strSettings = '';
            Object.keys(settings).forEach((key) => {strSettings+=`${key} = ${settings[key]}\n`;});
            return bot.sendMessage(msg.from.id, `<b>Settings:</b>\n${strSettings}`, { parseMode: 'HTML' });
        }
    } else if(p.includes('=')) {   // set a value
        [key, value] = p.split('=');
        settings[key] = value;
        db.settings.update(msg.from.id, settings);
        return bot.sendMessage(msg.from.id, `<b>Settings:</b>\n✅${key} set to ${value}`, { parseMode: 'HTML' });
    } else { // show setting value
        key = p;
        return bot.sendMessage(msg.from.id, `<b>Settings:</b>\n${key} = ${settings[key]}`, { parseMode: 'HTML' });
    }
});

bot.on([/^\/unset$/i, /^\/unset (.*)$/i], (msg, param) => {
    let settings = db.settings.get(msg.from.id);
    let p = param.match[1];
    let key = '';
    let value = '';
    if(p==undefined) {    // remove all settings
        if(Object.keys(settings).length==0) {
            return bot.sendMessage(msg.from.id, `<b>Settings:</b>\nNo settings exist yet`, { parseMode: 'HTML' });        
        } else {
            let strSettings = '';
            Object.keys(settings).forEach((key) => {strSettings+=`❎${key} removed\n`;});
            db.settings.update(msg.from.id, {});
            return bot.sendMessage(msg.from.id, `<b>Settings:</b>\n${strSettings}`, { parseMode: 'HTML' });
        }
    } else { // remove setting value
        key = p;
        delete settings[key];
        db.settings.update(msg.from.id, settings);
        return bot.sendMessage(msg.from.id, `<b>Settings:</b>\n❎${key} removed`, { parseMode: 'HTML' });
    }
});



// Information events
bot.on(['/exchanges', '/e'], (msg) => {
    let buttons = [];
    const exchanges = ccxt.exchanges;
    const exchangeNames = Array.from(ccxt.exchanges, (id) => ccxt.exchanges[id]().name);
    const replyMarkup = bot.inlineKeyboard([
        [bot.inlineButton('Bittrex', { callback: '/exchange bittrex' }), bot.inlineButton('Bitfinex', { callback: '/exchange bitfinex' })],
        [bot.inlineButton('Binance', { callback: '/exchange binance' }), bot.inlineButton('GDAX', { callback: '/exchange gdax' })]
    ]);
    //exchangeNames.forEach((name) => { buttons.push(bot.inlineButton(name, { callback: '/exchange ' + name.toLowerCase() })); });
    //const replyMarkup = bot.inlineKeyboard([buttons]);
    //var exc = ccxt.exchanges.join(', ');
    //var exc = ccxt.getExchanges(['b']);
    //console.log(exc);
    let exchangesList = Array.from(exchangeNames, (name) => `<code>${name}</code>`).join(', ');
    return bot.sendMessage(msg.from.id, `<b>Exchanges:</b>\n${exchangesList}`, { parseMode: 'HTML' });
});

/*
bot.on(['/coins', '/c'], (msg) => {
    const replyMarkup = bot.inlineKeyboard([
        [bot.inlineButton('Bitcoin', { callback: '/coin BTC' }), bot.inlineButton('Ethereum', { callback: '/coin ETH' })],
        [bot.inlineButton('Dash', { callback: '/coin DASH' }), bot.inlineButton('NEO', { callback: '/coin NEO' })]
    ]);
    //var exc = ccxt.exchanges.join(', ');
    //console.log(exc);
    coins = '';
    return bot.sendMessage(msg.from.id, `<b>Coins:</b> ${ coins }`, { parseMode: 'HTML', replyMarkup });
});
*/

/*
bot.on(/^\/exchange (.+)$/, (msg, param) => {
    let id = param.match[1];
    let exchange = ccxt.exchanges[id]();
    //exchange.loadMarkets();
    let markets = exchange.markets;
    let marketList = Object.keys(markets);
    //console.log(marketList);
    bot.sendMessage(msg.from.id, `<b>Exchange:</b> ${ exchange.name }`, { parseMode: 'HTML' });
    bot.sendMessage(msg.from.id, `<b>Markets:</b> ${ marketList.join(', ') }`, { parseMode: 'HTML' });
    // bot.sendMessage(msg.from.id, `<b>Symbols:</b> ${ exchange.symbols.join(', ') }`, { parseMode: 'HTML' });
    bot.sendMessage(msg.from.id, `<b>Currencies:</b> ${ exchange.currencies.join(', ') }`, { parseMode: 'HTML' });
    return;
});

bot.on(/^\/coin (.+)$/, (msg, param) => {
    const coin = param.match[1];
    return bot.sendMessage(msg.from.id, `<b>Coin:</b>\n ${ coin }`, { parseMode: 'HTML' });
});
*/

bot.on([/^\/symbols (.+)$/i, /^\/s (.+)$/i], async(msg, param) => {
    let exchangeId = param.match[1].toLowerCase();
    const exchange = ccxt.exchanges[exchangeId](); // @TODO: add error handling!
    await exchange.loadMarkets();
    const symbols = Array.from(exchange.symbols, (name) => `<code>${name}</code>`).join(', ');
    return bot.sendMessage(msg.from.id, `<b>Symbols:</b>\n${ symbols }`, { parseMode: 'HTML' });
});

bot.on([/^\/markets (.+)$/i, /^\/m (.+)$/i], async(msg, param) => {
    let exchangeId = param.match[1].toLowerCase();
    const exchange = ccxt.exchanges[exchangeId](); // @TODO: add error handling!
    await exchange.loadMarkets();
    const markets = Array.from(Object.keys(exchange.markets), (name) => `<code>${name}</code>`).join(', ');
    return bot.sendMessage(msg.from.id, `<b>Markets:</b>\n${ markets }`, { parseMode: 'HTML' });
});

bot.on([/^\/currencies (.+)$/i, /^\/c (.+)$/i], async(msg, param) => {
    let exchangeId = param.match[1].toLowerCase();
    const exchange = ccxt.exchanges[exchangeId](); // @TODO: add error handling!
    await exchange.loadMarkets();
    const currencies = Array.from(exchange.currencies, (name) => `<code>${name}</code>`).join(', ');
    return bot.sendMessage(msg.from.id, `<b>Currencies:</b>\n${ currencies }`, { parseMode: 'HTML' });
});

bot.on([/^\/ticker (.+)$/i, /^\/t (.+)$/i], async(msg, param) => {
    let symbol = ccxt.getSymbol(param.match[1].toUpperCase());
    const [fromCurrency, toCurrency] = symbol.split('/');
    let settings = db.settings.get(msg.from.id);
    let exchanges = (settings.exchanges==undefined ? ccxt.symbols[symbol] : settings.exchanges.split(','));
    for(let exchangeId of exchanges) {
        const exchange = ccxt.exchanges[exchangeId](); // @TODO: add error handling!
        //await exchange.loadMarkets();
        let ticker = await exchange.fetchTicker(symbol);
        let change = ticker.info.priceChangePercent + '%'; //float(ticker.change * 100).toString() + '%';
        let info = `<code>${ticker.symbol}</code>@<b>${exchange.name}</b>\n<b>Price:</b> ${ticker.last} | <b>Change:</b> ${change}\n<b>High:</b> ${ticker.high} | <b>Low:</b> ${ticker.low}\n<b>Bid:</b> ${ticker.bid} | <b>Ask:</b> ${ticker.ask}\n<b>Volume:</b> ${ticker.quoteVolume} ${toCurrency}`;
        bot.sendMessage(msg.from.id, `${ info }`, { parseMode: 'HTML' });
    }
    return;
});

bot.on([/^\/price (.+)$/i, /^\/p (.+)$/i], async(msg, param) => {
    let symbol = ccxt.getSymbol(param.match[1].toUpperCase());
    const [fromCurrency, toCurrency] = symbol.split('/');
    let settings = db.settings.get(msg.from.id);
    //let exchanges = (settings.exchanges==undefined ? ccxt.symbols[symbol] : settings.exchanges.split(','));
    let exchanges = ccxt.symbols[symbol];
    for(let exchangeId of exchanges) {
        const exchange = ccxt.exchanges[exchangeId]();
        //await exchange.loadMarkets();
        let ticker = await exchange.fetchTicker(symbol);
        //let change = ticker.info.priceChangePercent + '%'; //float(ticker.change * 100).toString() + '%';
        bot.sendMessage(msg.from.id, `<code>${ticker.symbol}</code>@<b>${exchange.name}</b>: ${ticker.last}`, { parseMode: 'HTML' });
    }
    return;
});


// Button callback
bot.on('callbackQuery', (msg) => {
    log.cyan('[BOT]', 'callbackQuery data:', msg.data);
    bot.answerCallbackQuery(msg.id);
});

//bot.on('text', (msg) => msg.reply.text(`📣 ${ msg.text }`));
/*
bot.on(['/userinfo', '/u'], (msg) => {
    db.users.update(msg.from.id, { first_name: msg.from.first_name, last_name: msg.from.last_name, last_visit: msg.date });
    let txt = db.users.get(msg.from.id);
    msg.reply.text(JSON.stringify(txt));
});
*/

//bot.on('tick', async() => { });

/*
function setInterval(func, ms) {
    return new Promise(resolve => setInterval(resolve, ms));
}
*/

const POLLING_FREQ = (process.env.POLLING_FREQ || 15); // every 15 seconds
/*
let alerts = new Array();
alerts.toString = function() {
    let str = '';
    alerts.forEach((alert) => str+=`${alert.symbol} @ ${alert.threshold}%\n`);
    return str;
}
alerts.add = function(alert) {
    alerts.push(alelrt);
}
alerts.add({symbol:'STRAT/BTC', threshold: 5});
alerts.add({symbol:'STRAT/BTC', threshold: -10});
alerts.add({symbol:'NEO/BTC', threshold: 5});
alerts.add({symbol:'NEO/BTC', threshold: -10});
console.log(alerts);
*/


// Watch events
bot.on([/^\/watch$/i, /^\/w$/i, /^\/watch (.*)$/i, /^\/w (.*)$/i], (msg, param) => {
    let watches = db.watches.get(msg.from.id);
    if(watches==undefined) {
        watches = {};
        db.watches.put(msg.from.id, watches);
    }
    let w = param.match[1];
    let key = '';
    let value = '';
    if(w==undefined) {    // show all watches
        if(watches==undefined || Object.keys(watches).length==0) {
            return bot.sendMessage(msg.from.id, `<b>Watches:</b>\nNo watches exist yet`, { parseMode: 'HTML' });        
        } else {
            let strWatches = '';
            Object.keys(watches).forEach((key) => {strWatches+=`${key} = ${watches[key]}\n`;});
            return bot.sendMessage(msg.from.id, `<b>Watches:</b>\n${strWatches}`, { parseMode: 'HTML' });
        }
    } else if(w.includes('=')) {   // set a value
        [key, value] = w.split('=');
        key = key.toUpperCase();
        if (!key.includes('/')) { // Default to BTC if currency was provided instead of pair symbol
            key = key.concat('/BTC');
        }
        watches[key] = value;
        db.watches.update(msg.from.id, watches);
        return bot.sendMessage(msg.from.id, `<b>Watches:</b>\n${key} set to ${value}`, { parseMode: 'HTML' });
    } else { // show setting value
        key = w.toUpperCase();
        return bot.sendMessage(msg.from.id, `<b>Watches:</b>\n${key} = ${watches[key]}`, { parseMode: 'HTML' });
    }
});

bot.on([/^\/unwatch$/i, /^\/unwatch (.*)$/i], (msg, param) => {
    let watches = db.watches.get(msg.from.id);
    let w = param.match[1];
    let key = '';
    let value = '';
    if(w==undefined) {    // remove all watches
        if(Object.keys(settings).length==0) {
            return bot.sendMessage(msg.from.id, `<b>Watches:</b>\nNo watches defined yet`, { parseMode: 'HTML' });        
        } else {
            let strWatches = '';
            Object.keys(watches).forEach((key) => {strWatches+=`${key} removed\n`;});
            db.watches.update(msg.from.id, {});
            return bot.sendMessage(msg.from.id, `<b>Watches:</b>\n${strWatches}`, { parseMode: 'HTML' });
        }
    } else { // remove setting value
        key = w.toUpperCase();
        delete watches[key];
        db.watches.update(msg.from.id, watches);
        return bot.sendMessage(msg.from.id, `<b>Watches:</b>\n${key} removed`, { parseMode: 'HTML' });
    }
});

/*
bot.on([/^\/watch (.+) (.+)$/, /^\/w (.+) (.+)$/], async(msg, param) => {
    let symbol = param.match[1].toUpperCase();
    if (!symbol.includes('/')) { // Default to BTC if currency was provided instead of pair symbol
        symbol = symbol.concat('/BTC');
    }
    const [fromCurrency, toCurrency] = symbol.split('/');    
    let threshold = parseFloat(param.match[2]);
    const exchangeId = 'binance';
    const exchange = ccxt[exchangeId](); 
    //await exchange.loadMarkets();

    //var promise = Promise.resolve(true);    
    setInterval(function () {
         //promise = promise.then(function () {
         //    return new Promise(function (resolve) {
                 checkChange();
         //    });
         //});
     }, POLLING_FREQ * 1000);
     let checkChange = async() => {
        let ticker = await exchange.fetchTicker(symbol);
        let change = parseFloat(ticker.change);
        //log.blue('[TICK]', change, threshold);
        if(threshold<0 && change<=threshold) {
            bot.sendMessage(msg.from.id, `<code>${symbol}</code> change (${change}%) is below threshold ${threshold}%`, { parseMode: 'HTML' });
        } else if(threshold>0 && change>=threshold) {
            bot.sendMessage(msg.from.id, `<code>${symbol}</code> change (${change}%) is above threshold ${threshold}%`, { parseMode: 'HTML' });
        }
     }
 });
 */


// Init
bot.start();
log.green.bright('Bot server started');


// Watches periodic checker
async function setWatchTimer() {
    setInterval(function () { checkChanges(); }, POLLING_FREQ * 1000);
}

async function checkChanges() {
    let watches = db.watches.get();
    Object.keys(watches).forEach((userId) => {
        Object.keys(watches[userId]).forEach((symbol) => {
            let val = watches[userId][symbol];
            let lowVal = 0.0;
            let highVal = 0.0;
            [lowVal, highVal] = val.split(':');
            let exchangeId = ccxt.symbols[symbol][0];
            let exchange = ccxt.exchanges[exchangeId]();
            //exchange.loadMarkets();
            let ticker;
            exchange.fetchTicker(symbol).then(ticker => {
                if(ticker.last < lowVal) {
                    bot.sendMessage(userId, `⚠<code>${symbol}</code> price ${ticker.last} is below watch level ${lowVal}📉`, { parseMode: 'HTML' });
                }
                if(ticker.last > highVal) {
                    bot.sendMessage(userId, `⚠<code>${symbol}</code> price ${ticker.last} is above watch level ${highVal}📈`, { parseMode: 'HTML' });
                }
            });
        });
    });
}
setWatchTimer();


/*
Description:
/setdescription @CryptoMon_Bot
@CryptoMon_Bot helps with the tracking of your cryptocurrency investments and making informed buy/sell decisions.


About:
/setabouttext @CryptoMon_Bot
@CryptoMon_Bot helps tracking of your cryptocurrency investments and making smart, informed buy/sell decisions.
Follow the price movements and trends using signals, and get informed about key changes by setting alarms.
Soon the bot will also be able to trade on your behalf so you won't miss on any golden opportunities.


Commands:
/setcommands @CryptoMon_Bot
exchanges - Exchanges control
markets - Markets control
symbols - Symbols control
coins - Cryptocurrencies control
alarm - Alarm control
signal - Signal control


TODO:
(see @MewnBot)
/p <coin>
Bittrex: SNRG 
0.00022314  -1.08% ▼ 
High|Low: 0.00024062 0.0002156 
Volume: 5.27 BTC

Yobit: SNRG 
0.0002528 
High|Low: 0.0002528 0.00021782 
Volume: 0.0234919 BTC

Price: $ 5,712.19 2.12▲
High: $ 5,778.96|Low: $ 5,529.36
Volume: Ƀ 71,522.9
Volume: $ 405,935,916.7
Current Supply: Ƀ 16,622,950
Marketcap: $ 94.95 B
24h Change: $ 118.43

/c <coin>
...chart...
*/