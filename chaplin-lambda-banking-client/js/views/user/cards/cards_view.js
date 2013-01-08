define([
    'underscore',
    'chaplin',
    'views/base/collection_view',
    'views/user/cards/card_item_view',
    'text!templates/user/cards/cards.hbs'
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

//            _.bindAll(view, 'onThCheckInputClick');

            CardsView.__super__.initialize.apply(view, arguments);

        }

    });


    return CardsView;
});