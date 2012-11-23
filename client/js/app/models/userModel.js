define([
    "backbone",
    "jquery",

    "backbone.extended"
],
function (Backbone, $) {
    return Backbone.Extended.Model.extend({
        defaults: {
            guid: null,
            role: "guest",
            loginUrl: "http://lambda-bank.drs-cd.com/WebService.svc/login"
        },

        initialize: function() {
            var model = this;
        },

        login: function(login, password) {
            var model = this;

            $.ajax({
                type: "POST",
                url: this.get("loginUrl"),
                data: JSON.stringify({
                    login: login,
                    password: password
                }),
                dataType: "json",
                cache: false,
                contentType: "application/json",
                success: function(data) {
                    model.set({
                        guid: data.Response.AuthenticationToken,
                        role: data.Response.Role
                    });
                },
                error: function(xhr) {
                    model.trigger("error:login");
                }
            });
        },

        fetch: function() {

        },

        load: function() {
            var model = this;

            model.trigger("loaded");
        }
    });
});