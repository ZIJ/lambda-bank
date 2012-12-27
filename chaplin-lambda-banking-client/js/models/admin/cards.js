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

        initialize: function(attributes, options) {
            options || (options = {});

            var collection = this;

            _.bindAll(collection, 'fetchHandler');

            collection.user = options.user;

            Cards.__super__.initialize.apply(collection, arguments);

            collection.fetch();
        },

        fetch: function() {
            var collection = this;

            mediator.user.get('provider').apiRequest(
                _.extend(
                    {
                        url: 'admin/cards/get',
                        success: collection.fetchHandler
                    }, (collection.user ? {
                        data: {
                            userId: collection.user.id
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