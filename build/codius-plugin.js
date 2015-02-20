"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BlockCypher = _interopRequire(require("./register-address"));

var BB = _interopRequire(require("bluebird"));

var CodiusPlugin = (function () {
  function CodiusPlugin(codius) {
    var _this = this;
    _classCallCheck(this, CodiusPlugin);

    this.blockCypher = new BlockCypher();
    this.blockCypher.receivePayments();

    codius.on("contract:created", function (token) {
      console.log("CONTRACT CREATED", token);
      _this.getNewAddress().then(function (address) {
        console.log("GOT NEW ADDRESS", address);
        return _this.registerContract(token, address);
      }).then(function (result) {
        console.log("RESULT!", result);
      });
    });
  }

  _prototypeProperties(CodiusPlugin, null, {
    getNewAddress: {
      value: function getNewAddress() {
        var _this = this;
        return new BB(function (resolve, reject) {
          _this.blockCypher.registerAddress().then(function (response) {
            resolve(response.body.input_address);
          });
        });
      },
      writable: true,
      configurable: true
    },
    registerContract: {
      value: function registerContract(token, address) {
        return this.codius.Ledger.findOrCreate({ name: "bitcoin" }).then(function (ledger) {
          return ledger.registerAddress(token, address);
        });
      },
      writable: true,
      configurable: true
    }
  });

  return CodiusPlugin;
})();

module.exports = CodiusPlugin;