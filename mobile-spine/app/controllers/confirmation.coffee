Spine = require('spine')

class Confirmation extends Spine.Controller
  constructor: (content) ->
    super
    @html require('views/confirmation')(content: content)

  events:
    'click button[name=confirm]': 'confirm'
    'click button[name=cancel]': 'cancel'

  confirm: ->
    @el.remove()
    @trigger 'confirm'

  cancel: ->
    @el.remove()
    @trigger 'cancel'

module.exports = Confirmation
