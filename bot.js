// Resources:
//    https://github.com/botgram/botgram
//    https://tutorials.botsfloor.com/creating-a-bot-using-the-telegram-bot-api-5d3caed3266d
//    https://blog.srnd.org/intro-to-node-js-making-a-telegram-bot-964b8cfe1129?gi=3b717c902aa9
//    http://mvalipour.github.io/node.js/2015/11/10/build-telegram-bot-nodejs-heroku
//    http://qpbp.name/tutorials/2016/07/13/deploying-telegram-bot-to-heroku.html

/*
var botgram = require("botgram");
var bot = botgram(process.env.TELEGRAM_TOKEN);

bot.command("start", "help", (msg, reply) =>
    reply.text("To schedule an alert, do: /alert <seconds> <text>"));

bot.command("alert", (msg, reply) => {
    var [seconds, text] = msg.args(2)
    if (!seconds.match(/^\d+$/) || !text) return next();
    setTimeout(() => reply.text(text), Number(seconds) * 1000);
})

bot.command((msg, reply) => reply.text("Invalid command."));
*/


/*
var Bot = require('node-telegram-bot-api');

bot = new Bot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/^\/hello (.+)$/, function(msg, match) {
    var name = match[1];
    bot.sendMessage(msg.chat.id, 'Hello ' + name + '!').then(function() {
        // reply sent!
    });
});
*/


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
    usePlugins: ['askUser'] // Optional. Use build-in plugins from pluginFolder.
});

bot.on(['/start'], (msg) => {
    // Command keyboard
    const replyMarkup = bot.keyboard([
        ['/alarm', '/monitor', '/help']
    ], { resize: true, once: false });
    return bot.sendMessage(msg.from.id, '😺 Use commands: /alarm, /monitor, /about and /help', { parseMode: 'HTML', replyMarkup });
});
//bot.on('text', (msg) => msg.reply.text(msg.text));

bot.on('/about', function(msg) {
    let text = '😽 This bot is powered by TeleBot library https://github.com/kosmodrey/telebot Go check the source code!';
    return bot.sendMessage(msg.chat.id, text);
});

bot.on('/help', (msg) => {
    return bot.sendMessage(msg.from.id, '<b>Help</b> not implemented yet', { parseMode: 'HTML' });
});

bot.on('/alarm', (msg) => {
    return bot.sendMessage(msg.from.id, '<b>Alarm</b> not implemented yet', { parseMode: 'HTML' });
});

bot.on('/monitor', (msg) => {
    return bot.sendMessage(msg.from.id, '<b>Monitor</b> not implemented yet', { parseMode: 'HTML' });
});

bot.on('/exchanges', (msg) => {
    var exc = ccxt.exchanges.join(', ');
    console.log(exc);
    return bot.sendMessage(msg.from.id, exc, { parseMode: 'HTML' });
});

bot.on('/hello', (msg) => {
    return bot.sendMessage(msg.from.id, `Hi, <b>${ msg.from.first_name }</b>!`, { parseMode: 'HTML' });
});


bot.start();

console.log('Bot server started...');