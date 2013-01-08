define([
    'chaplin',
    'models/base/model'
], function(Chaplin, Model) {
    'use strict';

    var mediator = Chaplin.mediator;

    var Account = Model.extend({

        initialize: function(attributes, options) {
            var model = this;

            _.bindAll(model, 'fetchSuccessfulHandler');

            Account.__super__.initialize.apply(model, arguments);

        },

        parse: function(response) {
            var attributesHash = {
                id: response['ID'],
                number: response['AccountNumber'],
                currency: response['Currency'],
                amount: parseFloat(response['Amount']).toFixed(2),   // TODO: .replace(',', '.') if response['Amount'] is of STRING type
                description: response['Description']
//                accounts: response['Accounts']
                // TODO: add fetchable attributes parsers here
            };

            _(attributesHash).each(function(attrValue, attrName) {
                if (typeof attrValue === "undefined") {
                    delete attributesHash[attrName];
                }
            });

            return attributesHash;
        },

        fetch: function(options) {
            var model = this;

            mediator.user.get('provider').apiRequest({
                url: 'admin/accounts/get',
                data: {
                    accountId: model.id
                },
                success: function(response) {
                    model.fetchSuccessfulHandler(response);
                    options.success.call(this, response);
                },
                error: function(jqXHR) {
                    // TODO: implementation needed
                }
            });
        },

        fetchSuccessfulHandler: function(response) {
            var model = this;

            model.set(model.parse(response));
        }

    });

    return Account;
});