define([
    'chaplin',
    'models/base/model'
], function(Chaplin, Model) {
    'use strict';

    var mediator = Chaplin.mediator;

    var User = Model.extend({

        initialize: function(attributes, options) {
            var model = this;

            _.bindAll(model, 'fetchSuccessfulHandler', 'saveSuccessfulHandler'
                , 'saveErrorHandler', 'destroySuccessfulHandler');

            User.__super__.initialize.apply(model, arguments);

        },

        parse: function(response) {
            var attributesHash = {
                id: response['ID'],
                firstName: response['FirstName'],
                lastName: response['LastName'],
                passportNumber: response['PassportNumber'],
                address: response['Address']
//                ,cards: response['Cards']
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
                url: 'admin/users/get',
                data: {
                    userId: model.id
                },
                success: function(response) {
                    model.fetchSuccessfulHandler(response);
                    options.success.apply(this, response);
                },
                error: function(jqXHR) {
                    // TODO: implementation needed
                }
            });
        },

        save: function(options) {
            var model = this,
                attributesToSave = {
                    FirstName: model.get('firstName'),
                    LastName: model.get('lastName'),
                    PassportNumber: model.get('passportNumber'),
                    Address: model.get('address')
                };

            if (model.id && model.id !== 0) {
                mediator.user.get('provider').apiRequest({
                    url: 'admin/users/update',
                    data: _.extend({ ID: model.id }, attributesToSave),
                    success: model.saveSuccessfulHandler,
                    error: model.saveErrorHandler
                });
            } else {
                mediator.user.get('provider').apiRequest({
                    url: 'admin/users/create',
                    data: attributesToSave,
                    success: model.saveSuccessfulHandler,
                    error: model.saveErrorHandler
                });
            }
        },

        destroy: function(options) {
            var model = this;

            mediator.user.get('provider').apiRequest({
                url: 'admin/users/delete',  // TODO: verify this
                data: {
                    userId: model.id
                },
                success: function() {
                    model.destroySuccessfulHandler();
                    options.success.apply(this);
                },
                error: function(jqXHR) {
                    // TODO: implementation needed
                }
            });
        },

        fetchSuccessfulHandler: function(response) {
            var model = this;

            model.set(model.parse(response));
        },

        saveSuccessfulHandler: function(response) {

        },

        saveErrorHandler: function() {

        },

        destroySuccessfulHandler: function() {

        }

    });

    return User;
});

