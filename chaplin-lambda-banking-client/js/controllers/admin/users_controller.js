define([
    'controllers/base/controller',
    'models/admin/users',
    'views/admin/users_view'
], function(Controller, UsersCollection, UsersView) {
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

        show: function() {

        },

        edit: function() {

        }

    });

    return UsersController;
});
