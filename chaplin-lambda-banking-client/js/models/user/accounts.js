define([
    'underscore',
    'chaplin',
    'models/base/collection',
    'models/user/account'
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

            Accounts.__super__.initialize.apply(collection, arguments);
        },

//        fetch: function(options) {
//            options || (options = []);
//
//            var collection = this;
//
//            mediator.user.get('provider').apiRequest(
//                _.extend(
//                    {
//                        url: 'admin/accounts/get',
//                        success: function(response) {
//                            collection.fetchHandler.call(this, response);
//                            if (options.success && _.isFunction(options.success)) {
//                                options.success.call(this, response);
//                            }
//                        }
//                    }, (collection.userId ? {
//                        data: {
//                            userId: collection.userId
//                        }
//                    } : null)
//                )
//            );
//        },
//
        fetchHandler: function(response) {
            var collection = this;

            collection.reset(response, { parse: true });
        }

    });

    return Accounts;
});