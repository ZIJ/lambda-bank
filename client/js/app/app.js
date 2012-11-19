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

            app.viewModel.load().then(function () {
                // Trigger the initial route and enable HTML5 History API support (optionally)
                Backbone.history.start({
                    root: app.rootDirectory,
                    pushState: false
                });
            });
        }
    });

    app.loginView.on("loginRequest", function (loginData) {
        app.userModel.login(loginData.login, loginData.password);
    });



    return app;
});