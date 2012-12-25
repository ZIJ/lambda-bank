Spine = require('spine')
$ = Spine.$

class Login extends Spine.Controller
  constructor: ->
    super
    console.log('login controller created')

  url: 'http://lambda-bank.drs-cd.com/WebService.svc/login'

  elements:
    'form': 'form'
    'form input[name=username]': 'usernameInput'
    'form input[name=password]': 'passwordInput'

  events:
    'submit form': 'submit'

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
        @navigate '/menu'
    )

module.exports = Login