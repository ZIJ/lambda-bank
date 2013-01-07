define([
    'jquery',
    'underscore',
    'chaplin',
    'controllers/base/controller',
    // TODO: load when needed
    'models/admin/accounts',
    'models/admin/account',
    'views/admin/accounts/accounts_view',
    'views/admin/accounts/account_view',
    'models/admin/user'
], function($, _, Chaplin, Controller, AccountsCollection, AccountModel, AccountsView, AccountView, UserModel) {
    'use strict';

    var mediator = Chaplin.mediator;

    var AccountsController = Controller.extend({

        title: 'Accounts',

        initialize: function(params) {
            var controller = this;

            _.bindAll(controller, 'triggerReplenish', 'triggerWithdraw');

            AccountsController.__super__.initialize.apply(controller, arguments);

            controller.subscribeEvent('!replenish', controller.triggerReplenish);
            controller.subscribeEvent('!withdraw', controller.triggerWithdraw);
        },

        index: function(params) {
            var controller = this;

            controller.collection = new AccountsCollection([], {
                userId: params.userId ? params.userId : void 0
            });
            controller.collection.fetch();

            controller.view = new AccountsView({
                collection: controller.collection
            });
        },

        show: function(params) {    //TODO: verify if userId is not a hash with userId inside
            var controller = this;

            controller.model = new AccountModel({
                id: params.id
            });

            controller.model.fetch({
                success: function() {
                    controller.view = new AccountView({
                        model: controller.model
                    });
                }
            });
        },

        triggerReplenish: function(amount) {
            var controller = this;

            mediator.user.get('provider').apiRequest({
                url: 'admin/accounts/replenish',
                data: {
                    id: controller.model.id,
                    amount: amount
                },
                success: function(response) {
                    controller.model.fetch({
                        success: function() {
                            controller.view.render();
                        }
                    });
                },
                error: function(jqXHR) {
                    // TODO: implementation needed
                }
            });
        },

        triggerWithdraw: function(amount) {
            var controller = this;

            mediator.user.get('provider').apiRequest({
                url: 'admin/accounts/withdraw',
                data: {
                    id: controller.model.id,
                    amount: amount
                },
                success: function(response) {
                    controller.model.fetch({
                        success: function() {
                            controller.view.render();
                        }
                    });
                },
                error: function(jqXHR) {
                    // TODO: implementation needed
                }
            });
        }

//        triggerSaveCard: function(options) {
//            var controller = this;
//
//            controller.model.save({
//                attributesToSave: options.attributesToSave,
//                success: function() {
//                    mediator.publish('!router:route', 'users/' + controller.model.get('holder').id);
//                },
//                error: function() {
//                    // TODO: implementation needed
//                }
//            });
//        }

    });

    return AccountsController;
});
