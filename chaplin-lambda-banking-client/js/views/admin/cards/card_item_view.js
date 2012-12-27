define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/cards/card_item.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardItemView = View.extend({
        template: template,

        tagName: 'tr',

        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onCardItemClick');

            CardItemView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '', view.onCardItemClick);
        },

        onCardItemClick: function() {
            var view = this;

            mediator.publish('!router:route', 'cards/' + view.model.id);
        }
    });

    return CardItemView;
});
