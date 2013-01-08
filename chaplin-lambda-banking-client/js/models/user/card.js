define([
    'chaplin',
    'moment',
    'models/base/model',
    'models/user/accounts'
], function(Chaplin, moment, Model, AccountsCollection) {
    'use strict';

    var mediator = Chaplin.mediator;

    var Card = Model.extend({

        initialize: function(attributes, options) {
            var model = this;

//            _.bindAll(model, 'fetchSuccessfulHandler');

            Card.__super__.initialize.apply(model, arguments);

        },

        parse: function(response) {
            var attributesHash = {
                id: response['ID'],
                number: response['Number'],
                type: response['Type'],
                expirationDate: response['ExpirationDate'] ? moment(response['ExpirationDate']).format('YYYY-MM-DD') : void 0,
                state: response['CardState'],
                freezeDate: response['FreezeDate'] ? moment(response['FreezeDate']).format('YYYY-MM-DD') : void 0,
                accounts: (function() {
                    if (response['Accounts']) {
                        var retVal = new AccountsCollection();
                        retVal.fetchHandler(response['Accounts']);
                        return retVal;
                    } else {
                        return void 0;
                    }
                })()
            };

            _(attributesHash).each(function(attrValue, attrName) {
                if (typeof attrValue === "undefined") {
                    delete attributesHash[attrName];
                }
            });

            return attributesHash;
        }

//        fetch: function(options) {
//            var model = this;
//
//            mediator.user.get('provider').apiRequest({
//                url: 'admin/cards/get',
//                data: {
//                    cardId: model.id
//                },
//                success: function(response) {
//                    model.fetchSuccessfulHandler(response);
//                    options.success.call(this, response);
//                },
//                error: function(jqXHR) {
//                    // TODO: implementation needed
//                }
//            });
//        },

//        fetchSuccessfulHandler: function(response) {
//            var model = this;
//
//            model.set(model.parse(response));
//        }

    });

    return Card;
});