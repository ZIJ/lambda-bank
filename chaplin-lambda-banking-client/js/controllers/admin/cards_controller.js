define([
    'jquery',
    'underscore',
    'chaplin',
    'controllers/base/controller',
    // TODO: load when needed
    'models/admin/cards',
    'views/admin/cards/cards_view',
    'models/admin/card',
    'models/admin/user',
    'views/admin/cards/card_create_view',
    'models/admin/accounts',
    'models/currencies',
    'models/card_types'
], function($, _, Chaplin, Controller, CardsCollection, CardsView, CardModel, UserModel, CardCreateView, AccountsCollection, CurrenciesCollection, CardTypes) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardsController = Controller.extend({

        title: 'Cards',

        initialize: function(params) {
            var controller = this;

            _.bindAll(controller, 'triggerSaveCard', 'triggerLoadUserAccounts', 'triggerLoadCurrencies', 'triggerLoadCardTypes');

            CardsController.__super__.initialize.apply(controller, arguments);

            controller.subscribeEvent('!saveCard', controller.triggerSaveCard);
            controller.subscribeEvent('!loadUserAccounts', controller.triggerLoadUserAccounts);
            controller.subscribeEvent('!loadCurrencies', controller.triggerLoadCurrencies);
            controller.subscribeEvent('!loadCardTypes', controller.triggerLoadCardTypes);
        },

        index: function(params) {
            var controller = this;

            controller.collection = new CardsCollection();

            controller.view = new CardsView({
                collection: controller.collection
            }, {
                userId: params ? params.userId : void 0
            });
        },

//        show: function(params) {    //TODO: verify if userId is not a hash with userId inside
//            var controller = this;
//
//            controller.model = new CardModel({
//                id: params.id
//            });
//
//            controller.model.fetch({
//                success: function() {
//                    controller.view = new CardView({
//                        model: controller.model
//                    });
//                }
//            });
//        },

        create: function(params) {
            var controller = this,
                userModel = new UserModel({
                    id: params.userId
                });

            userModel.fetch({
                success: function() {
                    controller.model = new CardModel({
                        holder: userModel
                    });
                    controller.view = new CardCreateView({
                        model: controller.model
                    });
                }
            });
        },

        edit: function(params) {
            var controller = this;

            controller.model = new CardModel({
                id: params.id
            });

            controller.model.fetch({
                success: function() {
                    controller.view = new CardEditView({
                        model: controller.model
                    });
                }
            });
        },

        triggerSaveCard: function(options) {
            var controller = this;

            controller.model.save({
                attributesToSave: options.attributesToSave,
                success: function() {
                    mediator.publish('!router:route', 'user/' + controller.model.get('holder').id);
                },
                error: function() {
                    // TODO: implementation needed
                }
            });
        },

        triggerLoadUserAccounts: function() {
            var controller = this,
                accounts = new AccountsCollection([], {
                    user: controller.model.get('holder')
                });

            accounts.fetch({
                success: function() {
                    mediator.publish('userAccountsLoaded', accounts)
                }
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
