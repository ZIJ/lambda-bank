define([
    'jquery',
    'underscore',
    'chaplin',
    'views/layout',
    'controllers/session_controller'
], function($, _, Chaplin, Layout, SessionController) {
    'use strict';

    var mediator = Chaplin.mediator;

    // The application object
    var BankingApplication = Chaplin.Application.extend({

        // Set your application name here so the document title is set to
        // “Controller title – Site title” (see Layout#adjustTitle)
        title: 'Lambda-Banking Application',

        // Links to some of persistent controllers
        headerController: null,
        navigationController: null,

        initialize: function() {
            var app = this;

            _(app).bindAll('loginHandler', 'logoutHandler', 'showAlert');

            // Call the parent constructor.
            Chaplin.Application.prototype.initialize.apply(app, arguments);
            //console.debug 'BankingApplication#initialize'

            // Initialize core components
            app.initLayout();
            app.initMediator();

            // Application-specific scaffold
            app.initControllers();

            // Register all routes and start routing
            //app.initRouter(routes, { pushState: false , root: '/' });

            mediator.subscribe('login', app.loginHandler);
            mediator.subscribe('logout', app.logoutHandler);

            mediator.subscribe('!alert', app.showAlert);

            // Freeze the application instance to prevent further changes
            //if (typeof Object.freeze === "function") Object.freeze(app);
        },

        // Override standard layout initializer
        // ------------------------------------
        initLayout: function() {
            var app = this;

            // Use an application-specific Layout class. Currently this adds
            // no features to the standard Chaplin Layout, it’s an empty placeholder.
            app.layout = new Layout({title: app.title});
        },

        // Instantiate common controllers
        // ------------------------------
        initControllers: function() {
            // These controllers are active during the whole application runtime.
            // You don’t need to instantiate all controllers here, only special
            // controllers which do not to respond to routes. They may govern models
            // and views which are needed the whole time, for example header, footer
            // or navigation views.
            // e.g. new NavigationController()

            new SessionController();

            //mediator.publish("!startupController", "session");
        },

        // Create additional mediator properties
        // -------------------------------------
        initMediator: function() {
            // Create a user property
            mediator.user = null;
            // Add additional application-specific properties and methods
            // Seal the mediator
            mediator.seal();
        },

        loginHandler: function() {
            var app = this;

            switch (mediator.user.get('role')) {
                case 'admin':
                    require(['admin/routes', 'controllers/admin/header_controller', 'controllers/admin/navigation_controller'], function(routesAdmin, HeaderControllerAdmin, NavigationControllerAdmin) {
                        app.headerController = new HeaderControllerAdmin();

                        app.navigationController = new NavigationControllerAdmin();

                        app.initDispatcher({
                            controllerPath: 'controllers/admin/'
                        });

                        app.initRouter(routesAdmin, { pushState: false , root: '/' });
                    });
                    break;
                case 'user':
                    // TODO: implementation needed

                    break;
            }
        },

        logoutHandler: function() {
            var app = this;

            if (app.dispatcher) {
                app.dispatcher.dispose();
                app.dispatcher = null;
            }
            if (app.router) {
                app.router.dispose();
                app.router = null;
            }
            if (app.headerController) {
                app.headerController.dispose();
                app.headerController = null;
            }
            if (app.navigationController) {
                app.navigationController.dispose();
                app.navigationController = null;
            }
        },

        // TODO: shouldn't be here
        // options -> { type, title, text, action, actionCallback, cancelCallback }
        showAlert: function(options) {
            var $fader = $('.fader');

            options.title || (options.title = 'Attention!');

            var $alertBox = $fader.find('.alert');
            if ($alertBox.length === 0) {
                $fader.append(	'<div class="alert alert-block' + (options.type ? ' alert-' + options.type : '') + ' fade in">' +
                    '<button class="close cancel" data-dismiss="alert">×</button>' +
                    '<h4 class="alert-heading">' + options.title + '</h4>' +
                    '<p>' + options.text + '</p>' +
                    (options.action ? '<p>'+
                        '<button type="button" class="btn btn-danger action">' + options.action + '</button>'+
                        ' <button type="button" class="btn cancel">Cancel</button></p>' : '') + '</div>');
                $alertBox = $fader.find('.alert');
            }

            $alertBox.css({
                'display': 'inline-block'
            });

            function close() {
                $alertBox.remove();
                $fader.stop().fadeOut();
            }

            function callback(func) {
                ($.isFunction(func) ? func : $.noop)();
            }

            $fader.find('.action').click(function(e) {
                e.stopPropagation();
                e.preventDefault();
                close();
                callback(options.actionCallback);
            });

            $fader.find('.cancel').click(function(e) {
                e.stopPropagation();
                e.preventDefault();
                close();
                callback(options.cancelCallback);
            });

            $fader.stop().fadeIn();

            if (options.type === 'success' || !options.action) {
                $fader.click(function() {
                    close();
                });
            } else {
                $fader.off('click');
            }
        }

// Example:
//        mediator.publish('!alert', {
//            type: 'error',
//            title: 'Error',
//            text: 'Smth gone wrong',
//            action: 'Ok',
//            actionCallback: function() {},
//            cancelCallback: function() {}
//        });
        
    });

    return BankingApplication;
});
