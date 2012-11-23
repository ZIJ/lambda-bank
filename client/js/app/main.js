require([
    "app",
    "zepto"
],
function (app, $) {
    $(function () {
        var $mainEl = $("#app-view");

        app.$loginViewEl = $mainEl; //$("#login-view");
        app.$viewEl = $mainEl; //$("#app-view");
        app.start();
    });
});