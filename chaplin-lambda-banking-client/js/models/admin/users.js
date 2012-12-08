define([
    'chaplin',
    'models/base/collection',
    'models/admin/user'
], function(Chaplin, Collection, User) {
    'use strict';

    var mediator = Chaplin.mediator;

    var Users = Collection.extend({

        model: User,

        idAttribute: 'id',

        initialize: function(attributes, options) {
            var collection = this;

            _.bindAll(collection, 'fetchHandler');

            Users.__super__.initialize.apply(collection, arguments);
            
            collection.fetch();
        },

        fetch: function() {
            var collection = this;

            mediator.user.get("provider").apiRequest({
                url: 'admin/users/get',
                data: {
                    joinCards: false
                },
                success: collection.fetchHandler
            });

        },

        fetchHandler: function(response) {
            var collection = this;

            collection.reset(response, { parse: true });
        }

    });

    return Users;
});
