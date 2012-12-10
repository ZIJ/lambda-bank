define([
    'controllers/base/controller',
    // TODO: load when needed
    'models/admin/users',
    'views/admin/users_view',
    'models/admin/user',
    'views/admin/user_view'
], function(Controller, UsersCollection, UsersView, UserModel, UserView) {
    'use strict';

    var UsersController = Controller.extend({

        initialize: function(params) {
            var controller = this;

            UsersController.__super__.initialize.apply(controller, arguments);
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


        },

        edit: function() {

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
