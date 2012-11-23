define([
    "jquery",
    "lodash",
    "backbone",

    "models/userModel",
    "views/loginView",

    "router",

    "backbone.extended"
],
function ($, _, Backbone, UserModel, LoginView, Router) {
    var userModel = new UserModel();

    var app = new Backbone.Extended.Application({
        root: "",

        userModel: userModel,
        
        loginView: null,
        $loginViewEl: null,
        
        view: null,
        $viewEl: null,
        
        viewModel: null,

        router: null,

        start: function() {
            var app = this;

            console.log("app start");

            app.loginView = new LoginView({
                model: userModel,
                el: app.$loginViewEl
            });
            
            app.loginView.on("loginRequest", function (loginData) {
                app.userModel.login(loginData.login, loginData.password);
            });
            
            app.router = new Router({
                app: app
            });

            // Trigger the initial route and enable HTML5 History API support (optionally)
            Backbone.history.start({
                root: app.rootDirectory,
                pushState: false
            });

        },

        request: function(params) {
            var app = this,
                guid = app.userModel.get("guid");

            $.ajax({
                type: "POST",
                url: params.url,
                data: JSON.stringify(_.extend({}, params.data, {
                    securityToken: guid
                })),
                dataType: "json",
                cache: false,
                contentType: "application/json",
                success: params.success,
                error: function(xhr) {
                    params.error.call(this, xhr);
                    app.router.navigate("login", { trigger: true });
                }
            });
        }
    });
    
    app.userModel.on("change:guid", function(userModel, newGuid) {
        if (!newGuid) return;

        function anyway() {
            if (app.router.lastActionUrl) {
                app.router.navigate(app.router.lastActionUrl, { trigger: true });
            } else {
                app.router.navigate("", { trigger: true });
            }
        }

        switch (userModel.get("role")) {
            case "admin":

                require(["view-models/admin/appViewModelAdmin", "views/admin/appViewAdmin"], function(AppViewModelAdmin, AppViewAdmin) {
                    app.viewModel = new AppViewModelAdmin();
                    app.view = new AppViewAdmin({
                        model: app.viewModel,
                        el: app.$viewEl
                    });
                    anyway();
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
        //app.router.navigate("login", { trigger: true });
    });

    return app;
});