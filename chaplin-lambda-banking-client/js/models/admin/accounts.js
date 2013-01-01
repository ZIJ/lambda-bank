define([
    'underscore',
    'chaplin',
    'models/base/collection',
    'models/admin/account'
], function(_, Chaplin, Collection, Account) {
    'use strict';

    var mediator = Chaplin.mediator;

    var Accounts = Collection.extend({

        model: Account,

        idAttribute: 'id',

//        user: null, // NOTE: undefined by default

        initialize: function(attributes, options) {
            options || (options = {});

            var collection = this;

            _.bindAll(collection, 'fetchHandler');

            collection.user = options.user;

            Accounts.__super__.initialize.apply(collection, arguments);
        },

        fetch: function() {
            var collection = this;

            mediator.user.get('provider').apiRequest(
                _.extend(
                    {
                        url: 'admin/accounts/get',
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

    return Accounts;
});