const https = require('https');

getDogePerUSD = function (exchange, cb) {
  var queryString;
  //If using Binance exchange:
  if(exchange == 'BINANCE')
    queryString = 'https://dapi.binance.com/dapi/v1/premiumIndex?symbol=DOGEUSD_PERP';
  else
    cb({'response':'err','val':'Invalid Exchange Provided!'});
    
  // Call API using provided exchange query string
  https.get(queryString, (resp) => {
    let data = '';
    
    resp.on('data', (chunk) => {
      data += chunk;
    });
    
    resp.on('end', () => {
      if('markPrice' in JSON.parse(data)[0])
        cb({'response':'ok','val':parseFloat(JSON.parse(data)[0].markPrice)});
      else
        cb({'response':'ok','val':parseFloat(JSON.parse(data)[0].markPrice)});
    });
  }).on("error", (err) => {
    cb({'response':'err','val':'Unable to obtain current Dogecoin price given exchange '+exchange});
  });
}

module.exports = {getDogePerUSD};
