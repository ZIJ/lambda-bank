define([
    "jquery",

    "backbone",
    "models/appModel",
    "views/appView"
],
function ($, Backbone, AppModel, AppView) {
    return new (function () {
        this.model = new AppModel();
        this.view = new AppView({
            model: this.model,
            el: $(document.body)
        });
        this.start = function () {
            this.model.load();
        };
    })()
});