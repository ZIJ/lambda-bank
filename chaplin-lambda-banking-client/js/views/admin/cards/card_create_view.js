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

            _.bindAll(view, 'onSaveClick', 'onCancelClick', 'onCardAccountTypeChange', 'onCurrencyAddClick'
                , 'onCurrencyRemoveClick', 'onCurrencyChange'
                , 'userAccountsLoadedHandler', 'currenciesLoadedHandler', 'cardTypesLoadedHandler');

            CardCreateView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '.btn.save', view.onSaveClick);
            view.delegate('click', '.btn.cancel', view.onCancelClick);

            view.subscribeEvent('userAccountsLoaded', view.userAccountsLoadedHandler);
            view.subscribeEvent('currenciesLoaded', view.currenciesLoadedHandler);
            view.subscribeEvent('cardTypesLoaded', view.cardTypesLoadedHandler);

            view.userAccountsDef = new $.Deferred();
            view.currenciesDef = new $.Deferred();
            view.cardTypesDef = new $.Deferred();

            view.delegate('change', '.card-new-account-types', view.onCardAccountTypeChange);
            view.delegate('click', '.card-new-currency-add', view.onCurrencyAddClick);
            view.delegate('click', '.card-new-currency-remove', view.onCurrencyRemoveClick);
            view.delegate('change', '.card-new-currencies', view.onCurrencyChange);

            mediator.publish('!loadCardTypes');

            // TODO: should be loaded only when needed
            mediator.publish('!loadCurrencies');
            mediator.publish('!loadUserAccounts');
        },

        afterRender: function() {
            var view = this,
                accountsAvailable = false;

            CardCreateView.__super__.afterRender.apply(view);

            view.userAccountsDef.done(function(accounts) {
                if (accounts.length !== 0) {
                    view.$('.card-new-accounts').html(view.$getUserAccounts(accounts));
                    accountsAvailable = true;
                }

                // TODO: initial setup
                if (accountsAvailable === true) {
                    view.$('#type_existing').prop('checked', 'checked');
                } else {
                    view.$('#type_existing').prop('disabled', true);
                    view.$('#type_single').prop('checked', 'checked');
                }
                view.$('.card-new-account-types').change();
            });
            view.currenciesDef.done(function(currencies) {
                view.$('.card-new-currencies').html(view.$getCurrencies(currencies));
            });
            view.cardTypesDef.done(function(cardTypes) {
                view.$('.card-new-types').html(view.$getCardTypes(cardTypes));
            });

            view.$('.datepicker').pikaday({
                format: 'DD.MM.YYYY',
                defaultDate: moment().add('years', 3).toDate(), // TODO: hard-coded to current + 3 years
                setDefaultDate: true,
                minDate: moment().add('years', 1).toDate(),
                maxDate: moment().add('years', 5).toDate()
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


        onCardAccountTypeChange: function() {
            var view = this,
                newCardAccountTypeId = view.$('.card-new-account-types input[type=radio]:checked').prop('id');

            switch (newCardAccountTypeId) {
                case 'type_existing':

                    view.$('.card-new-currency, .card-new-currency + dd').hide();
                    view.$('.card-new-currencies').not(':eq(0)').parent().remove();
                    view.$('.card-new-account, .card-new-account + dd').show();

                    break;
                case 'type_single':
                    var $currencySelects = view.$('.card-new-currencies');

                    $currencySelects.removeClass('error');

                    view.$('.card-new-account, .card-new-account + dd, .card-new-currency-add, .card-new-currency-remove').hide();
                    $currencySelects.not(':eq(0)').parent().remove();
                    view.$('.card-new-currency, .card-new-currency + dd').show();

                    break;
                case 'type_multi':

                    view.$('.card-new-account, .card-new-account + dd, .card-new-currency-remove').hide();
                    view.$('.card-new-currency, .card-new-currency + dd, .card-new-currency-add').show();

                    // TODO: 2 selects by default
                    view.onCurrencyAddClick();

                    break;
            }
        },

        onCurrencyAddClick: function() {
            var view = this,
                $selects = view.$('.card-new-currencies');

            if ($selects.length === $selects.first().children('option').length) {
                return;
            }

            var $ddLast = $selects.last().parent();

            $ddLast.after($ddLast.clone());

            if (view.$('.card-new-currencies').length === 3) {
                view.$('.card-new-currency-remove').show();
            }

            view.onCurrencyChange();
        },

        onCurrencyRemoveClick: function(event) {
            var view = this;

            $(event.currentTarget).parent('dd').remove();

            if (view.$('.card-new-currencies').length === 2) {
                view.$('.card-new-currency-remove').hide();
            }

            view.onCurrencyChange();
        },

        onCurrencyChange: function() {
            var view = this,
                $currencySelects = view.$('.card-new-currencies'),
                selectedCurrenciesHash = {};    // hash by currencyId of arrays with select indices

            $currencySelects.removeClass('error');

            $currencySelects.each(function(index) {
                var currencyId = $(this).children('option:selected').val();

                if (!selectedCurrenciesHash[currencyId]) {
                    selectedCurrenciesHash[currencyId] = [index]
                } else {
                    selectedCurrenciesHash[currencyId].push(index);
                }
            });

            _.each(selectedCurrenciesHash, function(occurrencies, currencyId) {
                if (occurrencies.length > 1) {
                    _.each(occurrencies, function(selectIndex) {
                        $($currencySelects.get(selectIndex)).addClass('error');
                    });
                }
            });
        },

        onSaveClick: function() {
            var view = this;

            if (view.$('.error').length !== 0) {
                return;
            }

            var options = {
                    attributesToSave: {
                        type: parseInt(view.$('.card-new-types').children('option:selected').val()),
                        expirationDate: moment(view.$('.datepicker').val(), 'DD.MM.YYYY')
                    }
                };

            switch (view.$('.card-new-account-types input[type=radio]:checked').prop('id')) {
                case 'type_existing':
                    _.extend(options.attributesToSave, {
                        accountID2Attach: view.$('.card-new-accounts').val()
                    });
                    break;
                case 'type_single':
                    _.extend(options.attributesToSave, {
                        currencies: [parseInt(view.$('.card-new-currencies').first().val())]
                    });
                    break;
                case 'type_multi':
                    var currenciesIds = [];

                    view.$('.card-new-currencies').each(function() {
                        currenciesIds.push(parseInt($(this).val()));
                    });

                    _.extend(options.attributesToSave, {
                        currencies: currenciesIds
                    });
                    break;
            }

            mediator.publish('!saveCard', options);
        },

        onCancelClick: function() {
            var view = this;

            mediator.publish('!router:route', 'users/' + view.model.get('holder').id);
        },

        // TODO: All TEMPORARY $* methods evidence that we need subviews for each of these components

        $getUserAccounts: function(accounts) {
            var $options = $();

            accounts.each(function(account) {
                $options = $options.add(
                    $('<option></option>', {
                        'value': account.id
                    }).text(account.get('number'))
                );
            });

            return $options;
        },
        $getCurrencies: function(currencies) {
            var $options = $();

            currencies.each(function(currency) {
                $options = $options.add(
                    $('<option></option>', {
                        'value': currency.id
                    }).text(currency.get('name'))
                );
            });

            return $options;
        },
        $getCardTypes: function(cardTypes) {
            var $options = $();

            cardTypes.each(function(cardType) {
                $options = $options.add(
                    $('<option></option>', {
                        'value': cardType.id
                    }).text(cardType.get('name'))
                );
            });

            return $options;
        }
    });


    return CardCreateView;
});

