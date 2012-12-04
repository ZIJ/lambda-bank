define([
    'underscore',
    'chaplin',
    'lib/utils'
], function(_, Chaplin, utils) {
    'use strict';

    var mediator = Chaplin.mediator;

    var ApplicationController = (function(_super) {

        utils.extends(ApplicationController, _super);

        function ApplicationController() {
            var controller = this;

//            _.bindAll(controller, "logout");

            ApplicationController.__super__.constructor.apply(controller, arguments);
        }

        _.extend(ApplicationController, {

        });

        _.extend(ApplicationController.prototype, {



            initialize: function() {
                var controller = this;

                // Handle login
                controller.subscribeEvent('logout', controller.logout);

                // Handler events which trigger an action
                controller.subscribeEvent('!showLogin', controller.showLoginView);


            }


        });

        return ApplicationController;

    })(Chaplin.Controller);

    return ApplicationController;
});
