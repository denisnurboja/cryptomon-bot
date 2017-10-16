var http = require("http");

http.createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\n');
}).listen(process.env.PORT || 8080);

var botgram = require("botgram");
var bot = botgram(process.env.BOTGRAM_AUTH_TOKEN);

bot.command("start", "help", (msg, reply) =>
    reply.text("To schedule an alert, do: /alert <seconds> <text>"));

bot.command("alert", (msg, reply) => {
    var [seconds, text] = msg.args(2)
    if (!seconds.match(/^\d+$/) || !text) return next();
    setTimeout(() => reply.text(text), Number(seconds) * 1000);
})

bot.command((msg, reply) => reply.text("Invalid command."));