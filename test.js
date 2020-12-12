const request = require('request');
const fs = require('fs');

var log = require('./utils/winston');

var msisdn = '22546017993';
//"https://ewp.mobilemoney.mtn.ci:8018/v1/login"
log.info('Calling mtn server');

request({
  method: "POST",
  uri:"https://ewp.mobilemoney.mtn.ci:8018/chatbot/api/initiatebalance" , 
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "Connection" :  "keep-alive"
  },
  timeout: 500,
  body: JSON.stringify(
			{"fri":"FRI:22546017993/MSISDN","identity":"ID:22546017993/MSISDN",
         "quoteid":"233333423","channelinformation": "CHATBOT" ,
         "locationinformation":{"city":"Cote","state":"Abijan","country":"XOF"}}              
        ),
  agentOptions: {
        cacert: fs.readFileSync('./ssl/ca.pem'),
        cert: fs.readFileSync('./ssl/client.pem'),
        key: fs.readFileSync('./ssl/private.key')
        
  }
}, function(error, httpResponse, body) {
  //console.log('body' + body);
  //console.log('httpResponse' + httpResponse);
  //console.log(error);
  
  if(!error && httpResponse.statusCode == 200){	  
	log.info('body' + body);	
  }
  else {
	log.error('Error calling orachestrator:' + error);
  }

 
}); 