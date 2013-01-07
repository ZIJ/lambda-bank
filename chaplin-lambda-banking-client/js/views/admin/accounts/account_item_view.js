define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/accounts/account_item.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var AccountItemView = View.extend({
        template: template,

        tagName: 'tr',

        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onAccountItemClick');

            AccountItemView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '', view.onAccountItemClick);
        },

        onAccountItemClick: function() {
            var view = this;

            mediator.publish('!router:route', 'accounts/' + view.model.id);
        }
    });

    return AccountItemView;
});
