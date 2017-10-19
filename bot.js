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
const ccxt = require('ccxt');
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
        interval: 1000, // Optional. How often check updates (in ms).
        timeout: 0, // Optional. Update polling timeout (0 - short polling).
        limit: 100, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
        proxy: process.env.HTTP_PROXY // Optional. An HTTP proxy to be used.
    },
    allowedUpdates: [], // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates.
    usePlugins: ['askUser', 'commandButton'] // Optional. List of built-in plugins.
});

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
            bot.inlineButton('⚒ Settings', { callback: '/settings' }), bot.inlineButton('❗️ Help', { callback: '/help' }), bot.inlineButton('❓ About', { callback: '/about' })
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

bot.on(['/settings'], (msg) => {
    return bot.sendMessage(msg.from.id, '<b>Settings</b> not implemented yet', { parseMode: 'HTML' });
});


bot.on(['/alarm'], (msg) => {
    return bot.sendMessage(msg.from.id, '<b>Alarm</b> not implemented yet', { parseMode: 'HTML' });
});

bot.on(['/signal'], (msg) => {
    return bot.sendMessage(msg.from.id, '<b>Signal</b> not implemented yet', { parseMode: 'HTML' });
});

bot.on(['/exchanges', '/e'], (msg) => {
    let buttons = [];
    const exchanges = ccxt.exchanges;
    const exchangeNames = Array.from(ccxt.exchanges, (id) => new ccxt[id]().name);
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
    return bot.sendMessage(msg.from.id, `<b>Exchanges:</b>\n${exchangesList}`, { parseMode: 'HTML', replyMarkup });
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

bot.on(/^\/exchange (.+)$/, (msg, param) => {
    let id = param.match[1];
    /*
    var exchange = id;
    let markets = ccxt.getExchange(id).getMarkets();
    */
    let exchange = ccxt[id]();
    exchange.loadMarkets();
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


bot.on([/^\/symbols (.+)$/, /^\/s (.+)$/], async(msg, param) => {
    let exchangeId = param.match[1].toLowerCase();
    const exchange = ccxt[exchangeId](); // @TODO: add error handling!
    await exchange.loadMarkets();
    const symbols = Array.from(exchange.symbols, (name) => `<code>${name}</code>`).join(', ');
    return bot.sendMessage(msg.from.id, `<b>Symbols:</b>\n${ symbols }`, { parseMode: 'HTML' });
});

bot.on([/^\/markets (.+)$/, /^\/m (.+)$/], async(msg, param) => {
    let exchangeId = param.match[1].toLowerCase();
    const exchange = ccxt[exchangeId](); // @TODO: add error handling!
    await exchange.loadMarkets();
    const markets = Array.from(Object.keys(exchange.markets), (name) => `<code>${name}</code>`).join(', ');
    return bot.sendMessage(msg.from.id, `<b>Markets:</b>\n${ markets }`, { parseMode: 'HTML' });
});

bot.on([/^\/currencies (.+)$/, /^\/coins (.+)$/], async(msg, param) => {
    let exchangeId = param.match[1].toLowerCase();
    const exchange = ccxt[exchangeId](); // @TODO: add error handling!
    await exchange.loadMarkets();
    const currencies = Array.from(exchange.currencies, (name) => `<code>${name}</code>`).join(', ');
    return bot.sendMessage(msg.from.id, `<b>Currencies:</b>\n${ currencies }`, { parseMode: 'HTML' });
});

bot.on([/^\/price (.+)$/, /^\/p (.+)$/], async(msg, param) => {
    let symbol = param.match[1].toUpperCase();
    if (!symbol.includes('/')) { // Default to BTC if currency was provided instead of pair symbol
        symbol = symbol.concat('/BTC');
    }
    const [fromCurrency, toCurrency] = symbol.split('/');
    const exchangeId = 'bittrex';
    //let exchangeId = param.match[1].toLowerCase();
    const exchange = ccxt[exchangeId](); // @TODO: add error handling!
    await exchange.loadMarkets();
    let ticker = await exchange.fetchTicker(symbol);
    //const currencies = Array.from(exchange.currencies, (name) => `<code>${name}</code>`).join(', ');
    console.log(ticker);
    let info = `<b>Symbol:</b> <code>${ticker.symbol}</code>\n<b>Price:</b> ${ticker.last}\n<b>High:</b> ${ticker.high} | <b>Low:</b> ${ticker.low}\n<b>Bid:</b> ${ticker.bid} | <b>Ask:</b> ${ticker.ask}\n<b>Volume:</b> ${ticker.quoteVolume} ${toCurrency}`;
    return bot.sendMessage(msg.from.id, `${ info }`, { parseMode: 'HTML' });
});


// Button callback
bot.on('callbackQuery', (msg) => {
    log.cyan('[BOT]', 'callbackQuery data:', msg.data);
    bot.answerCallbackQuery(msg.id);
});

//bot.on('text', (msg) => msg.reply.text(`📣 ${ msg.text }`));
bot.on('text', (msg) => { db.users.put(msg.from.id, { first_name: msg.from.first_name, last_name: msg.from.last_name }); });

bot.start();

log.green('Bot server started');


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