Spine = require('spine')

class WizardStep extends Spine.Model
  @configure 'WizardStep', 'wizard'

  constructor: (action) ->
    super
    @action = action

  @init: (wizard) ->
    @wizard = wizard

  @exec: ->
    @action()

  @finalize: ->
    @

  @next: ->
    @finalize()
    @wizard.nextStep()


module.exports = WizardStep