Spine = require('spine')

class Card extends Spine.Model
  @configure 'Card', 'id', 'accounts', 'number', 'type', 'user'

  constructor: (descriptor) ->
    super
    console.log(descriptor)

  @queryAll: ->
    url = Spine.Model.host + 'user/cards/list'
    data =
      securityToken: localStorage.getItem 'lambda-bank.token'
    $.ajax
      type: 'POST'
      url: url
      data: data
      dataType: 'json'
      cache: false
      contentType: "application/json"
      success: (response) =>
        cards = response.Response
        for card in cards
          new @(card).save()
        console.log(@)

module.exports = User