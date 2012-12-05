define([
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/view'
], function(_, Chaplin, utils, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var MiddleView = (function(_super) {

        utils.extends(MiddleView, _super);

        function MiddleView() {
            MiddleView.__super__.constructor.apply(this, arguments);
        }

        _.extend(MiddleView.prototype, {
            className: 'row-fluid',
            container: '#page-container',
            autoRender: true,

            // Expects the serviceProviders in the options.
            initialize: function(options) {
                var view = this;

                MiddleView.__super__.initialize.apply(view, arguments);
            }

        });

        return MiddleView;

    })(View);

    return MiddleView;
});