define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/users/user.hbs',
    'views/admin/tabs_view',
    'models/base/model',
    'models/admin/cards',
    'views/admin/users/user_cards_view'
], function(_, Chaplin, View, template, TabsView, Model, CardsCollection, UserCardsView) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UserView = View.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        autoRender: true,

        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onEditClick'); // 'onDeleteClick'

            UserView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '.btn.edit', view.onEditClick);
//            view.delegate('click', '.btn.delete', view.onDeleteClick);

            //TODO: TEMP, shouldn't be created inside this view, maybe pass from cards_controller
            view.cards = new CardsCollection([], {
                userId: view.model.id
            });


//            view.modelBind('dispose', view.modelDisposeHandler);
        },

        afterRender: function() {
            var view = this;

            UserView.__super__.afterRender.apply(view);

//            var cards = new CardsCollection([], {
//                userId: view.model.id
//            });

            view.subview('cardsAndAccountsTabsView', new TabsView({
                // TODO: make it any other way
                model: new Model({
                    tabs: [
                        {
                            id: 'user-tab-cards',
                            label: 'Cards'
                        },
                        {
                            id: 'user-tab-accounts',
                            label: 'Accounts'
                        }
                    ]
                }),
                container: view.$('section.content')    // view.$el
            }));

            var tabsView = view.subview('cardsAndAccountsTabsView');

            tabsView.subview('userCardsView', new UserCardsView({
                collection: view.cards,
                container: tabsView.$('#user-tab-cards'),
                userId: view.model.id
            }));
            tabsView.subview('userCardsView').renderAllItems();
        },

        onEditClick: function() {
            var view = this;

            mediator.publish('!router:route', 'users/' + view.model.id + '/edit');
        }//,

//        onDeleteClick: function() {
//            var view = this;
//
//            view.model.destroy();
//        },

//        modelDisposeHandler: function() {
//            mediator.publish('!router:route', 'users');
//        }
    });


    return UserView;
});
