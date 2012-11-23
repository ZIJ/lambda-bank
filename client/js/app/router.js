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

            //var hashStr = window.location.hash ? "#" + window.location.hash : "";
            router.lastActionUrl = window.location.hash;
            console.log(router.lastActionUrl);

            if (router.app.userModel.get("role") === "guest") {
                router.navigate("login", { trigger: true });
            } else {
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