define([
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/view',
    'text!templates/user/navigation.hbs'
], function(_, Chaplin, utils, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var NavigationView = View.extend({
        template: template,
        tagName: 'aside',
        className: 'span2',
        container: 'div.row-fluid',
        autoRender: true,

        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'matchRouteHandler');

            NavigationView.__super__.initialize.apply(view, arguments);

            view.subscribeEvent('matchRoute', view.matchRouteHandler);
        },

        matchRouteHandler: function(route, params) {
            var view = this,
                targetSelector,
                pattern = route.pattern;

            view.$('li.active').removeClass('active');

            if (pattern === '') {
                targetSelector = '.icon-home';
            } else if ((/^users/).test(pattern) === true) {
                targetSelector = '.icon-user';
            } else if ((/^cards/).test(pattern) === true) {
                targetSelector = '.glyphicon-credit-card';
            } else if ((/^accounts/).test(pattern) === true) {
                targetSelector = '.icon-list';
            } else if ((/^settings/).test(pattern) === true) {
                targetSelector = '.icon-wrench';
            }

            view.$(targetSelector).parent().parent().addClass('active');
        }
    });

    return NavigationView;
});