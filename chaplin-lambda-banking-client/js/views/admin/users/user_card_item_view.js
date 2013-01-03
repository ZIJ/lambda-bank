define([
    'jquery',
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/users/user_card_item.hbs',
    'views/admin/cards/card_accounts_view'
], function($, _, Chaplin, View, template, CardAccountsView) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardItemView = View.extend({
        template: template,

        tagName: 'tr',

        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onCardItemClick');

            CardItemView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '.expander', view.onCardItemClick);
        },

        afterRender: function() {
            var view = this;

            CardItemView.__super__.afterRender.apply(view);

            view.subview('cardAccountsView', new CardAccountsView({
                collection: view.model.get('accounts'),
                container: view.$('.expandable')
            }));
            view.subview('cardAccountsView').renderAllItems();
        },

        onCardItemClick: function() {
            var view = this,
                $expander = view.$('.expander'),
                $expandable = view.$('.expandable'),
                $expandableTd = $expandable.children('td'),
                $expandableUl = $expandableTd.children().first();

            var padding;
            if ($expandableUl.length === 0) {
                return;
            }
            if ($expandableUl.is(':visible')) {
                padding = $expandableTd.css('padding');
                $expandableTd.stop(true).animate({'padding': 0}, function() {
                    $expandableTd.css('padding', padding);
                });
                $expandableUl.stop(true).slideUp(function() {
                    $(this).parent().parent().hide();
                    $expander.prop('title', 'Expand');
                });
                return;
            }
            $expandable.show();
            padding = $expandableTd.css('padding');
            $expandableTd.css('padding', 0);
            $expandableTd.stop(true).animate({'padding': padding});
            $expandableUl.stop(true).slideDown(function() {
                $expander.prop('title', 'Collapse');
            });
        }

    });

    return CardItemView;
});
