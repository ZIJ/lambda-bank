define([
    "backbone",
    "jquery",
    "models/userModel"
],
function (Backbone, $, UserModel) {
    return Backbone.Model.extend({
        defaults: {
            usersUrl: "http://lambda-bank.drs-cd.com/WebService.svc/user/users/get", // without "user" part addition doesnt work too
            user: null
        },

        initialize: function () {
            var app = this;
            var user = new UserModel({app: app});
            this.set("user", user);
            this.load();
            user.on("loginned", function(){
                /*
                if (user.get("role").toLowerCase() === "admin") {
                    app.loadAdminData();
                }
                */
                app.loadAdminData();
            })
        },

        loadAdminData: function(){
            $.ajax({
                type: "GET",
                url: this.get("usersUrl"),
                dataType: "json",
                cache: false,
                contentType: "application/json",
                success: function(response) {
                    console.log(response);
                },
                error: function(xhr) {
                    console.log("login failed");
                    console.log(xhr);
                }
            });
        },

        load: function () {
            var model = this;

            model.trigger("loaded");
        }
    });
});