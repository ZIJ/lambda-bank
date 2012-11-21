define([
    "zepto",
    "backbone",

    "models/userModel",
    "views/loginView",

    "router",

    "backbone.extended"
],
function ($, Backbone, UserModel, LoginView, Router) {
    var userModel = new UserModel();

    var app = new Backbone.Extended.Application({
        root: "",

        userModel: userModel,

        loginView: new LoginView({
            model: userModel,
            el: $(document.body)
        }),

        router: new Router({

        }),

        start: function () {
            var app = this;
            
            // Trigger the initial route and enable HTML5 History API support (optionally)
            Backbone.history.start({
                root: app.rootDirectory,
                pushState: false
            });
        },

        request: function (params) {
            var app = this,
                guid = app.userModel.get("guid");

            $.ajax({
                type: "POST",
                url: params.url,
                data: $.extend(params.data, {
                    securityToken: guid
                }),
                dataType: "json",
                cache: false,
                contentType: "application/json",
                success: params.success,
                error: function(xhr) {
                    params.error.call(this, xhr);
                    //TODO: dispose viewModel & view
                    app.loginView.render();
                }
            });
        }
    });

    app.loginView.on("loginRequest", function(loginData) {
        app.userModel.login(loginData.login, loginData.password);
    });

    app.userModel.on("change:guid", function(userModel, newGuid) {
        if (!newGuid) return;

        switch (userModel.get("role")) {
            case "admin":

                app.viewModel = new (require("view-models/admin/appViewModelAdmin"))();
                app.view = new (require("views/admin/appViewAdmin"))({
                    model: app.viewModel,
                    el: $(document.body)
                });

                break;
            case "user":

                break;
            default:
                break;
        }
    });

    app.userModel.on("error:login", function() {
        alert("login failed");
    });

    return app;
});