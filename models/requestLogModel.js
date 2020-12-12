//import Database from '../middleware/db_connection'

let mongoose = require('mongoose')
let requestLogSchema = new mongoose.Schema({
  mtn_ref: String,
  log_res: Object,
  mtn_compl_response: Object,
  sid_ref: {
    type:String,
    required: true,
    lowercase: true
  },
  sid_req: Object,
  msisdn:String,
  serviceId:Number,
  conversationID: String
})
module.exports = mongoose.model('requestLogModel', requestLogSchema, 'request_log')
