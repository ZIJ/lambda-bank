Spine = require('spine')
Card = require('models/card')
Login = require('controllers/login')

class Cards extends Spine.Controller
  constructor: ->
    super
    console.log('cards controller created')
    @html '<ul class="menuList"></ul>'
    Card.bind 'loaded', =>
      @render()

  className: 'cardsPage'

  elements:
    'ul': 'cardList'


  render: ->
    console.log('cards rendering')
    cards = Card.all()

    for card in cards
      @cardList.html require('views/card')(card)


module.exports = Cards