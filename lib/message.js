var exchange = require('./exchange.js');

parseChatMessage = function (msg) {
    if(msg.charAt(0) == '+') {
        // Get rid of '+'
        msg = msg.substring(1)
        
        // Break chat message into parts
        msgParts = msg.split(' ');
        
        // Is this a GibDogeTreats command?
        if(['GDT','Gib','Give','GibDoge','GibDogeTreat','GibDogeTreats'].includes(msgParts[0])) {
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
                    amtDoge = exchange.getDogePerUSD(amtUSD);
                    console.log('Converted $'+amtUSD+' to '+amtDoge+' Doge');
                    return true;
                }
                else {
                  console.log("Error: Bad USD Amount in command");  
                }
            }
            else if(!isNaN(parseInt(msgParts[1]))) {
                console.log('Moving '+msgParts[1]+' Doge from one user to '+msgParts[3]);
            }
            else {
                console.log("Something went wrong.");
            }
        }
    }
} 

module.exports = parseChatMessage;
