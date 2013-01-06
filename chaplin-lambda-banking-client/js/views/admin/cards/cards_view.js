define([
    'underscore',
    'chaplin',
    'views/base/collection_view',
    'views/admin/cards/card_item_view',
    'text!templates/admin/cards/cards.hbs'
], function(_, Chaplin, CollectionView, CardItemView, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardsView = CollectionView.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        itemView: CardItemView,
        listSelector: 'tbody',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onThCheckInputClick', 'onTdCheckInputClick');

            CardsView.__super__.initialize.apply(view, arguments);

            view.delegate('click', 'th.check input[type=checkbox]', view.onThCheckInputClick);
            view.delegate('click', 'td.check input[type=checkbox]', view.onTdCheckInputClick);
        },

        onThCheckInputClick: function(event) {
            var view = this,
                checked = $(event.currentTarget).prop('checked');

            view.$('td.check input[type=checkbox]').prop('checked', checked);
        },

        onTdCheckInputClick: function() {
            var view = this,
                checked = true;

            view.$('td.check input[type=checkbox]').each(function() {
                if ($(this).prop('checked') !== true) {
                    checked = false;
                }
            });
            view.$('th.check input[type=checkbox]').prop('checked', checked);
        }

    });


    return CardsView;
});