define([
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/view',
    'text!templates/admin/header.hbs'
], function(_, Chaplin, utils, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var HeaderView = (function(_super) {

        utils.extends(HeaderView, _super);

        function HeaderView() {
            HeaderView.__super__.constructor.apply(this, arguments);
        }

        _.extend(HeaderView.prototype, {
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

                mediator.publish("!logout", "banking");
            }

        });

        return HeaderView;

    })(View);

    return HeaderView;
});