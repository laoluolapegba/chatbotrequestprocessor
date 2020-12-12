#!/usr/bin/env node
var debug = require('debug');
var p2pService = require('./services/p2ptransferService');
var log = require('./utils/winston');
const config = require('./config/config.js');
//const request = require('request');

var amqp = require('amqplib');
//var fs = require('fs');
InqRequestObject = require('./models/InqRequestObject')
//var url = process.env.AMQP_URL || 'amqp://queuser:queuser@209.97.189.137:5672';
amqp.connect(global.gConfig.amqp_url).then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    var ok = ch.assertExchange(global.gConfig.amqp_exchange, 'topic', {durable: true});
    ok = ok.then(function() {
      return ch.assertQueue(global.gConfig.p2pTransferQue, {exclusive: false});
    });
    ok = ok.then(function(qok) {
      return ch.bindQueue(qok.queue, global.gConfig.amqp_exchange, '').then(function() {
        return qok.queue;
      });
    });
    ok = ok.then(function(queue) {
      return ch.consume(queue, getRequestParams, {noAck: true});
    });
    return ok.then(function() {
      console.log(' [*] Waiting for p2ptransfer messages. To exit press CTRL+C');
    });

    //function doWork(msg) {
    //  console.log(" [x] '%s'", msg.content.toString());
    //}
    function getRequestParams(msg) {
        
        var body = msg.content.toString();
        log.info('Received message:' + body);
        //deserialize the request 
        //var logger = require('./utils/logger');
        try {
            var jsonObj = JSON.parse(body);
            //var requestMsg = new InqRequestObject({
            //  transactionId: jsonObj.transactionId
            //});
          
          //console.log("[x] Received Msg for conversationId '%s' " + jsonObj.conversationID);
          log.info("[x] Received Msg for conversationId '%s' " + jsonObj.conversationID);
          //Load all services in the services dir
          //fs.readFileSync(__dirname + '/services').forEach(function(filename){
           // if(~filename.indexOf('.js')) require (__dirname + '/services/' + filename)

          //});
		 
          var status = p2pService.callp2pTransfer(jsonObj.transactionId, jsonObj.transactionDate, jsonObj.serviceId, jsonObj.msisdn,
            jsonObj.receiverMsisdn, jsonObj.amount, jsonObj.messageType, jsonObj.conversationID, 
            function(status,responseBody,error_res){
              if(status){
                //console.log('Called Server successfully');
                log.info("Called Server successfully ");
                var responseData = JSON.parse(responseBody);
                //insert transaction into Db
                var mongoService = require('./services/mongodb');                
                let requestLogModel = require('./models/requestLogModel')
                let request = new requestLogModel({
                  mtn_ref: responseData.referenceid,
                  sid_ref: jsonObj.transactionId,
                  log_res: responseData,
                  mtn_compl_response:'',
                  sid_req: jsonObj,
                  msisdn: jsonObj.msisdn,
                  serviceId: jsonObj.serviceId,
                  conversationID: jsonObj.conversationID

                })
                  request.save()
                        .then(doc => {
                          //console.log('transaction ref: ' + doc.mtn_ref + ' saved in db')
                          log.info("transaction ref: '%s' saved in db " + doc.mtn_ref);
                        })
                        .catch(err => {
                        //console.error(err)
                        //console.log('Unable to save transaction ref ' +  responseData.referenceid + ' in Db' + err);
                                               
                        log.info("Unable to save transaction ref '%s'  in db " + responseData.referenceid );
                        log.error(err); 
                          //logger.Error("Error saving request ", options , err);
                  })


              }
            });
        } 
        catch(err) {
          //logger.Error("Error getting request Params", jsonObj , err);
		      console.log('Failed in getRequestParams' + err);
          //debug('Error getting request Params' + jsonObj + err);
        }
        
    }

    
  });
}).catch(console.warn);