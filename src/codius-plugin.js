import BlockCypher from './block-cypher'
import BB from 'bluebird'

export default class CodiusPlugin {

  constructor(codius) {
    this.blockCypher = new BlockCypher()
    this.blockCypher.receivePayments()

    codius.on('contract:created', (token) => {
      console.log('CONTRACT CREATED', token)
      this.getNewAddress(token.get('token')).then(address => {
        console.log('GOT NEW ADDRESS', address)
        return this.registerContract(token, address)
      })
      .then(result => {
        console.log('RESULT', result)
      })
    })
  }

  getNewAddress() {
    return new BB((resolve, reject) => {
      this.blockCypher.registerAddress().then(response => {
        resolve(response.body.input_address)
      })
    })
  }

  registerContract(token, address) {
    return this.codius.Ledger.findOrCreate({ name: 'bitcoin' })
      .then(function(ledger) {
        return ledger.registerAddress(token, address)
      })
  }
}

