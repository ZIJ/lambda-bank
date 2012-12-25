Spine = require('spine')
Login = require('controllers/login')
Menu = require('controllers/menu')

class Pages extends Spine.Stack
  controllers:
    login: Login
    menu: Menu

module.exports = Pages