// https://github.com/botgram/botgram
// https://tutorials.botsfloor.com/creating-a-bot-using-the-telegram-bot-api-5d3caed3266d
// https://blog.srnd.org/intro-to-node-js-making-a-telegram-bot-964b8cfe1129?gi=3b717c902aa9

const botgram = require("botgram");
const bot = botgram("425567866:AAHQZ7NrvcvbLukOeFC71Dgbe3FjVfVes_s");

bot.command("start", "help", (msg, reply) =>
    reply.text("To schedule an alert, do: /alert <seconds> <text>"));

bot.command("alert", (msg, reply) => {
    var [seconds, text] = msg.args(2)
    if (!seconds.match(/^\d+$/) || !text) return next();
    setTimeout(() => reply.text(text), Number(seconds) * 1000);
})

bot.command((msg, reply) => reply.text("Invalid command."));