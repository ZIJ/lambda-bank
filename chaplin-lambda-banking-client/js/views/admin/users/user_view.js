define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/users/user.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var UserView = View.extend({
        title: 'User',

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onEditClick'); // 'onDeleteClick'

            UserView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '.btn.edit', view.onEditClick);
//            view.delegate('click', '.btn.delete', view.onDeleteClick);

//            view.modelBind('dispose', view.modelDisposeHandler);
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
