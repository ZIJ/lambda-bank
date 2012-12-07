define([
    'chaplin',
    'models/base/collection'
], function(Chaplin, Collection) {
    'use strict';

    var mediator = Chaplin.Mediator;

    var User = Collection.extend({

        defaults: {
            message: 'Hello World!'
        },

        initialize: function(attributes, options) {
            var collection = this;

            Collection.apply(collection, arguments);
            
            collection.fetch();
        },

        fetch: function() {
            var collection = this;

            mediator.user.get("banking");

        }

    });

    return User;
});
