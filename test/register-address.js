var CodiusPlugin = require(__dirname+'/../')
var EventEmitter = require('events').EventEmitter
var uuid         = require('uuid')

var codius = new EventEmitter()

var token = {
  get: function() {
    return uuid.v4() 
  }
}

new CodiusPlugin(codius)

codius.emit('contract:created', token)

