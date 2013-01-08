define([
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/view',
    'text!templates/user/header.hbs'
], function(_, Chaplin, utils, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var HeaderView = View.extend({
        template: template,
        tagName: 'header',
        className: 'row-fluid',
        container: '#page-container',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, "onLogoutClick");

            HeaderView.__super__.initialize.apply(view, arguments);

            view.delegate('click', ".btn-link.pull-right", view.onLogoutClick);
        },

        onLogoutClick: function() {
            var view = this;

            //TODO: TEMP, MOVE it from here
            $('.popover').remove();

            mediator.publish("!logout", "banking");
        }
    });


    return HeaderView;
});