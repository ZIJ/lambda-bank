define([
    'chaplin',
    'underscore',
    'controllers/base/controller',
    'views/admin/settings_view'
], function(Chaplin, _, Controller, SettingsView) {
    'use strict';

    var SettingsController = Controller.extend({

        title: 'Settings',

        initialize: function(params) {
            var controller = this;

            // TODO: hard-coded 'true' default value for useSessionStorage flag (even in template)

        },

        index: function() {
            var controller = this;

            controller.view = new SettingsView();
        }

    });

    return SettingsController;
});
