var debug = require('debug');
var rabbitConn = require('./middleware/connection');
var queue = 'bot_in_queue';

rabbitConn(function(conn) {
    conn.createChannel(function(err, ch) {
      if (err) {
        throw new Error(err)
      }
      var exchange = 'momo_exchange'
  
      ch.assertExchange(exchange, 'fanout', {durable: true})
      ch.assertQueue(queue, {exclusive: false}, function(err, q) {
        if (err) {
          throw new Error(err)
        }
        ch.bindQueue(q.queue, exchange, '')
        ch.consume(q.que, function(msg) {
            //process the message
          //chat.emit('chat', msg.content.toString())
            console.log(msg.content.toString())
        })
      }, {noAck: true})
    })
  })
function encode(doc) {  
    return new Buffer(JSON.stringify(doc));
}