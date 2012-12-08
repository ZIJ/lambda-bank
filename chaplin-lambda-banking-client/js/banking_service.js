(function ($, _, Backbone) {
    var root = this;

    var lambdaBanking = root.lambdaBanking = new ((function() {

        function Banking() {
            var service = this;

            _.bindAll(service, 'loginStatusDaemonHandler');
        }

        _(Banking.prototype).extend(Backbone.Events, {

            baseUrl: 'http://lambda-bank.drs-cd.com/WebService.svc/',

            accessToken: null,

            init: function() {
                var service = this;

            },

            dispose: function() {
                var service = this;

                // TODO: maybe wrap with try-catch
                clearInterval(service._loginStatusDaemonIntervalId);
            },

            startLoginStatusDaemon: function() {
                var service = this;

                if (!service._loginStatusDaemonIntervalId) {
                    service._loginStatusDaemonIntervalId = setInterval(service.loginStatusDaemonHandler, 5000);
                }
            },

            stopLoginStatusDaemon: function() {
                var service = this;

                if (service._loginStatusDaemonIntervalId) {
                    clearInterval(service._loginStatusDaemonIntervalId);
                    service._loginStatusDaemonIntervalId = null;
                }
            },

            loginStatusDaemonHandler: function() {
                var service = this;

                service.getLoginStatus(function(response) {
                    var authResponse = response.authResponse;
                    if (!authResponse) {
                        service.trigger('auth.logout');
                    }
                });
            },

            request: function(params) {
                var service = this;

                $.ajax({
                    type: 'POST',
                    url: service.baseUrl + params.url,
                    data: (function () {
                        if (!service.accessToken) return JSON.stringify(params.data);
                        return JSON.stringify(_.extend({}, params.data, {
                            securityToken: service.accessToken
                        }));
                    })(),
                    dataType: 'json',
                    cache: false,
                    contentType: 'application/json',
                    success: function(response) {
                        params.success.call(this, response.Response);
                    },
                    error: function(xhr) {
                        params.error.call(this, xhr);
                    }
                });
            },

            login: function(loginData, callback) {
                var service = this;

                service.request({
                    url: 'login',
                    data: {
                        login: loginData.login,
                        password: loginData.password
                    },
                    success: function(response) {
                        service.accessToken = response.AuthenticationToken;
                        callback({
                            authResponse: response
                        });
                        service.startLoginStatusDaemon();
                    },
                    error: function(jqXHR) {
                        service.accessToken = '';
                        callback(jqXHR);
                    }
                });
            },

            logout: function(callback) {
                var service = this;

                service.request({
                    url: 'logout',
                    success: function(response) {
                        service.accessToken = '';
                        service.stopLoginStatusDaemon();
                        callback();
                    },
                    error: function(jqXHR) {
                        service.accessToken = '';
                        service.stopLoginStatusDaemon();
                        alert('Error during logging out request');
                        callback();
                    }
                });
            },

            getLoginStatus: function(callback) {
                var service = this;

                service.request({
                    url: 'verifyToken',
                    success: function(response) {
                        service.accessToken = response.AuthenticationToken;
                        callback({
                            authResponse: response
                        });
                        service.startLoginStatusDaemon();
                    },
                    error: function(jqXHR) {
                        service.accessToken = '';
                        service.stopLoginStatusDaemon();
                        callback(jqXHR);
                    }
                });
            },

            api: function(params) {
                var service = this;

                service.request({
                    url: params.url,
                    data: params.data,
                    success: function(response) {
                        params.success.call(this, response);
                    },
                    error: function(jqXHR) {
                        service.accessToken = '';
                        service.stopLoginStatusDaemon();
                        service.trigger('auth.logout');
                    }
                });
            }


        });

        return Banking;

    })())();


})($, _, Backbone);