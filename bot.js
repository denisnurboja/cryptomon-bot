// Resources:
//    https://github.com/botgram/botgram
//    https://tutorials.botsfloor.com/creating-a-bot-using-the-telegram-bot-api-5d3caed3266d
//    https://blog.srnd.org/intro-to-node-js-making-a-telegram-bot-964b8cfe1129?gi=3b717c902aa9
//    http://mvalipour.github.io/node.js/2015/11/10/build-telegram-bot-nodejs-heroku
//    http://qpbp.name/tutorials/2016/07/13/deploying-telegram-bot-to-heroku.html

const TeleBot = require('telebot');
const ccxt = require('ccxt');

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
    // Command keyboard
    //const replyMarkup = bot.keyboard([
    //    ['/alarm', '/monitor', '/help']
    //], { resize: true, once: false });
    const replyMarkup = bot.inlineKeyboard([
        [ bot.inlineButton('💱 Exchanges', {callback: '/exchanges'}) ],
        [ bot.inlineButton('⏰ Alarm', {callback: '/alarm'}) ],
        [ bot.inlineButton('📢 Signal', {callback: '/signal'}) ],
        [ bot.inlineButton('ℹ️ Help', {callback: '/help'}) ],
        [ bot.inlineButton('❓ About', {callback: '/about'}) ]
    ]);
    bot.sendMessage(msg.from.id, '<b>Available commands:</b>', { parseMode: 'HTML', replyMarkup });
    return bot.sendMessage(msg.from.id, `Hi, <b>${ msg.from.first_name }</b>!`, { parseMode: 'HTML' });
    // return bot.sendMessage(msg.from.id, '😺 Use commands: /alarm, /monitor, /about and /help', { parseMode: 'HTML', replyMarkup });
});
//bot.on('text', (msg) => msg.reply.text(msg.text));

bot.on('/about', (msg) => {
    return bot.sendMessage(msg.from.id, '<b>About</b> not implemented yet', { parseMode: 'HTML' });
});

bot.on(['/help', '/h'], (msg) => {
    return bot.sendMessage(msg.from.id, '<b>Help</b> not implemented yet', { parseMode: 'HTML' });
});

bot.on(['/alarm', '/a'], (msg) => {
    return bot.sendMessage(msg.from.id, '<b>Alarm</b> not implemented yet', { parseMode: 'HTML' });
});

bot.on(['/signal', '/s'], (msg) => {
    return bot.sendMessage(msg.from.id, '<b>Signal</b> not implemented yet', { parseMode: 'HTML' });
});

bot.on(['/exchanges', '/e'], (msg) => {
    var exc = ccxt.exchanges.join(', ');
    //console.log(exc);
    return bot.sendMessage(msg.from.id, `<b>Exchanges:</b> ${ exc }`, { parseMode: 'HTML' });
});

bot.start();

console.log('Bot server started...');