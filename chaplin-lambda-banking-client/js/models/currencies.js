define([
    'underscore',
    'chaplin',
    'models/base/collection',
    'models/currency'
], function(_, Chaplin, Collection, Currency) {
    'use strict';

    var mediator = Chaplin.mediator;

    var Currencies = Collection.extend({

        model: Currency,

        idAttribute: 'id',

        initialize: function(attributes, options) {
            var collection = this;

            _.bindAll(collection, 'fetchHandler');

            Currencies.__super__.initialize.apply(collection, arguments);
        },

        fetch: function(options) {
            options || (options = []);

            var collection = this;

            mediator.user.get('provider').apiRequest({
                url: 'currencies',
                success: function(response) {
                    collection.fetchHandler.call(this, response);
                    if (options.success && _.isFunction(options.success)) {
                        options.success.call(this, response);
                    }
                },
                error: function(jqXHR) {
                    // TODO: implementation needed
                }
            });
        },

        fetchHandler: function(response) {
            var collection = this;

            collection.reset(response, { parse: true });
        }

    });

    return Currencies;
});
