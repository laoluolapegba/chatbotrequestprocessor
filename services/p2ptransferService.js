const fs = require('fs');
var status = {};
var path = require("path");
const request = require('request');
const config = require('../config/config.js');
var log = require('../utils/winston');
var p2pTransferService = {} ;
  

p2pTransferService.callp2pTransfer = function callp2pTransfer(transactionId, transactionDate, serviceId, msisdn, receiverMsisdn,
  amount,  messageType, conversationID, callback) {
    log.info("Initiating P2P transfer at " + global.gConfig.p2pTransferUri );

  //  '{"sendingfri":"FRI:22546017993/MSISDN","receivingfri":"FRI:22556999124/MSISDN",
 //"amount":{"amount": 100,"currency":"XOF"},"sendernote":"xxx",
 //"receivermessage":"xxx","referenceid":"",
 //"channelinformation":"CHATBOT",
 //"locationinformation":{"city":"Cote","state":"Abijan","country":"XOF"}}'

      let jsonbody = JSON.stringify({
        "sendingfri":"FRI:" + msisdn + "/MSISDN",
        "receivingfri":"FRI:" + receiverMsisdn + "/MSISDN",
        "amount":{
          "amount":amount,
          "currency":"XOF"
        },
        "sendernote":"xxx" ,//+ receiverMsisdn,
        "receivermessage":"xxx" , //+ msisdn,
        "referenceid":"", //transactionId,
        "channelinformation": "CHATBOT" ,
        "locationinformation":{
        "city":"Cote","state":"Abijan","country":"XOF"
        }
      });

      const options = {
          uri:global.gConfig.p2pTransferUri,
          method: 'POST',
          headers: { 
            "Content-Type": "application/json;charset=utf-8",
            "Connection" :  "keep-alive",
          },
          timeout: global.gConfig.requestTimeout,
         // {"sendingfri":"FRI:22546017993/MSISDN","receivingfri":"FRI:22556999124/MSISDN","amount":
          //{"amount": 100,"currency":"XOF"},"sendernote":"xxx","receivermessage":"xxx","referenceid":"",
          //"channelinformation":"CHATBOT","locationinformation":{"city":"Cote","state":"Abijan","country":"XOF"}}'
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
				  console.log('::::::::::::initiatep2ptransfer::::::>>>>>>>>>>>');   
				  //{"financialtransactionstatus":"PENDING","referenceid":"4307606521913356"}
				  var responseData = JSON.parse(body);
				  var statusString = responseData.financialtransactionstatus;
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
              log.warn('::::::::::::initiatep2ptransfer error::::::>>>>>>>>>>>' + error);  
              callback(false,body,error);   
          }
          //callback(res);
      });
};
module.exports = p2pTransferService;