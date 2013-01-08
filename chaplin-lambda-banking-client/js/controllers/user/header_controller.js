define([
    'chaplin',
    'underscore',
    'controllers/base/controller',
    'views/user/header_view',
    'models/user/breadcrumb',
    'views/user/breadcrumb_view',
    'views/middle_view',
    'models/base/model'
], function(Chaplin, _, Controller, HeaderView, BreadcrumbModel, BreadcrumbView, MiddleView, Model) {
    'use strict';

    var mediator = Chaplin.mediator;

    var HeaderController = Controller.extend({

        initialize: function(params) {
            var controller = this;

            _.bindAll(controller, 'matchRouteHandler');

            controller.model = new Model({ userName: mediator.user.get('firstName') });

            controller.view = new HeaderView({
                model: controller.model
            });

            // TODO: shouldn't be here
            var nestedView = new BreadcrumbView({
                model: new BreadcrumbModel()
            });
            controller.view.subview('breadcrumb', nestedView);

            // TODO: redesign it
            controller.middleView = new MiddleView();

            controller.subscribeEvent('matchRoute', controller.matchRouteHandler);
        },

        matchRouteHandler: function(route, params) {
            var controller = this;

            controller.view.subview('breadcrumb').model.setByRoute(route, params);
        }

    });

    return HeaderController;
});
