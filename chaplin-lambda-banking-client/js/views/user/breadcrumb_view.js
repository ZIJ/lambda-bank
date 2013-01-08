define([
    'jquery',
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/view'
//    'text!templates/admin/breadcrumb.hbs'
], function($, _, Chaplin, utils, View, template) {
    'use strict';

//    var mediator = Chaplin.mediator;

    var BreadcrumbView = View.extend({
//        template: template,
        tagName: 'ul',
        className: 'breadcrumb',
        container: '.breadcrumb-section',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'changeRouteHandler');

            BreadcrumbView.__super__.initialize.apply(view, arguments);

            view.modelBind('change:value', view.changeRouteHandler);
        },

        changeRouteHandler: function(model, newValue) {
            var view = this,
                $result = $(),
                currParam,
                i = 0;

            view.$el.empty();

            while (i < newValue.length - 1) {
                currParam = newValue[i];

                $result = $result.add(
                    $('<li></li>').append(
                        $().add(
                            $('<a></a>', {
                                'href': currParam.href
                            }).text(currParam.label)
                        ).add(
                            $('<span></span>', {
                                'class': 'divider'
                            }).text('/')
                        )
                    )
                );

                i++;
            }

            if (newValue.length > 0) {
                currParam = newValue[i];

                $result = $result.add(
                    $('<li></li>', {
                        'class': 'active'
                    }).text(currParam.label)
                );
            }

            view.$el.append($result);
        }
    });


    return BreadcrumbView;
});