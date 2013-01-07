define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/accounts/account.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var AccountView = View.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        autoRender: true,

        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onReplenishClick', 'onWithdrawClick');

            AccountView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '.btn.replenish', view.onReplenishClick);
            view.delegate('click', '.btn.withdraw', view.onWithdrawClick);
            view.delegate('submit', 'form', view.onFormSubmit);
        },

        onReplenishClick: function() {
            var view = this;

            view.$('#submitter').val('replenish');
        },

        onWithdrawClick: function() {
            var view = this;

            view.$('#submitter').val('withdraw');
        },

        onFormSubmit: function(e) {
            e.preventDefault();

            var view = this,
                action = view.$('#submitter').val();

            if (action === '') {
                return;
            }
            var amount = parseFloat(view.$('input[type=text]').val().replace(',', '.'));

            mediator.publish('!' + action, amount);
        }
    });

    return AccountView;
});
