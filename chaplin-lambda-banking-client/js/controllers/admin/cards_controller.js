define([
    'underscore',
    'chaplin',
    'controllers/base/controller',
    // TODO: load when needed
    'models/admin/cards',
    'views/admin/cards/cards_view',
    'models/admin/card',
//    'views/admin/cards/card_view',
//    'views/admin/cards/card_edit_view'
], function(_, Chaplin, Controller, CardsCollection, CardsView, CardModel, CardView, CardEditView) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardsController = Controller.extend({

        title: 'Cards',

        initialize: function(params) {
            var controller = this;

            _.bindAll(controller, 'triggerSaveCard');

            CardsController.__super__.initialize.apply(controller, arguments);

            controller.subscribeEvent('!saveCard', controller.triggerSaveCard);
        },

        index: function() {
            var controller = this;

            controller.collection = new CardsCollection();

            controller.view = new CardsView({
                collection: controller.collection
            });
        },

        show: function(params) {    //TODO: verify if userId is not a hash with userId inside
            var controller = this;

            controller.model = new CardModel({
                id: params.id
            });

            controller.model.fetch({
                success: function() {
                    controller.view = new CardView({
                        model: controller.model
                    });
                }
            });
        },

        create: function() {
            var controller = this;

            controller.model = new CardModel();

            controller.view = new CardEditView({
                model: controller.model
            });
        },

        edit: function(params) {
            var controller = this;

            controller.model = new CardModel({
                id: params.id
            });

            controller.model.fetch({
                success: function() {
                    controller.view = new CardEditView({
                        model: controller.model
                    });
                }
            });
        },

        triggerSaveCard: function(options) {
            var controller = this;

            controller.model.save({
                attributesToSave: options.attributesToSave,
                success: function() {
                    mediator.publish('!router:route', 'cards/' + controller.model.id);
                },
                error: function() {
                    // TODO: implementation needed
                }
            });
        }


    });

    return CardsController;
});
