var http = require("http");

http.createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\n');
}).listen(process.env.PORT || 8080);

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



const TeleBot = require('telebot');

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

bot.on('text', (msg) => msg.reply.text(msg.text));

bot.start();