const fs = require('fs');
var status = {};
var path = require("path");
const request = require('request');
const config = require('../config/config.js');
var log = require('../utils/winston');
var topUpService = {} ;
  

topUpService.callInitiatePayment = function callInitiatePayment(transactionId, transactionDate, serviceId, msisdn, receiverMsisdn, amount,
   messageType, conversationID, callback) {
    log.info ("Initiating Airtime topup at " + global.gConfig.airtimeTopUpUri );
    /*const fs = require('fs')
        , path = require('path')
        , certFile = path.resolve(__dirname, '../ssl/client.pem')
        , keyFile = path.resolve(__dirname, '../ssl/private.key')
        , caFile = path.resolve(__dirname, '../ssl/ca.pem')
        , request = require('request');
		*/
      var jsonbody = JSON.stringify({
        "sendingfri":"FRI:" + msisdn + "/MSISDN",
        "receivingfri":"FRI:" + msisdn + "/MSISDN",
        "amount":{
          "amount":amount,
          "currency":"XOF"
        },
        "sendernote":"Transfer to " + msisdn,
        "receivermessage":"Transfer from " + msisdn,
        "referenceid":transactionId,
        "channelinformation": "CHATBOT" ,
        "locationinformation":{
        "city":"Cote","state":"Abijan","country":"XOF"
        }
      });
      const options = {
          uri:global.gConfig.airtimeTopUpUri,
          method: 'POST',
          headers: { 
            "Content-Type": "application/json;charset=utf-8",
            "Connection" :  "keep-alive",
          },
          timeout: global.gConfig.requestTimeout,

        //  '{"sendingfri":"FRI:22546017993/MSISDN",
        //  "receivingfri":"FRI:22556999124/MSISDN",
        //  "amount":{"amount": 100,"currency":"XOF"},"sendernote":"xxx","receivermessage":"xxx","referenceid":"",
        // "channelinformation":"CHATBOT","locationinformation":{"city":"Cote","state":"Abijan","country":"XOF"}}'

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
				  log.info('::::::::::::initiatepayment::::::>>>>>>>>>>>');   
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
              log.warn('::::::::::::initiatepayment error::::::>>>>>>>>>>>' + error);   
              callback(false,body,error);   
          }
          //callback(res);
      });
};
module.exports = topUpService;