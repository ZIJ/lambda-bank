Spine = require('spine')
Card = require('models/card')
Confirmation = require('controllers/confirmation')

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

    errors = @validate()
    message = ''
    errors.forEach (msg) ->
      message += msg + '\n'
    if errors.length == 0
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
    else
      alert(message)


  validate: ->
    errors = []
    phone = /^\d{9}$/
    number = Number(@numberInput.val())
    amount = Number(@amountInput.val())
    if not phone.test(number)
      errors.push('Phone number should be 9 digits')
    if amount <= 0
      errors.push('Amount should be positive')
    errors


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
        info = require('views/paymentInfo')(amount: response.Response.AmountCharged)
        confirmation = new Confirmation(info)
        @append confirmation
        confirmation.bind 'confirm', =>
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