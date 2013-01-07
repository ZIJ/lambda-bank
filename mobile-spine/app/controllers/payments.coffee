Spine = require('spine')

class Payments extends Spine.Controller
  constructor: ->
    super
    console.log('payments controller created')
    @render()

  className: 'paymentsPage'

  render: ->
    @html require('views/payments')()

module.exports = Payments