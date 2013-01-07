define(function() {
    'use strict';

    // The routes for the application. This module returns a function.
    // `match` is match method of the Router
    var routes = function(match) {
        match('', 'users#index');
        match('index', 'users#index');

        match('users', 'users#index');
        match('users/create', 'users#create');
        match('users/:id', 'users#show');
        match('users/:id/edit', 'users#edit');

        match('users/:userId/cards', 'cards#index');    // implemented but not used
        match('users/:userId/cards/create', 'cards#create');

        match('cards', 'cards#index');
//        match('cards/create', 'cards#create');    // NOTE: not needed
//        match('cards/:id', 'cards#show');    // NOTE: not needed (implemented in controller, but there is no CardView)
//        match('cards/:id/edit', 'cards#edit');    // NOTE: not needed

        match('accounts', 'accounts#index');
        match('accounts/:id', 'accounts#show');


        match('settings', 'settings#index');

    };

    return routes;
});
