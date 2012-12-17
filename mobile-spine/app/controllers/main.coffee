Spine = require('spine')
Login = require('controllers/login')
Menu = require('controllers/menu')

class Main extends Spine.Stack
  controllers:
    login: Login
    menu: Menu

module.exports = Main