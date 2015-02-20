const BB = require('bluebird')
const http = BB.promisifyAll(require('superagent'))
const uuid = require('uuid')
const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env['BLOCK_CYPHER_PORT'] || 3333

class PaymentController {

  handle(req, res, next) {
    this.processPayment(req.body)
    res.status(200).send()
  }

  processPayment(notification) {
    console.log('NEW PAYMENT!', notification)
  }
}

export default class BlockCypher {

  registerAddress(token) {
    return http
      .post('https://api.blockcypher.com/v1/btc/main/payments')
      .send({
        "destination": "1LmBBCava5z6eDx132e6WifNKRfhfydvuW",
        "callback_url": "https://54.203.128.47/blocks",
        "token": token
      })
      .endAsync()
  }

  receivePayments() {
    var app = express()
    app.use(bodyParser.json())
    var controller = new PaymentController()
    app.post('/blocks', controller.handle.bind(controller))
    app.listen(PORT, function() {
      console.log('Listening for Bitcoin payments on port', PORT)
    })
  }
}

