define([
    'underscore',
    'chaplin/lib/event_broker',
    'lib/utils'
], function(_, EventBroker, utils) {
    'use strict';

    var ServiceProvider = (function() {

        function ServiceProvider() {
            var serviceProvider = this;

            _(serviceProvider).extend($.Deferred());

            utils.deferMethods({
                deferred: serviceProvider,
                methods: ['triggerLogin', 'getLoginStatus'],
                onDeferral: serviceProvider.load
            });
        }

        _(ServiceProvider.prototype).extend(EventBroker, {
            loading: false,
            disposed: false,
            dispose: function() {
                var serviceProvider = this;

                if (serviceProvider.disposed) {
                    return;
                }
                serviceProvider.unsubscribeAllEvents();
                serviceProvider.disposed = true;
                if (typeof Object.freeze === "function") {
                    Object.freeze(serviceProvider)
                }
            }
        });

        return ServiceProvider;

    })();

    return ServiceProvider;
});
