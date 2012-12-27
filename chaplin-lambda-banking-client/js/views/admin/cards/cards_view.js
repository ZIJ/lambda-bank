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
        title: 'Users',

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        itemView: CardItemView,
        listSelector: 'tbody',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onAddNewCardClick');

            CardsView.__super__.initialize.apply(view, arguments);

            view.delegate('click', 'section > button', view.onAddNewCardClick);
        },

        onAddNewCardClick: function() {
            var view = this;

            mediator.publish('!router:route', 'cards/create');
        }
    });


    return CardsView;
});