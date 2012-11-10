define([
    "backbone",
    "jquery"
],
    function (Backbone, $) {
        return Backbone.Model.extend({
            defaults: {
                role: "guest",
                loginUrl: "http://lambda-bank.drs-cd.com/WebService.svc/login"
            },

            initialize: function () {
                var user = this;
            },

            login: function(login, password) {
                var user = this;

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
                        user.set("token", data.Response.AuthenticationToken);
                        user.set("role", data.Response.Role);
                        user.trigger("loginned");
                    },
                    error: function(xhr) {
                        console.log("login failed");
                        console.log(xhr);
                    }
                });
            },

            getData: function() {
                //TODO cards loading
            },

            load: function () {
                var model = this;

                model.trigger("loaded");
            }
        });
    });