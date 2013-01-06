define([
    'underscore',
    'chaplin',
    'controllers/base/controller',
    // TODO: load when needed
    'models/admin/users',
    'views/admin/users/users_view',
    'models/admin/user',
    'views/admin/users/user_view',
    'views/admin/users/user_edit_view'
], function(_, Chaplin, Controller, UsersCollection, UsersView, UserModel, UserView, UserEditView) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UsersController = Controller.extend({

        title: 'Users',

        initialize: function(params) {
            var controller = this;

            _.bindAll(controller, 'triggerSaveUser', 'triggerFreezeCards', 'triggerUnfreezeCards');

            UsersController.__super__.initialize.apply(controller, arguments);

            controller.subscribeEvent('!saveUser', controller.triggerSaveUser);

            // TODO: duplicated from cards_controller
            controller.subscribeEvent('!freezeCards', controller.triggerFreezeCards);
            controller.subscribeEvent('!unfreezeCards', controller.triggerUnfreezeCards);
        },

        index: function() {
            var controller = this;

            controller.collection = new UsersCollection();

            controller.view = new UsersView({
                collection: controller.collection
            });
        },

        show: function(params) {    //TODO: verify if userId is not a hash with userId inside
            var controller = this;

            controller.model = new UserModel({
                id: params.id
            });

            controller.model.fetch({
                success: function() {
                    controller.view = new UserView({
                        model: controller.model
                    });
                }
            });
        },

        create: function() {
            var controller = this;

            controller.model = new UserModel();

            controller.view = new UserEditView({
                model: controller.model
            });
        },

        edit: function(params) {
            var controller = this;

            controller.model = new UserModel({
                id: params.id
            });

            controller.model.fetch({
                success: function() {
                    controller.view = new UserEditView({
                        model: controller.model
                    });
                }
            });
        },

        triggerSaveUser: function(options) {
            var controller = this;

            controller.model.save({
                attributesToSave: options.attributesToSave,
                success: function() {
                    mediator.publish('!router:route', 'users/' + controller.model.id);
                },
                error: function() {
                    // TODO: implementation needed
                }
            });
        },


        // TODO: duplicated from cards_controller, hard-coded to use controller.view.cards collections, rework it!
        triggerFreezeCards: function(cardsIdsToFreeze) {
            var controller = this;

            if (cardsIdsToFreeze.length === 0) {
                mediator.publish('!alert', {
                    title: 'Warning!',
                    text: 'All selected cards are already frozen',
                    action: 'Ok',
                    actionCallback: function() {},
                    cancelCallback: function() {}
                });
                return;
            }

            mediator.user.get('provider').apiRequest({
                url: 'admin/cards/freeze',
                data: {
                    cardsIds: cardsIdsToFreeze
                },
                success: function(response) {
                    if (controller.view.cards) {
                        controller.view.cards.fetch();
                    }
                },
                error: function(jqXHR) {
                    // TODO: implementation needed
                }
            });
        },

        triggerUnfreezeCards: function(cardsIdsToUnfreeze) {
            var controller = this;

            if (cardsIdsToUnfreeze.length === 0) {
                mediator.publish('!alert', {
                    title: 'Warning!',
                    text: 'No frozen cards selected',
                    action: 'Ok',
                    actionCallback: function() {},
                    cancelCallback: function() {}
                });
                return;
            }

            mediator.user.get('provider').apiRequest({
                url: 'admin/cards/unfreeze',
                data: {
                    cardsIds: cardsIdsToUnfreeze
                },
                success: function(response) {
                    if (controller.view.cards) {
                        controller.view.cards.fetch();
                    }
                },
                error: function(jqXHR) {
                    // TODO: implementation needed
                }
            });
        }

//        disposeChildren: function() {
//            var controller = this;
//
//            if (controller.model) {
//                controller.model.dispose();
//                delete controller.model;
//            }
//            if (controller.collection) {
//                controller.collection.dispose();
//                delete controller.collection;
//            }
//            if (controller.view) {
//                controller.view.dispose();
//                delete controller.view;
//            }
//        }


    });

    return UsersController;
});
