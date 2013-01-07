define([
    'chaplin',
    'moment',
    'models/base/model',
    'models/admin/user',
    'models/admin/accounts'
], function(Chaplin, moment, Model, UserModel, AccountsCollection) {
    'use strict';

    var mediator = Chaplin.mediator;

    var Card = Model.extend({

        initialize: function(attributes, options) {
            var model = this;

            _.bindAll(model, 'fetchSuccessfulHandler', 'saveSuccessfulHandler'
                , 'saveErrorHandler', 'destroySuccessfulHandler');

            Card.__super__.initialize.apply(model, arguments);

        },

        parse: function(response) {
            var attributesHash = {
                id: response['ID'],
                number: response['Number'],
                type: response['Type'],
                holder: response['User'] ? new UserModel(UserModel.prototype.parse(response['User'])) : void 0,
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
        },

        fetch: function(options) {
            var model = this;

            mediator.user.get('provider').apiRequest({
                url: 'admin/cards/get',
                data: {
                    cardId: model.id
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

        save: function(options) {
            var model = this,
                attributesToSave = {
                    userId: model.get('holder').id,
                    typeId: options.attributesToSave.type,
                    expirationTime: '/Date(' + options.attributesToSave.expirationDate.valueOf() + ')/'
                };

            if (options.attributesToSave.currencies) {
                attributesToSave.currency = options.attributesToSave.currencies;
            } else if (options.attributesToSave.accountID2Attach) {
                attributesToSave.accountID2Attach = options.attributesToSave.accountID2Attach;
            } else {
                // TODO: throw error
            }

            mediator.user.get('provider').apiRequest({
                url: 'admin/cards/create',
                data: attributesToSave,
                success: function(response) {
                    model.saveSuccessfulHandler.call(this, response);
                    options.success.call(this, response);
                },
                error: function(jqXHR) {
                    model.saveErrorHandler.call(this, jqXHR);
                    options.error.call(this, jqXHR);
                }
            });
        },

//        destroy: function(options) {
//            var model = this;
//
//            mediator.user.get('provider').apiRequest({
//                url: 'admin/cards/delete',  // TODO: verify this
//                data: {
//                    cardId: model.id
//                },
//                success: function() {
//                    model.destroySuccessfulHandler();
//                    options.success.call(this);
//                },
//                error: function(jqXHR) {
//                    // TODO: implementation needed
//                }
//            });
//        },

        fetchSuccessfulHandler: function(response) {
            var model = this;

            model.set(model.parse(response));
        },

        saveSuccessfulHandler: function(response) {
            var model = this;

            // For setting id, got from server (and all other auto-generated attributes)
            model.set(model.parse(response));
        },

        saveErrorHandler: function() {

        },

        destroySuccessfulHandler: function() {

        }

    });

    return Card;
});