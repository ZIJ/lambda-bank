define([
    'views/admin/cards/card_item_view',
    'views/admin/cards/card_accounts_view',
    'text!templates/admin/users/user_card_item.hbs'
], function(CardItemView, CardAccountsView, template) {
    'use strict';

    var UserCardItemView = CardItemView.extend({
        template: template,

        afterRender: function() {
            var view = this;

            UserCardItemView.__super__.afterRender.apply(view);

            view.subview('cardAccountsView', new CardAccountsView({
                collection: view.model.get('accounts'),
                container: view.$('.expandable'),
                attributes: {
                    'colspan': '5'
                }
            }));
            view.subview('cardAccountsView').renderAllItems();
        }
    });

    return UserCardItemView;
});
