define([
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/view',
    'text!templates/user/home.hbs'
], function(_, Chaplin, utils, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var HomeView = View.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        autoRender: true,

        initialize: function(options) {
            var view = this;

//            _.bindAll(view, 'matchRouteHandler');

            HomeView.__super__.initialize.apply(view, arguments);

//            view.subscribeEvent('matchRoute', view.matchRouteHandler);
        }
    });

    return HomeView;
});