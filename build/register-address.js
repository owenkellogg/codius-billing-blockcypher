"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BB = require("bluebird");
var http = BB.promisifyAll(require("superagent"));
var uuid = require("uuid");
var express = require("express");
var bodyParser = require("body-parser");
var PORT = process.env.BLOCK_CYPHER_PORT || 3333;

var PaymentController = (function () {
  function PaymentController() {
    _classCallCheck(this, PaymentController);
  }

  _prototypeProperties(PaymentController, null, {
    handle: {
      value: function handle(req, res, next) {
        this.processPayment(req.body);
        res.status(200).send();
      },
      writable: true,
      configurable: true
    },
    processPayment: {
      value: function processPayment(notification) {
        console.log("NEW PAYMENT!", notification);
      },
      writable: true,
      configurable: true
    }
  });

  return PaymentController;
})();

var BlockCypher = (function () {
  function BlockCypher() {
    _classCallCheck(this, BlockCypher);
  }

  _prototypeProperties(BlockCypher, null, {
    registerAddress: {
      value: function registerAddress() {
        return http.post("https://api.blockcypher.com/v1/btc/main/payments").send({
          destination: "1LmBBCava5z6eDx132e6WifNKRfhfydvuW",
          callback_url: "https://54.203.128.47/blocks",
          token: uuid.v4()
        }).endAsync();
      },
      writable: true,
      configurable: true
    },
    receivePayments: {
      value: function receivePayments() {
        var app = express();
        app.use(bodyParser.json());
        var controller = new PaymentController();
        app.post("/blocks", controller.handle.bind(controller));
        app.listen(PORT, function () {
          console.log("Listening for Bitcoin payments on port", PORT);
        });
      },
      writable: true,
      configurable: true
    }
  });

  return BlockCypher;
})();

module.exports = BlockCypher;