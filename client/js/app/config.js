require.config({
    deps: ["main"],
    paths: {
        // JavaScript folders
        libs: "../libs",
        plugins: "../plugins",

        // Libraries
        jquery: "../libs/jquery-1.8.2.min",
        lodash: "../libs/lodash.min",
        backbone: "../libs/backbone-min",
        handlebars: "../libs/handlebars"
    },
    shim: {
        // Backbone library depends on lodash and jQuery
        backbone: {
            deps: ["lodash", "jquery"],
            exports: "Backbone"
        },
        handlebars: {
            exports: "Handlebars"
        }
    }

});