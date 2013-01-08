define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/user/payments/select_account.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var SelectAccountView = View.extend({
        template: template,

        tagName: 'dd',
        className: 'card',

        initialize: function(options) {
            var view = this;

            SelectAccountView.__super__.initialize.apply(view, arguments);
        },

        afterRender: function() {
            var view = this;

            SelectAccountView.__super__.afterRender.apply(view);

            if (view.model.get('state') === 'Frozen') {
                view.$el.addClass('error');

                view.$('dt').append(
                    '<span class="label label-important">Frozen!</span>'
                );
                view.$('input[type=radio]').prop('disabled', true);

            } else if (view.model.get('state') === 'Expired') {
                view.$el.addClass('error');

                view.$('dt').append(
                    '<span class="label label-important">Expired!</span>'
                );
                view.$('input[type=radio]').prop('disabled', true);
            }
        }
    });

    return SelectAccountView;
});
