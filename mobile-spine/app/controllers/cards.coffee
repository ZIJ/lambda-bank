Spine = require('spine')

class Cards extends Spine.Controller
  constructor: ->
    super

  url: 'http://lambda-bank.drs-cd.com/WebService.svc/user/cards/list'

  load: ->
    token = localStorage.getItem('lambda-bank.token')
    data = JSON.stringify
      securityToken: token
    $.ajax(
      type: 'POST'
      url: @url
      data: data
      dataType: 'json'
      cache: false
      contentType: "application/json"
      success: (response) =>
        console.log(response)
    )


module.exports = Cards