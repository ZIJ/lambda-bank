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

            // Expects the serviceProviders in the options.
            initialize: function(options) {
                var view = this;

                // _.bindAll(view, "onLogoutClick");

                NavigationView.__super__.initialize.apply(view, arguments);
            }

        });

        return NavigationView;

    })(View);

    return NavigationView;
});