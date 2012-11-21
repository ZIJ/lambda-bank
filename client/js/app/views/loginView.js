define([
    "zepto",

    "backbone",

    "backbone.extended"
],
function ($, Backbone) {
    return Backbone.View.Extended.extend({
        initialize: function() {
            var view = this;

        },
        events: {
            "click button[type=button]": "login"
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
            
            view.$el.empty();

            console.log("view rendering");
        }
    });
});