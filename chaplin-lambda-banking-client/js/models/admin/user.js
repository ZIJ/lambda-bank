define([
    'chaplin',
    'models/base/model'
], function(Chaplin, Model) {
    'use strict';

    var mediator = Chaplin.mediator;

    var User = Model.extend({

        initialize: function(attributes, options) {
            var model = this;

            _.bindAll(model, 'fetchHandler');

            User.__super__.initialize.apply(model, arguments);

        },

        parse: function(response) {
            return {
                id: response['ID'],
                firstName: response['FirstName'],
                lastName: response['LastName'],
                passportNumber: response['PassportNumber'],
                address: response['Address']
//                ,cards: response['Cards']
                // TODO: add fetchable attributes parsers here
            }
        },

        fetch: function() {
            var model = this;

            mediator.user.get('provider').apiRequest({
                url: '',
                data: {

                },
                success: model.fetchHandler
            });
        },

        fetchHandler: function(response) {
            var model = this;

            model.set(model.parse(response));
        }

    });

    return User;
});

