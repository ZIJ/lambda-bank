define([
    'jquery',
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/cards/card_item.hbs',
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

        onCardItemClick: function(event) {
            var $eventTarget = $(event.target);
            if ($eventTarget.is('input[type=checkbox]') || $eventTarget.is('td.check')) {
                return;
            }

            var view = this,
                $expander = view.$('.expander'),
                $expandable = view.$('.expandable'),
                $expandableDiv = $expandable.find('div');
            // if ($expandableUl.length === 0) {
            //     return;
            // }
            if($expandable.is(":visible"))
            {
                $expandableDiv.stop(true).slideUp(function(){
                    $expandable.stop(true).hide();
                    $expander.prop('title', 'Expand');
                });
            }
            else
            {
                $expandable.stop(true).show();
                $expandableDiv.stop(true).slideDown(function(){
                    $expander.prop('title', 'Collapse');
                });
            }
        }

    });

    return CardItemView;
});
