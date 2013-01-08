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

    errors = @validate()
    message = ''
    errors.forEach (msg) ->
      message += msg + '\n'

    if errors.length == 0
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
        error: ->
          alert('login failed')
      )
    else
      alert(message)

  validate: ->
    errors = []
    atleast = /^.{3,}$/
    login = @usernameInput.val()
    password = @passwordInput.val()
    if not atleast.test(login)
      errors.push('Login should be at least 3 characters')
    if not atleast.test(password)
      errors.push('Password should be at least 3 characters')
    errors

module.exports = Login