define([
    "jquery",

    "backbone",
    "models/app",
    "views/app"
],
function ($, Backbone, AppModel, AppView) {
    return new (function () {
        this.model = new AppModel();
        this.view = new AppView({
            model: this.model,
            el: $("#main")
        });
        this.start = function () {
            this.model.load();
        };
    })()
});