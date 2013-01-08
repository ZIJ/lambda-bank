define([
    'jquery',
    'underscore',
    'chaplin',
    'controllers/base/controller',
    // TODO: load when needed
    'models/user/cards',
    'views/user/cards/cards_view',
    'models/user/card',
    'models/currencies',
    'models/card_types'
], function($, _, Chaplin, Controller, CardsCollection, CardsView, CardModel, CurrenciesCollection, CardTypes) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardsController = Controller.extend({

        title: 'Cards',

        // TODO: for preventing multiple fast clicks
        canSaveCard: true,
        canFreezeCards: true,

        initialize: function(params) {
            var controller = this;

            _.bindAll(controller, 'triggerLoadCurrencies', 'triggerLoadCardTypes');

            CardsController.__super__.initialize.apply(controller, arguments);

            controller.subscribeEvent('!loadCurrencies', controller.triggerLoadCurrencies);
            controller.subscribeEvent('!loadCardTypes', controller.triggerLoadCardTypes);
        },

        index: function() {
            var controller = this;

            controller.collection = new CardsCollection();

            controller.view = new CardsView({
                collection: controller.collection
            });
        },

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
