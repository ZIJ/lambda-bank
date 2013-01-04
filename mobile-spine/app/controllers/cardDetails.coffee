Spine = require('spine')
Card = require('models/card')

class CardDetails extends Spine.Controller
  constructor: ->
    super
    console.log('details controller created')
    @routes
      '/cards/:id': (params) =>
        @card = Card.find(params.id)
        console.log(@card)
        @active()
        @render()


  render: ->
    console.log('rendering card #' + @card.id + ' details')
    @html require('views/cardDetails')(@card)


module.exports = CardDetails