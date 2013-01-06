define([
    'views/admin/cards/card_item_view',
    'text!templates/admin/users/user_card_item.hbs'
], function(CardItemView, template) {
    'use strict';

    var UserCardItemView = CardItemView.extend({
        template: template
    });

    return UserCardItemView;
});
