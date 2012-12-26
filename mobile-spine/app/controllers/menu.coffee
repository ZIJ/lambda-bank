Spine = require('spine')

class Menu extends Spine.Controller
  constructor: ->
    super
    console.log('menu controller created')
    @render()

  render: ->
    @html require('views/menu')()
    
module.exports = Menu