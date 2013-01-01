define([
    'underscore',
    'chaplin',
    'lib/utils',
    'views/base/view',
    'text!templates/login.hbs'
], function(_, Chaplin, utils, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var LoginView = View.extend({
        template: template,
        className: 'container login-page',
        container: '#page-container',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, "loginFailHandler", "loginSuccessfulHandler", "onLoginErrorCloseClick");

            LoginView.__super__.initialize.apply(view, arguments);

            view.initButtons(options.serviceProviders);

            view.subscribeEvent("loginFail", view.loginFailHandler);
            view.subscribeEvent("loginSuccessfulHandler", view.loginSuccessfulHandler);

            view.delegate('click', ".alert-error > .close", view.onLoginErrorCloseClick);
        },

        initButtons: function(serviceProviders) {
            var view = this,
                buttonSelector = '.btn[type="submit"]';

            _.each(serviceProviders, function (serviceProvider, serviceProviderName) {
                var loginHandler = _(view.loginWith).bind(view, serviceProviderName, serviceProvider);
                view.delegate('click', buttonSelector, loginHandler);

//                    // TODO: we possibly need to manually clear handlers from deferred on view disposal
//                    var loaded = _(view.serviceProviderLoaded).bind(view, serviceProviderName, serviceProvider);
//                    serviceProvider.done(loaded);
//                    var failed = _(view.serviceProviderFailed).bind(view, serviceProviderName, serviceProvider);
//                    serviceProvider.fail(failed);

                // NOTE: hard-coded only iteration
                return false;
            });
        },

        loginWith: function(serviceProviderName, serviceProvider, e) {
            e.preventDefault();
            if (!serviceProvider.isLoaded()) {
                return;
            }

            var view = this;

//                mediator.publish('login:pickService', serviceProviderName);

            mediator.publish('!login', serviceProviderName, {
                login: view.$("#username").val(),
                password: view.$("#password").val()
            });
        },

        loginFailHandler: function () {
            var view = this;

            view.$(".alert-error").show();
        },

        loginSuccessfulHandler: function () {
            var view = this;

            view.$(".alert-error").hide();
        },

        onLoginErrorCloseClick: function() {
            var view = this;

            view.$(".alert-error").hide();
        }

//        ,
//        serviceProviderLoaded: function(serviceProviderName) {
//            this.$("." + serviceProviderName).removeClass('service-loading');
//        },
//
//        serviceProviderFailed: function(serviceProviderName) {
//            this.$("." + serviceProviderName)
//                .removeClass('service-loading')
//                .addClass('service-unavailable')
//                .attr('disabled', true)
//                .attr('title', 'Error connecting. Please check whether you are blocking ' + ("" + (utils.upcase(serviceProviderName)) + "."));
//        }
    });

    return LoginView;
});