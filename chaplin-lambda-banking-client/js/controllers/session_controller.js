define([
    'underscore',
    'chaplin',
    'lib/utils',
    'models/user',
    'lib/services/banking_provider',
    'views/login_view'
], function(_, Chaplin, utils, User, BankingProvider, LoginView) {
    'use strict';

    var mediator = Chaplin.mediator;

    var SessionController = (function(_super) {

        utils.extends(SessionController, _super);

        function SessionController() {
            var controller = this;

            _.bindAll(controller, "logout", "serviceProviderSession", "triggerLogin");

            SessionController.__super__.constructor.apply(controller, arguments);
        }

        _.extend(SessionController, {
            serviceProviders: {
                banking: new BankingProvider()
            }
        });

        _.extend(SessionController.prototype, {

            serviceProviderName: null,

            loginStatusDetermined: false,

            loginView: null,

            initialize: function() {
                var controller = this;

                // Login flow events
                controller.subscribeEvent('serviceProviderSession', controller.serviceProviderSession);

                // Handle login
                controller.subscribeEvent('logout', controller.logout);
//                controller.subscribeEvent('userData', controller.userData);

                // Handler events which trigger an action
                controller.subscribeEvent('!showLogin', controller.showLoginView);
                controller.subscribeEvent('!login', controller.triggerLogin);
                controller.subscribeEvent('!logout', controller.triggerLogout);

                // Determine the logged-in state
                controller.getSession();
            },

            loadServiceProviders: function() {
                _.each(SessionController.serviceProviders, function (serviceProvider) {
                    serviceProvider.load();
                });
            },

            createUser: function(userData) {
                mediator.user = new User(userData);
            },

            getSession: function() {
                this.loadServiceProviders();

                _.each(SessionController.serviceProviders, function (serviceProvider) {
                    serviceProvider.done(serviceProvider.getLoginStatus);
                });
            },

            showLoginView: function() {
                var controller = this;

                if (controller.loginView) {
                    return;
                }
                controller.loadServiceProviders();
                controller.loginView = new LoginView({
                    serviceProviders: SessionController.serviceProviders
                });
            },

            triggerLogin: function(serviceProviderName, loginData) {
                var serviceProvider = SessionController.serviceProviders[serviceProviderName];
                if (!serviceProvider.isLoaded()) {
                    mediator.publish('serviceProviderMissing', serviceProviderName);
                    return;
                }

                mediator.publish('loginAttempt', serviceProviderName);

                serviceProvider.triggerLogin(loginData);
            },

            // Handler for the global serviceProviderSession event
            serviceProviderSession: function(session) {
                var controller = this;

                controller.serviceProviderName = session.provider.name;
                controller.disposeLoginView();
                session.id = session.userId;
                session.role = session.userRole;
                delete session.userId;
                delete session.userRole;
                controller.createUser(session);
                controller.publishLogin();
            },

            publishLogin: function() {
                this.loginStatusDetermined = true;

                mediator.publish('login', mediator.user);
                mediator.publish('loginStatus', true);
            },

            triggerLogout: function(serviceProviderName) {
                var serviceProvider = SessionController.serviceProviders[serviceProviderName];
                if (!serviceProvider.isLoaded()) {
                    mediator.publish('serviceProviderMissing', serviceProviderName);
                    return;
                }

                serviceProvider.triggerLogout();
            },

            logout: function() {
                var controller = this;

                controller.loginStatusDetermined = true;
                controller.disposeUser();
                controller.serviceProviderName = null;
                controller.showLoginView();

                mediator.publish('loginStatus', false);
            },

//            userData: function(data) {
//                mediator.user.set(data);
//            },

            disposeLoginView: function() {
                var controller = this;

                if (!controller.loginView) {
                    return;
                }
                controller.loginView.dispose();
                controller.loginView = null;
            },

            disposeUser: function() {
                if (!mediator.user) {
                    return;
                }
                mediator.user.dispose();
                mediator.user = null;
            }
        });

        return SessionController;

    })(Chaplin.Controller);

    return SessionController;
});
