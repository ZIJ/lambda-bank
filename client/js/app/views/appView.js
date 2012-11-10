define([
    "jquery",
    "backbone",
    "views/loginView",
    "views/usersView"
],
function ($, Backbone, LoginView, UsersView) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;

            view.login = new LoginView({
                model: view.model.get("user"),
                el: view.$el.find(".login-page").first()
            });

            view.model.on("loaded", function () {
                view.render();
            });

            var user = view.model.get("user");
            user.on("loginned", function(){
                view.login.hide(function(){
                    $(".users-page").fadeIn("fast");
                })
            });

        },
        render: function () {
            var view = this;
            console.log("view rendering");
        }
    });
});