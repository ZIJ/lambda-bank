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

//            _.bindAll(view, 'onEditClick'); // 'onDeleteClick'

            AccountView.__super__.initialize.apply(view, arguments);

//            view.delegate('click', '.btn.edit', view.onEditClick);
        }
    });

    return AccountView;
});
