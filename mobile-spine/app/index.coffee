require('lib/setup')

Spine = require('spine')
Pages = require('controllers/pages')
Card = require('models/card')

class App extends Spine.Controller
  constructor: ->
    super

    @pages = new Pages()
    @append @pages

    Spine.Route.setup()

    @navigate '/login'


module.exports = App
    