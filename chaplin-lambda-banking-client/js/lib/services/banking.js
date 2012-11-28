define([
    'underscore',
    'chaplin',
    'lib/utils',
    'lib/services/service_provider'
], function(_, Chaplin, utils, ServiceProvider) {
    'use strict';

    var Banking = (function (_super) {

        utils.extends(Banking, _super);

        function Banking() {
            _.bindAll(this, []);


        }

        _(Banking.prototype).extend({

        });

    })(ServiceProvider);
});
