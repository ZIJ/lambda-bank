define([
    'chaplin',
    'views/layout',
    'routes',
    'controllers/session_controller'
], function(Chaplin, Layout, routes, SessionController) {
    'use strict';

    // The application object
    var BankingApplication = Chaplin.Application.extend({

        // Set your application name here so the document title is set to
        // “Controller title – Site title” (see Layout#adjustTitle)
        title: 'Lambda-Banking Application',

        initialize: function() {
            // Call the parent constructor.
            Chaplin.Application.prototype.initialize.apply(this, arguments);
            //console.debug 'BankingApplication#initialize'

            // Initialize core components
            this.initDispatcher();
            this.initLayout();
            this.initMediator();

            // Application-specific scaffold
            this.initControllers();

            // Register all routes and start routing
            this.initRouter(routes, { pushState: false , root: '/' });

            // Freeze the application instance to prevent further changes
            if (Object.freeze) Object.freeze(this);
        },

        // Override standard layout initializer
        // ------------------------------------
        initLayout: function() {
            // Use an application-specific Layout class. Currently this adds
            // no features to the standard Chaplin Layout, it’s an empty placeholder.
            this.layout = new Layout({title: this.title});
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
        },

        // Create additional mediator properties
        // -------------------------------------
        initMediator: function() {
            // Create a user property
            Chaplin.mediator.user = null;
            // Add additional application-specific properties and methods
            // Seal the mediator
            Chaplin.mediator.seal();
        }
    });

    return BankingApplication;
});
