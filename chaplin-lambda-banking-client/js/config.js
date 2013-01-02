require.config({
    deps: ["main"],
    //baseUrl: '../js/',
    paths: {
        jquery: 'vendor/jquery-1.8.3',
        underscore: 'vendor/underscore-1.4.2',
        backbone: 'vendor/backbone-0.9.2',
        handlebars: 'vendor/handlebars-1.0.rc.1',
        text: 'vendor/require-text-2.0.3',
        chaplin: 'vendor/chaplin-1.0.0-pre-59cac06',
        moment: 'vendor/moment-1.7.2',
        pikaday: 'vendor/jquery.pikaday'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        pikaday: ['jquery']
    }
});
