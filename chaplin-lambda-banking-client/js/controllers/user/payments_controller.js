define([
    'jquery',
    'underscore',
    'chaplin',
    'controllers/base/controller',
    // TODO: load when needed
    'models/user/cards',
    'views/user/payments/layout_view',
    'views/user/payments/select_card_view',
    'models/user/card'
], function($, _, Chaplin, Controller, CardsCollection, PaymentLayoutView, SelectCardView, CardModel) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardsController = Controller.extend({

        title: 'Cards',

        // TODO: for preventing multiple fast clicks
        canSaveCard: true,

        initialize: function(params) {
            var controller = this;

            _.bindAll(controller, 'triggerLoadCurrencies', 'triggerLoadCardTypes');

            CardsController.__super__.initialize.apply(controller, arguments);




            //TODO: old part
            controller.subscribeEvent('!loadCurrencies', controller.triggerLoadCurrencies);
            controller.subscribeEvent('!loadCardTypes', controller.triggerLoadCardTypes);
        },

        index: function() {
            var controller = this;

            var cards = new CardsCollection();

            controller.view = new PaymentLayoutView({});

            var selectCardView = new SelectCardView({
                collection: cards,
                container: controller.view.$('section.content')
            });

            controller.view.subview('selectCard', selectCardView);
            controller.view.subview('selectCard').renderAllItems();




        },



        //TODO: old part

        triggerLoadCurrencies: function() {
            var controller = this,
                currencies = new CurrenciesCollection();

            // TODO: check if it exists before fetching
            currencies.fetch({
                success: function() {
                    mediator.publish('currenciesLoaded', currencies)
                }
            });
        },

        triggerLoadCardTypes: function() {
            var controller = this,
                cardTypes = new CardTypes();

            // TODO: check if it exists before fetching
            cardTypes.fetch({
                success: function() {
                    mediator.publish('cardTypesLoaded', cardTypes)
                }
            });
        }

    });

    return CardsController;
});
