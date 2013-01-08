define([
    'controllers/base/controller',
    'views/admin/navigation_view'
], function(Controller, NavigationView) {
    'use strict';

    var NavigationController = Controller.extend({

        initialize: function(params) {
            this.view = new NavigationView();//alert(window.operation_providers.operators[0].summ_min);
        }

    });

    return NavigationController;
});
