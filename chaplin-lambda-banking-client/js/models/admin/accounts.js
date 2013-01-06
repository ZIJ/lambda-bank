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

            collection.fetch = _.bind(collection.fetch, collection, { userId: options.userId });

            Accounts.__super__.initialize.apply(collection, arguments);
        },

        fetch: function(options) {
            options || (options = []);

            var collection = this;

            mediator.user.get('provider').apiRequest(
                _.extend(
                    {
                        url: 'admin/accounts/get',
                        success: function(response) {
                            collection.fetchHandler.call(this, response);
                            if (options.success && _.isFunction(options.success)) {
                                options.success.call(this, response);
                            }
                        }
                    }, (options.userId ? {
                        data: {
                            userId: options.userId
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