define([
    'underscore',
    'chaplin',
    'views/admin/cards/cards_view',
    'views/admin/users/user_card_item_view',
    'text!templates/admin/users/user_cards.hbs'
], function(_, Chaplin, CardsView, UserCardItemView, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UserCardsView = CardsView.extend({

        template: template,

        itemView: UserCardItemView,

        className: null,
        container: null,

        initialize: function(options) {
            var view = this;

            view.onAddNewCardClick = _.bind(view.onAddNewCardClick, view, options.userId);

            UserCardsView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '.btn-link', view.onAddNewCardClick);
        },

        onAddNewCardClick: function(userId) {
            var view = this;

            mediator.publish('!router:route', 'users/' + userId + '/cards/create');
        }
    });

    return UserCardsView;
});