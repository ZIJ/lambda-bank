Spine = require('spine')
Login = require('controllers/login')
Menu = require('controllers/menu')
Cards = require('controllers/cards')
Details = require('controllers/cardDetails')
Payments = require('controllers/payments')
PayCell = require('controllers/payCell')

class Pages extends Spine.Stack
  controllers:
    login: Login
    menu: Menu
    cards: Cards
    details: Details
    payments: Payments
    payCell: PayCell

  routes:
    '/login': 'login'
    '/menu': 'menu'
    '/cards': 'cards'
    '/payments': 'payments'
    '/pay/cell': 'payCell'

module.exports = Pages