define([
    'underscore',
    'chaplin',
    'models/base/collection',
    'models/user/card'
], function(_, Chaplin, Collection, Card) {
    'use strict';

    var mediator = Chaplin.mediator;

    var Cards = Collection.extend({

        model: Card,

        idAttribute: 'id',

//        user: null, // NOTE: undefined by default

        initialize: function(models, options) {
            options || (options = {});

            var collection = this;

            _.bindAll(collection, 'fetchHandler');

            Cards.__super__.initialize.apply(collection, arguments);

            collection.fetch();
        },

        fetch: function(options) {
            options || (options = []);

            var collection = this;

            mediator.user.get('provider').apiRequest({
                url: 'user/cards/list',
                success: function(response) {
                    collection.fetchHandler.call(this, response);
                    if (options.success && _.isFunction(options.success)) {
                        options.success.call(this, response);
                    }
                }
            });
        },

        fetchHandler: function(response) {
            var collection = this;

            collection.reset(response, { parse: true });
        }

    });

    return Cards;
});