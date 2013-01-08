define([
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/view',
    'text!templates/user/payments/layout.hbs'
], function(_, Chaplin, utils, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var LayoutView = View.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

//            _.bindAll(view, 'onSwitchSessionStorage');

            LayoutView.__super__.initialize.apply(view, arguments);

            // TODO: do smth here
        },

        afterRender: function() {
            var view = this;

            LayoutView.__super__.afterRender.apply(view);

            // TODO: do smth here
        }
    });


    return LayoutView;
});