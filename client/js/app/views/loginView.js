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
        events: {
            "click button[type=button]": "login",
            "click": "loginTest"
        },
        login: function() {
            var view = this;
            var login = view.$el.find("input[name=username]").val();
            var password = view.$el.find("input[name=password]").val();
            view.trigger("loginRequest", {
                login: login,
                password: password
            });
        },
        //hide: function(callback) {
        //    this.$el.fadeOut("fast", callback);
        //},
        render: function() {
            var view = this;

            console.log("loginView rendering");

            view.$el.empty();

            view.$el.css({
                "background-color": "blue"
            });
        },

        //only for testing
        loginTest: function() {
            this.trigger("loginRequest", {
                login: "root",
                password: "root"
            });
        }
    });
});