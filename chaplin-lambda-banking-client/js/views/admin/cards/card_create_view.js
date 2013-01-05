define([
    'jquery',
    'underscore',
    'moment',
    'chaplin',
    'views/base/view',
    'text!templates/admin/cards/card_create.hbs',
    'pikaday'
], function($, _, moment, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardCreateView = View.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        autoRender: true,

        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onSaveClick', 'onCancelClick', 'userAccountsLoadedHandler', 'currenciesLoadedHandler', 'cardTypesLoadedHandler');

            CardCreateView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '.btn.save', view.onSaveClick);
            view.delegate('click', '.btn.cancel', view.onCancelClick);

            view.subscribeEvent('userAccountsLoaded', view.userAccountsLoadedHandler);
            view.subscribeEvent('currenciesLoaded', view.currenciesLoadedHandler);
            view.subscribeEvent('cardTypesLoaded', view.cardTypesLoadedHandler);

            view.userAccountsDef = new $.Deferred();
            view.currenciesDef = new $.Deferred();
            view.cardTypesDef = new $.Deferred();

            mediator.publish('!loadCardTypes');

            // TODO: should be loaded only when needed
            mediator.publish('!loadCurrencies');
            mediator.publish('!loadUserAccounts');
        },

        afterRender: function() {
            var view = this;

            CardCreateView.__super__.afterRender.apply(view);

            view.$('.datepicker').pikaday({
                format: 'DD.MM.YYYY',
                defaultDate: moment().add('years', 3).toDate(), // TODO: hard-coded to current + 3 years
                setDefaultDate: true
            });

            view.userAccountsDef.done(function(accounts) {
                view.renderUserAccounts(accounts);
            });
            view.currenciesDef.done(function(currencies) {
                view.renderCurrencies(currencies);
            });
            view.cardTypesDef.done(function(cardTypes) {
                view.renderCardTypes(cardTypes);
            });
        },


        userAccountsLoadedHandler: function(accounts) {
            var view = this;

            view.userAccountsDef.resolve(accounts);
        },
        currenciesLoadedHandler: function(currencies) {
            var view = this;

            view.currenciesDef.resolve(currencies);
        },
        cardTypesLoadedHandler: function(cardTypes) {
            var view = this;

            view.cardTypesDef.resolve(cardTypes);
        },


        onSaveClick: function() {
            var view = this,
                options = {
                    attributesToSave: {
                        expirationDate: view.$('.firstName').val(),
                        type: view.$('.card-new-types').children('option:selected').val(),
                        passportNumber: view.$('.passportNumber').val(),
                        address: view.$('.address').val()
                    }
                };

//            mediator.publish('!saveCard', options);
        },

        onCancelClick: function() {
            var view = this;

            mediator.publish('!router:route', 'users/' + view.model.get('holder').id);
        },


        // TODO: All TEMPORARY render* methods evidence that we need subviews for each of these components

        renderUserAccounts: function(accounts) {
            var view = this;

            view.$('.card-new-accounts').html(
                (function() {
                    var $options = $();

                    accounts.each(function(account) {
                        $options = $options.add(
                            $('<option></option>', {
                                'value': account.id
                            }).text(account.get('number'))
                        );
                    });

                    return $options;
                })()
            );
        },
        renderCurrencies: function(currencies) {
            var view = this;

            view.$('.card-new-currencies').html(
                (function() {
                    var $options = $();

                    currencies.each(function(currency) {
                        $options = $options.add(
                            $('<option></option>', {
                                'value': currency.id
                            }).text(currency.get('name'))
                        );
                    });

                    return $options;
                })()
            );
        },
        renderCardTypes: function(cardTypes) {
            var view = this;

            view.$('.card-new-types').html(
                (function() {
                    var $options = $();

                    cardTypes.each(function(cardType) {
                        $options = $options.add(
                            $('<option></option>', {
                                'value': cardType.id
                            }).text(cardType.get('name'))
                        );
                    });

                    return $options;
                })()
            );
        }
    });


    return CardCreateView;
});

