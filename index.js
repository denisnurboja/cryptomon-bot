require('./db');
require('./bot');
require('./web');
require('./ccxt');

// Keepalive hack
var http = require("http");
setInterval(function() {
    http.get("http://cryptomon-bot.herokuapp.com");
}, 15 * 60000); // every 15 minutes