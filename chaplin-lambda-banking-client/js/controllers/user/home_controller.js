define([
    'chaplin',
    'controllers/base/controller',
    'views/user/home_view',
    'models/base/model'
], function(Chaplin, Controller, HomeView, Model) {
    'use strict';

    var mediator = Chaplin.mediator;

    var HomeController = Controller.extend({

        initialize: function(params) {



        },

        index: function() {
            var controller = this;

            controller.model = new Model({ userName: mediator.user.get('firstName') });

            controller.view = new HomeView({
                model: controller.model
            });
        }

    });

    return HomeController;
});
