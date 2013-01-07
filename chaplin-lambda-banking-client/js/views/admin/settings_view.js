define([
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/view',
    'text!templates/admin/settings.hbs'
], function(_, Chaplin, utils, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var SettingsView = View.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onSwitchSessionStorage');

            SettingsView.__super__.initialize.apply(view, arguments);

            view.delegate('click', 'input', view.onSwitchSessionStorage);
        },

        afterRender: function() {
            var view = this;

            SettingsView.__super__.afterRender.apply(view);

            // TODO: TEMP: 'useSessionStorage' flag should be passed from settings_controller by event
            view.$('#session').prop('checked', mediator.user.get('provider').useSessionStorage);
        },

        onSwitchSessionStorage: function() {
            var view = this,
                $checkbox = view.$('#session');

            if ($checkbox.prop('checked') === true) {
                mediator.publish('!switchUseSessionStorage', true);
            } else {
                mediator.publish('!switchUseSessionStorage', false);
            }
        }
    });


    return SettingsView;
});