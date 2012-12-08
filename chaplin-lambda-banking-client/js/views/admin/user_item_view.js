define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/user_item.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UserItemView = View.extend({
        template: template,

        tagName: 'tr',

        initialize: function(options) {
            var view = this;

            UserItemView.__super__.initialize.apply(view, arguments);
        }
    });

    return UserItemView;
});
