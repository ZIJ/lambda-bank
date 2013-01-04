Spine = require('spine')
Card = require('models/card')

class Login extends Spine.Controller
  constructor: ->
    super
    @render()

  className: 'loginPage'

  url: 'http://lambda-bank.drs-cd.com/WebService.svc/login'

  elements:
    'form input[name=username]': 'usernameInput'
    'form input[name=password]': 'passwordInput'

  events:
    'submit form': 'submit'

  render: ->
    @html require('views/login')()

  submit: (event) ->
    event.preventDefault()
    data = JSON.stringify(
      login: @usernameInput.val()
      password: @passwordInput.val()
    )
    $.ajax(
      type: 'POST'
      url: @url
      data: data
      dataType: 'json'
      cache: false
      contentType: "application/json"
      success: (response) =>
        localStorage.setItem('lambda-bank.token', response.Response.AuthenticationToken)
        @trigger('loginSucces')
        Card.loadAll()
        @navigate '/menu'
    )

module.exports = Login