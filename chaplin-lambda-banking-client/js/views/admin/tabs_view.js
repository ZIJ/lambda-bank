define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/tabs.hbs',
    'bootstrap'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var TabsView = View.extend({

        template: template,

        className: 'cards-n-accounts',

        //model: { tabs: [ {key: '', label: ''}, {key: '', label: ''}, ... ]}

        autoRender: true,

        initialize: function(options) {
            var view = this;

            TabsView.__super__.initialize.apply(view, arguments);
        },

        afterRender: function() {
            var view = this;

            TabsView.__super__.afterRender.apply(view);

            view.$('a:first').tab('show');
        }
    });


    return TabsView;
});
