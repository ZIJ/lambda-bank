define([
    'underscore',
    'chaplin',
    'models/base/collection',
    'models/admin/card'
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

//            collection.fetch = _.bind(collection.fetch, collection, { userId: options.userId });

            collection.userId = options.userId;

            Cards.__super__.initialize.apply(collection, arguments);

            collection.fetch();
        },

        fetch: function(options) {
            options || (options = []);

            var collection = this;

            mediator.user.get('provider').apiRequest(
                _.extend(
                    {
                        url: 'admin/cards/get',
                        success: function(response) {
                            collection.fetchHandler.call(this, response);
                            if (options.success && _.isFunction(options.success)) {
                                options.success.call(this, response);
                            }
                        }
                    }, (collection.userId ? {
                        data: {
                            userId: collection.userId
                        }
                    } : null)
                )
            );
        },

        fetchHandler: function(response) {
            var collection = this;

            collection.reset(response, { parse: true });
        }

    });

    return Cards;
});