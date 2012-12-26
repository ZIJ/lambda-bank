Spine = require('spine')

class TestController extends Spine.Controller
  constructor: ->
    super
    console.log('test controller created')
    @render()

  render: ->
    @html require('views/test')()

module.exports = TestController