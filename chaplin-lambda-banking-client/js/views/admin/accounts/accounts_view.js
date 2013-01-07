define([
    'underscore',
    'chaplin',
    'views/base/collection_view',
    'views/admin/accounts/account_item_view',
    'text!templates/admin/accounts/accounts.hbs'
], function(_, Chaplin, CollectionView, AccountItemView, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var AccountsView = CollectionView.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        itemView: AccountItemView,
        listSelector: 'tbody',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

//            _.bindAll(view, 'onAddNewUserClick');

            AccountsView.__super__.initialize.apply(view, arguments);

//            view.delegate('click', 'section > button', view.onAddNewUserClick);
        }
    });


    return AccountsView;
});