define([
    'underscore',
    'chaplin/lib/event_broker',
    'lib/utils'
], function(_, EventBroker, utils) {
    'use strict';

    var ServiceProvider = (function() {

        function ServiceProvider() {
            _(this).extend($.Deferred());
            utils.deferMethods({
                deferred: this,
                methods: ['triggerLogin', 'getLoginStatus'],
                onDeferral: this.load
            });
        }

        _(ServiceProvider.prototype).extend(EventBroker, {
            loading: false,
            disposed: false,
            dispose: function() {
                if (this.disposed) {
                    return;
                }
                this.unsubscribeAllEvents();
                this.disposed = true;
                return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
            }
        });

        return ServiceProvider;

    })();

    return ServiceProvider;
});
