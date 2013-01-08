define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/user/cards/card_account_item.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardAccountItemView = View.extend({
        template: template,

        tagName: 'tr',

        initialize: function(options) {
            var view = this;

//            _.bindAll(view, 'onCardAccountItemClick');

            CardAccountItemView.__super__.initialize.apply(view, arguments);

//            view.delegate('click', '', view.onCardAccountItemClick);
        },

        onCardAccountItemClick: function() {
            var view = this;

//            mediator.publish('!router:route', 'cards/' + view.model.id);
        }
    });

    return CardAccountItemView;
});
