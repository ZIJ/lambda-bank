define([
    "zepto",

    "backbone",

    "view-models/appViewModel",
    "views/appView",
    "router",

    "backbone.extended"
],
function ($, Backbone, AppViewModel, AppView, Router) {
    var appViewModel = new AppViewModel();

    return new Backbone.Extended.Application({
        root: "",
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
});