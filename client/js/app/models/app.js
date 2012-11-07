define([
    "backbone"
],
function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
            str: "appModel"
        },

        initialize: function () {

        },

        load: function () {
            var model = this;

            model.trigger("loaded");
        }
    });
});