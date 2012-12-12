define([
    'underscore',
    'chaplin',
    'views/base/collection_view',
    'views/admin/user_item_view',
    'text!templates/admin/users.hbs'
], function(_, Chaplin, CollectionView, UserItemView, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UsersView = CollectionView.extend({
        title: 'Users',

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

            // TODO: ??? maybe simply redirect or publish mediator event here
            mediator.publish('!router:route', 'users/create');
        }
    });


    return UsersView;
});