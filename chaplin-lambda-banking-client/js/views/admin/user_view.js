define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/user.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UsersView = View.extend({
        title: 'User',

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onEditClick', 'onDeleteClick');

            UsersView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '.btn.edit', view.onEditClick);
            view.delegate('click', '.btn.delete', view.onDeleteClick);
        },

        onEditClick: function() {
            var view = this;


        },

        onDeleteClick: function() {
            var view = this;

            view.model.destroy();
        }
    });


    return UsersView;
});
