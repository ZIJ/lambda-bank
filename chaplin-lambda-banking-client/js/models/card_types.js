define([
    'underscore',
    'chaplin',
    'models/base/collection',
    'models/card_type'
], function(_, Chaplin, Collection, CardType) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardTypes = Collection.extend({

        model: CardType,

        idAttribute: 'id',

        initialize: function(attributes, options) {
            var collection = this;

            _.bindAll(collection, 'fetchHandler');

            CardTypes.__super__.initialize.apply(collection, arguments);
        },

        fetch: function(options) {
            options || (options = []);

            var collection = this;

            mediator.user.get('provider').apiRequest({
                url: 'cardtypes',
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

    return CardTypes;
});
