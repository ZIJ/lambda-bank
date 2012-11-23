require([
    "app",
    "zepto"
],
function (app, $) {
    $(function () {
        app.$loginViewEl = $("#login-view");
        app.$viewEl = $("#app-view");
        app.start();
    });
});