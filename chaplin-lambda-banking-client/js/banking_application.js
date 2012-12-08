define([
    'chaplin',
    'views/layout',
    'routes',
    'controllers/session_controller'
], function(Chaplin, Layout, routes, SessionController) {
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

            _(app).bindAll("loginHandler", "logoutHandler");

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

            mediator.subscribe("login", app.loginHandler);
            mediator.subscribe("logout", app.logoutHandler);


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
                    require(['controllers/admin/header_controller'], function(HeaderControllerAdmin) {
                        app.headerController = new HeaderControllerAdmin();

                        require(['controllers/admin/navigation_controller'], function(NavigationControllerAdmin) {
                            app.navigationController = new NavigationControllerAdmin();

                            app.initDispatcher({
                                controllerPath: 'controllers/admin/'
                            });

                            app.initRouter(routes, { pushState: false , root: '/' });
                        });
                    });
                    break;
                case 'user':

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
        }
        
    });

    return BankingApplication;
});
