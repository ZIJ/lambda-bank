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
                data: _.extend({}, params.data, {
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
    
    app.userModel.on("change:guid", function(userModel, newGuid) {
        if (!newGuid) return;

        switch (userModel.get("role")) {
            case "admin":

                app.viewModel = new (require("view-models/admin/appViewModelAdmin"))();
                app.view = new (require("views/admin/appViewAdmin"))({
                    model: app.viewModel,
                    el: app.$viewEl
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