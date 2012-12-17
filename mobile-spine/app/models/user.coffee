Spine = require('spine')

class User extends Spine.Model
  @configure 'User', 'role', 'token'

  constructor: ->
    super
    @role = 'guest'
    @token = null
  
module.exports = User