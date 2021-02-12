var exchange = require('./exchange.js');
var fs = require('fs');
var mysql = require('mysql');
var tmi = require('tmi.js');

var client;
var settings = {
  'loaded': false
};

var notificationList = [
  {
    "user":"PretzelStyx",
    "delay": 20
  }
]

var notificationTable =
  [
    {
      "user":"PretzelStyx",
      "showAt":(Date.now())+1000
    }
  ]

fs.readFile('./config/settings.json', 'utf8', (err, data) => {
      if (err) {
        return;
      }
      else {
        var s = JSON.parse(data);
        
        client = new tmi.client(s.twitchAuth);

        // Register our event handlers (defined below)
        client.on('message', onMessageHandler);
        client.on('connected', onConnectedHandler);

        // Connect to Twitch:
        client.connect();
      }
    })

// Create a client with our options

setInterval(function() {
  for(var i=0; i<notificationTable.length; i++) {
    var now = Date.now();
    if(notificationTable[i].showAt < now) {
      client.say(notificationTable[i].user,"Did you know "+notificationTable[i].user+" takes tips in DOGE? Go to https://pretzelstyx.com/GibDogeTreats for details!");
      
      notificationTable[i].showAt = now + notificationList.find((elem) => elem.user == notificationTable[i].user).delay*1000*60;
    }
  }
}, 1000);

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  msg = msg.trim();
  
  if(msg.charAt(0) == '+') {
    
    // Get rid of '+'
    msg = msg.substring(1)
    
    // Break chat message into parts
    msgParts = msg.split(' ');
    
    // Is this a GibDogeTreats command?
    if(settings.commandPrefixList.includes(msgParts[0])) {
      // Determine command action
      
      /* Convert FIAT to Doge before sending
       * Command syntax: +GibDoge $5 [user]
       * If user is provided, move Doge to that user
       * Otherwise, send doge to broadcaster
      */

      if(msgParts[1].charAt(0) == '$') {
          // Extract Number of Dollar
          var amtUSD = msgParts[1].substring(1);
          var amtDoge;
          
          //Check if Dollar amount is actually a number uwu?
          if(!isNaN(parseInt(amtUSD))) {
              exchange.getDogePerUSD('BINANCE', function(data) {
                if(data.response == 'ok')
                  client.say(target, 'Converted $'+amtUSD+' to '+(amtUSD/data.val).toFixed(2)+' Doge');
                else
                  client.say(target, 'Error! '+data.val);
              })
          }
          else {
            client.say(target, "Error: Bad USD Amount in command");  
          }
      }
      else if(!isNaN(parseInt(msgParts[1]))) {
          client.say(target, 'Moving '+msgParts[1]+' Doge from one user to '+msgParts[3]);
      }
      else {
          client.say(target, `Send Doge with +GDT {Amount} [User] (Leave out the user to send to ${target})`);
      }
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}


// Cool awesome function
function processor () {
  
  this.getConfigSettings = function(cb) {
    fs.readFile('./config/settings.json', 'utf8', (err, data) => {
      if (err) {
        cb({'response':'err','val':'Error loading configuration settings file'})
        return;
      }
      else {
        settings = JSON.parse(data);
        
        cb({'response':'ok','val':'Confiugration loaded! '+JSON.stringify(settings)})
      }
    })
  }
  
  this.debug = function(msg) {
    console.log(msg);
  }
}

var a = new processor();

a.getConfigSettings(a.debug);
