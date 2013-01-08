define([
    'controllers/base/controller',
    'views/user/navigation_view'
], function(Controller, NavigationView) {
    'use strict';

    var NavigationController = Controller.extend({

        initialize: function(params) {
            this.view = new NavigationView();
        }

    });

    return NavigationController;
});
