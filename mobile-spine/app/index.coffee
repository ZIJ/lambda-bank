require('lib/setup')

Spine = require('spine')
Login = require('controllers/login')
Menu = require('controllers/menu')
Cards = require('controllers/cards')

class App extends Spine.Controller
  constructor: ->
    super

    @login = new Login({el: $('#login')})
    @login.bind 'loginSuccess', (response) =>
      localStorage.setItem('lambda-bank.token', response.AuthenticationToken)

    @menu = new Menu({el: $('#menu')})

    @cards = new Cards({el: $('#cards')})

    @routes
      '/login': =>
        @page 'login'
      '/menu':  =>
        @page 'menu'
      '/cards':  =>
        @page 'cards'
        @cards.load()


    Spine.Route.setup()
    @navigate '/login'

  page: (name) ->
    console.log('paging to' + name)
    $('.page').hide()
    $('#' + name).show()

module.exports = App
    