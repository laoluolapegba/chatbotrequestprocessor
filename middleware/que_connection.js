var join = require('path').join
var debug = require('debug');
var rfs = require('fs').readFileSync
var amqp = require('amqplib/callback_api')
var url = process.env.AMQP_URL || 'amqp://queuser:queuser@209.97.189.137:5672';

module.exports = function(cb) {
    amqp.connect(url, function(err, conn) {
      if (err) {
        throw new Error(err)
      }
  
      cb(conn)
    })
  }
/*
var opts = {
  cert: rfs(join(__dirname, '../certs/server.crt')),
  key: rfs(join(__dirname, '../certs/server.key')),
  passphrase: 'ThePassphraseForYourKey',
  ca: [rfs(join(__dirname, '../certs/compose.crt'))]
}
*/