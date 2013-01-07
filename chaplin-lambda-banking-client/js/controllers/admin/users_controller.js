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

        // TODO: for preventing multiple fast clicks
        canSaveUser: true,
        canGenerateCredentials: true,
        canFreezeCards: true,

        initialize: function(params) {
            var controller = this;

            _.bindAll(controller, 'triggerSaveUser', 'triggerGenerateCredentials', 'triggerFreezeCards', 'triggerUnfreezeCards');

            UsersController.__super__.initialize.apply(controller, arguments);

            controller.subscribeEvent('!saveUser', controller.triggerSaveUser);

            controller.subscribeEvent('!generateCredentials', controller.triggerGenerateCredentials);

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

            if (controller.canSaveUser === false) return;

            controller.canSaveUser = false;

            controller.model.save({
                attributesToSave: options.attributesToSave,
                success: function() {
                    mediator.publish('!router:route', 'users/' + controller.model.id);
                    controller.canSaveUser = true;
                },
                error: function() {
                    controller.canSaveUser = true;
                    // TODO: implementation needed
                }
            });
        },

        triggerGenerateCredentials: function() {
            var controller = this;

            if (controller.canGenerateCredentials === false) return;

            controller.canGenerateCredentials = false;

            mediator.user.get('provider').apiRequest({
                url: 'admin/users/addinternetbankingrole',
                data: {
                    id: controller.model.id
                },
                success: function(response) {
                    mediator.publish('!alert', {
                        title: 'New credentials!',
                        type: 'info',
                        text: 'login:' + response['Login'] +'\npassword:' + response['Password'],
                        action: 'Ok',
                        actionCallback: function() {},
                        cancelCallback: function() {}
                    });
                    controller.canGenerateCredentials = true;
                },
                error: function(jqXHR) {
                    controller.canGenerateCredentials = true;
                    // TODO: implementation needed
                }
            });
        },

        // TODO: duplicated from cards_controller, hard-coded to use controller.view.cards collections, rework it!
        triggerFreezeCards: function(cardsIdsToFreeze) {
            var controller = this;

            if (controller.canFreezeCards === false) return;

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

            controller.canFreezeCards = false;

            mediator.user.get('provider').apiRequest({
                url: 'admin/cards/freeze',
                data: {
                    cardsIds: cardsIdsToFreeze
                },
                success: function(response) {
                    if (controller.view.cards) {
                        controller.view.cards.fetch({
                            success: function() {
                                controller.canFreezeCards = true;
                            }
                        });
                    }
                },
                error: function(jqXHR) {
                    controller.canFreezeCards = true;
                    // TODO: implementation needed
                }
            });
        },

        triggerUnfreezeCards: function(cardsIdsToUnfreeze) {
            var controller = this;

            if (controller.canFreezeCards === false) return;

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

            controller.canFreezeCards = false;

            mediator.user.get('provider').apiRequest({
                url: 'admin/cards/unfreeze',
                data: {
                    cardsIds: cardsIdsToUnfreeze
                },
                success: function(response) {
                    if (controller.view.cards) {
                        controller.view.cards.fetch({
                            success: function() {
                                controller.canFreezeCards = true;
                            }
                        });
                    }
                },
                error: function(jqXHR) {
                    controller.canFreezeCards = true;
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
