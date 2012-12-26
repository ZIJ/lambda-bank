Spine = require('spine')
Card = require('models/card')
Login = require('controllers/login')

class Cards extends Spine.Controller
  constructor: ->
    super
    console.log('cards controller created')

    Card.bind 'loaded', =>
      @render()


  render: ->
    console.log('cards rendering')
    cards = Card.all()
    @html ''
    for card in cards
      @append require('views/card')(card)


module.exports = Cards