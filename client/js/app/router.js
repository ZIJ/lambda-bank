define([
    "app",

    "backbone"
],
function (app, Backbone) {
    return Backbone.Router.extend({
        lastAction: null,

        routes: {
            "login": "login",
            "": "index"
        },

        initialize: function(options) {

        },

        index: function() {
            var router = this;

            if (app.userModel.get("role") === "guest") {
                router.navigate("login");
            } else {
                router.lastAction = {
                    name: "index"
                };

                app.viewModel.load().then(function () {
                    router.lastAction = null;
                });
            }
        },

        login: function () {
            //TODO: dispose viewModel & view
            app.loginView.render();
        }
    });
});