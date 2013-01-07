define([
    'underscore',
    'chaplin',
    'views/base/collection_view',
    'views/admin/users/user_item_view',
    'text!templates/admin/users/users.hbs'
], function(_, Chaplin, CollectionView, UserItemView, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UsersView = CollectionView.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        itemView: UserItemView,
        listSelector: 'tbody',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onAddNewUserClick');

            UsersView.__super__.initialize.apply(view, arguments);

            view.delegate('click', 'section > button', view.onAddNewUserClick);
        },

        onAddNewUserClick: function() {
            var view = this;

            mediator.publish('!router:route', 'users/create');
        }

    });


    return UsersView;
});