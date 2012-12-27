define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/users/user_item.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UserItemView = View.extend({
        template: template,

        tagName: 'tr',

        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onUserItemClick');

            UserItemView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '', view.onUserItemClick);
        },

        onUserItemClick: function() {
            var view = this;

            mediator.publish('!router:route', 'users/' + view.model.id);
        }
    });

    return UserItemView;
});
