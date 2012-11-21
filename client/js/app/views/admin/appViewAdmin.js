define([
    "zepto",
    "backbone",

    "backbone.extended"
],
function ($, Backbone) {
    return Backbone.Extended.View.extend({
        initialize: function() {
            var view = this;

        },
        render: function () {
            var view = this;

            view.$el.empty();

            view.$el.css({
                "background-color": "red"
            });
        }
    });
});