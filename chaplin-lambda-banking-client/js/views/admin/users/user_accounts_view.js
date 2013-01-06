define([
    'views/admin/accounts/accounts_view',
    'text!templates/admin/users/user_accounts.hbs'
], function(AccountsView, template) {
    'use strict';

    var UserAccountsView = AccountsView.extend({
        template: template,
        className: null,
        container: null
    });

    return UserAccountsView;
});