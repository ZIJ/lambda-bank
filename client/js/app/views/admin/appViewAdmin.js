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
        render: function() {
            var view = this;

            console.log("appViewAdmin rendering");

            view.$el.empty();

            view.$el.css({
                "background-color": "red"
            });
        }
    });
});