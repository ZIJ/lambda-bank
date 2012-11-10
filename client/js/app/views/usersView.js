define([
    "jquery",
    "backbone"
],
    function ($, Backbone) {
        return Backbone.View.extend({
            initialize: function () {
                var view = this;
            },
            events: {
                "click button[type=button]": "login"
            },
            login: function(){
                var view = this;
                var login = view.$el.find("input[name=username]").val();
                var password = view.$el.find("input[name=password]").val();
                view.model.login(login, password);
            },
            hide: function(){
                this.$el.fadeOut();
            },
            render: function () {
                var view = this;
                console.log("view rendering");
            }
        });
    });