/** InqRequestObject.js **/

function InqRequestObject (transactionId, transactionDate, serviceId, msisdn, numoftransactions, messageType ) {
  this.transactionId = transactionId;
  this.transactionDate = transactionDate;
  this.serviceId = serviceId;
  this.msisdn = msisdn;
  this.numoftransactions = numoftransactions;
  this.messageType = messageType;
}

module.exports = InqRequestObject; 


/*
https://github.com/timjrobinson/nodejsmodels/blob/master/user.js
http://timjrobinson.com/how-to-structure-your-nodejs-models-2/
https://gcanti.github.io/2014/09/12/json-deserialization-into-an-object-model.html
function MovieResponse(success, errorMessage, movieId, movieName) {
  BaseResponse.call(this, success, errorMessage);  // Call the base class's constructor (if necessary)

  this.movieId = movieId;
  this.movieName = movieName;
}

{
  "transactionId": "d701748f0851",
  "transactionDate": {},
  "serviceId": 1001,
  "msisdn": 2348033646201,
  "numoftransactions": 10,
  "messageType": 200
}
*/