define([
    'underscore',
    'chaplin',
    'views/base/collection_view',
    'views/admin/users/user_card_item_view',
    'text!templates/admin/users/user_cards.hbs'
], function(_, Chaplin, CollectionView, CardItemView, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardsView = CollectionView.extend({

        template: template,

        itemView: CardItemView,
        listSelector: 'tbody',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bind(view.onAddNewCardClick, view, options.userId);

            CardsView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '.btn-link', view.onAddNewCardClick);
        },

        // TODO: TEMP, remove it
        onAddNewCardClick: function(userId) {
            var view = this;

            mediator.publish('!router:route', 'user/' + userId + '/cards/create');
        }
    });


    return CardsView;
});