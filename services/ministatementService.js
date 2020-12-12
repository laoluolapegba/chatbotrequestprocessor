const fs = require('fs');
var status = {};
var path = require("path");
const request = require('request');
const config = require('../config/config.js');
var log = require('../utils/winston');
var miniStatementService = {} ;
  

miniStatementService.callInitiateMiniStatement = function callInitiateMiniStatement(transactionId, transactionDate, serviceId, msisdn, numoftransactions,
   messageType, conversationID, callback) {
    log.info("Initiating MiniStatement request at " + global.gConfig.ministatementUri);

    let jsonbody = JSON.stringify({
          "fri":"FRI:"+ msisdn + "/MSISDN",
          "numoftransactions": numoftransactions,
          "identity":"ID:"+ msisdn +"/MSISDN",
          "channelinformation": "CHATBOT" ,
          "locationinformation":{
              "city":"Cote","state":"Abijan","country":"XOF"
            }
        });
      const options = {
          uri:global.gConfig.ministatementUri,
          method: 'POST',
          headers: { 
            "Content-Type": "application/json;charset=utf-8",
            "Connection" :  "keep-alive",
          },
          timeout: global.gConfig.requestTimeout,
		  body: jsonbody,
      agentOptions: {
            cacert: fs.readFileSync(path.join(__dirname, '../ssl/', 'ca.pem')),
			cert: fs.readFileSync(path.join(__dirname, '../ssl/', 'client.pem')),
			key: fs.readFileSync(path.join(__dirname, '../ssl/', 'private.key'))
          }     
         
        };

        log.info('Calling Service Orchestrator' + ' with params ' + jsonbody );
      request.post(options, function (error, httpResponse, body) {
          if (!error && httpResponse.statusCode == 200) {
			    
			  //check if the returned body is not html 
			  //<html><head><title>Request Rejected</title></head><body>The requested URL was rejected. Please consult with your administrator.<br><br>Your support ID is: 10524885283756337457<br><br><a href='javascript:history.back();'>[Go Back]</a></body></html>
			  if(!body.startsWith("<html>")){
				  //console.log('response type' + httpResponse.is('json'));
				  console.log('::::::::::::initiateministatement::::::>>>>>>>>>>>');   
				  //{"status":"PENDING","referenceid":"4307606521913356"}
				  var responseData = JSON.parse(body);
				  var statusString = responseData.status;
				  var referenceid = responseData.referenceid;
				  log.info('Status:' + statusString + ';Reference:' + referenceid);
				   
				  //{"errorcode":"INTERNAL_ERROR"}
				  //{"errorcode":"SERVICE_UNAVAILABLE"}
				  callback(true,body,error);            
			  }
			  else{
				  log.info('body' + body);   
			  }
			  
          }
          else {
              //res = 'Not Found';
              log.warn('::::::::::::initiateministatement error::::::>>>>>>>>>>>' + error);    
              callback(false,body,error);   
          }
          //callback(res);
      });
};


//class Cat {
//  makeSound() {
//    return 'Meowww';
//  }
//}

// exports = Cat; // It will not work with `new Cat();`
// exports.Cat = Cat; // It will require `new Cat.Cat();` to work (yuck!)
//module.exports = Cat;
module.exports = miniStatementService;