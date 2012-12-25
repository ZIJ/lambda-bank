Spine = require('spine')

class Wizard extends Spine.Model
  @configure 'Wizard', 'steps', 'currentStep'

  constructor: (stepCollection) ->
    super
    @steps = []
    for step in stepsCollection
      @steps.push(step)
      step.init(@)

  nextStep: ->
    currentStep.next()




module.exports = Wizard