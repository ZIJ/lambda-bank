Spine = require('spine')
Login = require('controllers/login')
Menu = require('controllers/menu')
Cards = require('controllers/cards')

class Pages extends Spine.Stack
  controllers:
    login: Login
    menu: Menu
    cards: Cards

  routes:
    '/login': 'login'
    '/menu': 'menu'
    '/cards': 'cards'

module.exports = Pages