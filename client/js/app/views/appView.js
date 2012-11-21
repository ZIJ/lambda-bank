define([
    "jquery",
    "backbone",

    "views/loginView",

    "backbone.extended"
],
function ($, Backbone, LoginView, UsersView) {
    return Backbone.Extended.View.extend({
        initialize: function() {
            var view = this;

            view.bindTo(view.model, "change:");



            var user = view.model.get("user");
            user.on("loginned", function() {
                view.login.hide(function() {
                    $(".users-page").fadeIn("fast");
                });
            });

        },
        render: function () {
            var view = this;

            console.log("view rendering");
        }
    });
});