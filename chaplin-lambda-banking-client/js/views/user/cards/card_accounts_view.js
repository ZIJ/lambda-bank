define([
    'underscore',
    'chaplin',
    'views/base/collection_view',
    'views/user/cards/card_account_item_view',
    'text!templates/user/cards/card_accounts.hbs'
], function(_, Chaplin, CollectionView, CardAccountItemView, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardAccountsView = CollectionView.extend({

        template: template,

        tagName: 'td',
        attributes: {
            'colspan': '4'
        },
        itemView: CardAccountItemView,
        listSelector: '.accounts',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

//            _.bindAll(view, '');

            CardAccountsView.__super__.initialize.apply(view, arguments);

        }
    });


    return CardAccountsView;
});