Spine = require('spine')
Card = require('models/card')

class PayCell extends Spine.Controller
  constructor: ->
    super
    Card.bind 'loaded', =>
      @render()
    Card.loadAll()

  className: 'payCellPage'

  detailsUrl: 'http://lambda-bank.drs-cd.com/WebService.svc/user/payment/accountdetails'
  preinfoUrl: 'http://lambda-bank.drs-cd.com/WebService.svc/user/payment/preinfo'
  proceedUrl: 'http://lambda-bank.drs-cd.com/WebService.svc/user/payments/proceed'

  elements:
    'form input[name=number]': 'numberInput'
    'form input[name=amount]': 'amountInput'
    'form select[name=card]': 'cardSelect'

  events:
    'submit form': 'submit'

  render: ->
    @html require('views/payCell')()
    cards = Card.all()
    console.log(cards)
    for card in cards
      @cardSelect.append require('views/cardOption')(card)

  submit: (event) ->
    event.preventDefault()
    number = @numberInput.val()
    data =
      securityToken: localStorage.getItem('lambda-bank.token')
      requisite:
        Type: 0
        JsonPayment: JSON.stringify
          "privateNumber" : number

    $.ajax(
      type: 'POST'
      url: @detailsUrl
      data: JSON.stringify(data)
      dataType: 'json'
      cache: false
      contentType: "application/json"
      success: (response) =>
        @preinfo(data)
    )

  preinfo: (detailsData) ->
    requisite =
      Type: detailsData.requisite.Type
      JsonPayment: detailsData.requisite.JsonPayment
      Amount: Number(@amountInput.val())
      AccountId: @cardSelect.find('option:selected').data('account-id')
    data =
      securityToken: detailsData.securityToken
      requisite: requisite

    console.log('preinfo data', data)
    $.ajax(
      type: 'POST'
      url: @preinfoUrl
      data: JSON.stringify(data)
      dataType: 'json'
      cache: false
      contentType: "application/json"
      success: (response) =>
        @proceed(data, response)
    )

  proceed: (preinfo, response) ->
    preinfo.ChangeId = response.ChangeId
    $.ajax(
      type: 'POST'
      url: @proceedUrl
      data: JSON.stringify(preinfo)
      dataType: 'json'
      cache: false
      contentType: "application/json"
      success: (response) =>
        console.log(response)
    )








module.exports = PayCell