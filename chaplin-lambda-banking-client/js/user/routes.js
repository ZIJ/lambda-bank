define(function() {
    'use strict';

    // The routes for the application. This module returns a function.
    // `match` is match method of the Router
    var routes = function(match) {
        match('', 'cards#index');
        match('index', 'cards#index');

        match('cards', 'cards#index');


        match('settings', 'settings#index');

    };

    return routes;
});
