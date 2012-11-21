define([
    "zepto",
    "backbone",

    "models/userModel",
    "views/loginView",

    "view-models/appViewModel",
    "views/appView",
    "router",

    "backbone.extended"
],
function ($, Backbone, UserModel, LoginView, AppViewModel, AppView, Router) {
    var userModel = new UserModel(),
        appViewModel = new AppViewModel();

    var app = new Backbone.Extended.Application({
        root: "",

        userModel: userModel,

        loginView: new LoginView({
            model: userModel,
            el: $(document.body)
        }),

        viewModel: appViewModel,
        view: new AppView({
            model: appViewModel,
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

            app.loginView.render();

            app.viewModel.load().then(function() {
                
            });
        }
    });

    app.loginView.on("loginRequest", function(loginData) {
        app.userModel.login(loginData.login, loginData.password);
    });

    app.userModel.on("change:guid", function(userModel, newGuid) {
        if (!newGuid) return;
        
        var appViewModel,
            appView,
            router;

        switch (userModel.get("role")) {
            case "admin":
                appViewModel = new AppViewModelAdmin();
                appView = new AppViewAdmin({
                    model: appViewModel,
                    el: $(document.body)
                });
                router = new RouterAdmin();
                break;
            case "user":
                
                break;
            default:
                break;
        }
    });

    return app;
});