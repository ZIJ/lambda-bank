define([
    'underscore',
    'chaplin',
    'views/base/collection_view',
    'views/user/payments/select_account_view',
    'text!templates/user/payments/select_card.hbs'
], function(_, Chaplin, CollectionView, SelectAccountView, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UsersView = CollectionView.extend({

        template: template,

        tagName: 'form',
        attributes: {
            'action': ''
        },

        itemView: SelectAccountView,
        listSelector: 'dl.data-fields',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onNextStepClick');

            UsersView.__super__.initialize.apply(view, arguments);

            view.delegate('submit', 'form', view.onNextStepClick);
        },

        onNextStepClick: function(event) {
            event.preventDefault();

            var view = this,
                accountId = parseInt(view.$('input[type=radio]:checked').prop('id')),
                $checkedCard = view.$('input[type=radio]:checked').parent().parent().parent();

            mediator.publish('!payment:gotAccount', {
                cardId: view.collection.at(view.$('dl.data-fields').index($checkedCard)).id,
                accountId: accountId
            });
        }

    });


    return UsersView;
});