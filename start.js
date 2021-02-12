// Three pieces of information for a user : Twitch User ID, Balance in Doge, Deposit Address
var mysql = require('mysql');
var message = require('./lib/message.js')
/*
parseChatMessage('+Gib $15 kalmkage');
parseChatMessage('+Gib 15 kalmkage');
parseChatMessage('+Gib $fg15 kalmkage');
parseChatMessage('+Gib h15 kalmkage');
*/