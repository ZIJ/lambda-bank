define([
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/view',
    'text!templates/admin/navigation.hbs'
], function(_, Chaplin, utils, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var NavigationView = (function(_super) {

        utils.extends(NavigationView, _super);

        function NavigationView() {
            NavigationView.__super__.constructor.apply(this, arguments);
        }

        _.extend(NavigationView.prototype, {
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

            matchRouteHandler: function(route) {
                var view = this,
                    targetSelector,
                    pattern = route.pattern;

                view.$('li.active').removeClass('active');

                if (pattern === '') {
                    targetSelector = '.icon-home';
                } else if (pattern === 'users' || pattern === 'users/create'
                || pattern === 'users/:id' || pattern === 'users/:id/edit') {
                    targetSelector = '.icon-user';
                }

                view.$(targetSelector).parent().parent().addClass('active');
            }

        });

        return NavigationView;

    })(View);

    return NavigationView;
});