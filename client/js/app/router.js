define([
    "backbone"
],
function (Backbone) {
    return Backbone.Router.extend({
        lastAction: null,

        routes: {
            "login": "login",
            "": "index"
        },

        initialize: function(options) {
            var router = this;

            if (options.app) {
                router.app = options.app;
            }
        },

        index: function() {
            var router = this;

            if (router.app.userModel.get("role") === "guest") {
                router.navigate("login");
            } else {
                router.lastAction = {
                    name: "index"
                };

                router.app.viewModel.load().then(function () {
                    router.lastAction = null;
                });
            }
        },

        login: function () {
            var router = this;

            //TODO: dispose viewModel & view
            router.app.loginView.render();
        }
    });
});