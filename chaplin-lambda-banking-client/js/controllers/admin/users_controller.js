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

        initialize: function(params) {
            var controller = this;

            _.bindAll(controller, 'triggerSaveUser');

            UsersController.__super__.initialize.apply(controller, arguments);

            controller.subscribeEvent('!saveUser', controller.triggerSaveUser);
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
