Spine = require('spine')

class Card extends Spine.Model
  @configure 'Card', 'id', 'accounts', 'number', 'type', 'user', 'state'

  @listUrl: 'http://lambda-bank.drs-cd.com/WebService.svc/user/cards/list'

  @loadAll: ->
    console.log('loadAll called')
    data = JSON.stringify
      securityToken: localStorage.getItem('lambda-bank.token')
    $.ajax
      type: 'POST'
      url: @listUrl
      data: data
      dataType: 'json'
      cache: false
      contentType: "application/json"
      success: (response) =>
        console.log('cards loaded')
        @saveAll(response.Response)

  @saveAll: (cards) ->
    for info in cards
      @create
        id: info.ID
        number: info.Number
        type: info.Type
        user: info.User
        accounts: info.Accounts
        state: info.CardState
    @trigger('loaded')




module.exports = Card