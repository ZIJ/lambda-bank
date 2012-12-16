define([
    'chaplin',
    'controllers/base/controller',
    'views/admin/header_view',
    'views/middle_view',
    'models/base/model'
], function(Chaplin, Controller, HeaderView, MiddleView, Model) {
    'use strict';

    var mediator = Chaplin.mediator;

    var HeaderController = Controller.extend({

        initialize: function(params) {
            var controller = this;

            controller.model = new Model({ userName: mediator.user });  //  TODO: mediator.user.name

            controller.view = new HeaderView({
                model: controller.model
            });

            controller.middleView = new MiddleView();
        }

    });

    return HeaderController;
});
