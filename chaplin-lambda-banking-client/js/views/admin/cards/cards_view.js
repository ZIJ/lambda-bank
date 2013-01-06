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

            _.bindAll(view, 'onThCheckInputClick', 'onTdCheckInputClick', 'onFreezeCardsClick', 'onUnfreezeCardsClick');

            CardsView.__super__.initialize.apply(view, arguments);

            view.delegate('click', 'th.check input[type=checkbox]', view.onThCheckInputClick);
            view.delegate('click', 'td.check input[type=checkbox]', view.onTdCheckInputClick);

            view.delegate('click', '#cards-freeze:not(:disabled)', view.onFreezeCardsClick);
            view.delegate('click', '#cards-unfreeze:not(:disabled)', view.onUnfreezeCardsClick);

            // TODO: temporary callback injected
            view.modelBind('reset', view.onTdCheckInputClick);
        },

        onThCheckInputClick: function(event) {
            var view = this,
                checked = $(event.currentTarget).prop('checked'),
                $tdCheckboxes = view.$('td.check input[type=checkbox]');

            $tdCheckboxes.prop('checked', checked);

            view.toggleFreezeButtonsState(checked === true && $tdCheckboxes.length > 0);
        },

        onTdCheckInputClick: function() {
            var view = this,
                hasChecked = false,
                checked = true,
                $tdCheckboxes = view.$('td.check input[type=checkbox]');

            $tdCheckboxes.each(function() {
                if ($(this).prop('checked') === true) {
                    hasChecked = true;
                } else {
                    checked = false;
                }
            });
            view.$('th.check input[type=checkbox]').prop('checked', checked === true && $tdCheckboxes.length > 0);

            view.toggleFreezeButtonsState(hasChecked);
        },

        onFreezeCardsClick: function() {
            var view = this,
                cardsCollection = view.collection,
                cardsIdsToFreeze = [];

            view.$('td.check input[type=checkbox]').each(function(index) {
                if ($(this).prop('checked') === true && cardsCollection.at(index).get('state') === 'Valid') {
                    cardsIdsToFreeze.push(cardsCollection.at(index).id);
                }
            });

            mediator.publish('!freezeCards', cardsIdsToFreeze);
        },

        onUnfreezeCardsClick: function() {
            var view = this,
                cardsCollection = view.collection,
                cardsIdsToUnfreeze = [];

            view.$('td.check input[type=checkbox]').each(function(index) {
                if ($(this).prop('checked') === true && cardsCollection.at(index).get('state') === 'Frozen') {
                    cardsIdsToUnfreeze.push(cardsCollection.at(index).id);
                }
            });

            mediator.publish('!unfreezeCards', cardsIdsToUnfreeze);
        },

        toggleFreezeButtonsState: function(enable) {
            var view = this;

            if (enable === true) {
                view.$('#cards-freeze').removeAttr('disabled');
                view.$('#cards-unfreeze').removeAttr('disabled');
            } else {
                view.$('#cards-freeze').prop('disabled', 'disabled');
                view.$('#cards-unfreeze').prop('disabled', 'disabled');
            }
        }

    });


    return CardsView;
});