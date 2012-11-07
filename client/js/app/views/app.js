define([
    "jquery",
    "backbone"
],
function ($, Backbone) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;

            view.model.on("loaded", function () {
                view.render();
            });
        },
        render: function () {
            var view = this;

            view.$el.text("Hello from " + view.model.get("str"));
        }
    });
});