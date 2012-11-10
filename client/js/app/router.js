define([
    "backbone"
],
    function (Backbone) {
        return Backbone.Model.extend({
            defaults: {
                str: "appModel",
                user: null
            },

            initialize: function () {
                var app = this;
                var user = new UserModel({app: app});
                this.set("user", user);
                this.load();
            },

            load: function () {
                var model = this;

                model.trigger("loaded");
            }
        });
    });