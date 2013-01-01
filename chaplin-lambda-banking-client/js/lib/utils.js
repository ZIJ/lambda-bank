define([
    'underscore',
    'chaplin'
], function(_, Chaplin) {
    'use strict';

    // Application-specific utilities
    // ------------------------------

    // Delegate to Chaplin’s utils module
    var utils = Chaplin.utils.beget(Chaplin.utils);

    _(utils).extend({
        extends: function(child, parent) {
            for (var key in parent) {
                if (parent.hasOwnProperty(key)) child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        },

        sessionStorage: (function() {
            if (window.sessionStorage && sessionStorage.getItem && sessionStorage.setItem && sessionStorage.removeItem) {
                return function(key, value) {
                    if (typeof value === 'undefined') {
                        value = sessionStorage.getItem(key);
                        if ((value != null) && value.toString) {
                            return value.toString();
                        } else {
                            return value;
                        }
                    } else {
                        sessionStorage.setItem(key, value);
                        return value;
                    }
                };
            } else {
                return function(key, value) {
                    if (typeof value === 'undefined') {
                        return utils.getCookie(key);
                    } else {
                        utils.setCookie(key, value);
                        return value;
                    }
                };
            }
        })(),

        sessionStorageRemove: (function() {
            if (window.sessionStorage && sessionStorage.getItem && sessionStorage.setItem && sessionStorage.removeItem) {
                return function(key) {
                    return sessionStorage.removeItem(key);
                };
            } else {
                return function(key) {
                    return utils.expireCookie(key);
                };
            }
        })(),

        getCookie: function(key) {
            var pair, pairs, val, _i, _len;
            pairs = document.cookie.split('; ');
            for (_i = 0, _len = pairs.length; _i < _len; _i++) {
                pair = pairs[_i];
                val = pair.split('=');
                if (decodeURIComponent(val[0]) === key) {
                    return decodeURIComponent(val[1] || '');
                }
            }
            return null;
        },

        setCookie: function(key, value, options) {
            var expires, getOption, payload;
            if (options == null) {
                options = {};
            }
            payload = "" + (encodeURIComponent(key)) + "=" + (encodeURIComponent(value));
            getOption = function(name) {
                if (options[name]) {
                    return "; " + name + "=" + options[name];
                } else {
                    return '';
                }
            };
            expires = options.expires ? "; expires=" + (options.expires.toUTCString()) : '';
            return document.cookie = [payload, expires, getOption('path'), getOption('domain'), getOption('secure')].join('');
        },

        expireCookie: function(key) {
            return document.cookie = "" + key + "=nil; expires=" + ((new Date).toGMTString());
        },


        loadLib: function(url, success, error, timeout) {
            var head, onload, script, timeoutHandle;
            if (timeout == null) {
                timeout = 7500;
            }
            head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
            script = document.createElement('script');
            script.async = 'async';
            script.src = url;
            onload = function(_, aborted) {
                if (aborted == null) {
                    aborted = false;
                }
                if (!(aborted || !script.readyState || script.readyState === 'complete')) {
                    return;
                }
                clearTimeout(timeoutHandle);
                script.onload = script.onreadystatechange = script.onerror = null;
                if (head && script.parentNode) {
                    head.removeChild(script);
                }
                script = void 0;
                if (success && !aborted) {
                    success();
                }
            };
            script.onload = script.onreadystatechange = onload;
            script.onerror = function() {
                onload(null, true);
                if (error) {
                    error();
                }
            };
            timeoutHandle = setTimeout(script.onerror, timeout);
            head.insertBefore(script, head.firstChild);
        },

        deferMethods: function(options) {
            var deferred, func, host, methods, methodsHash, name, onDeferral, target, _i, _len;
            deferred = options.deferred;
            methods = options.methods;
            host = options.host || deferred;
            target = options.target || host;
            onDeferral = options.onDeferral;
            methodsHash = {};
            if (typeof methods === 'string') {
                methodsHash[methods] = host[methods];
            } else if (methods.length && methods[0]) {
                for (_i = 0, _len = methods.length; _i < _len; _i++) {
                    name = methods[_i];
                    func = host[name];
                    if (typeof func !== 'function') {
                        throw new TypeError("utils.deferMethods: method " + name + " notfound on host " + host);
                    }
                    methodsHash[name] = func;
                }
            } else {
                methodsHash = methods;
            }
            _.each(methodsHash, function (func, name) {
                if (typeof func === 'function') {
                    target[name] = utils.createDeferredFunction(deferred, func, target, onDeferral);
                }
            });
        },

        createDeferredFunction: function(deferred, func, context, onDeferral) {
            if (context == null) {
                context = deferred;
            }
            return function() {
                var args;
                args = arguments;
                if (deferred.state() === 'resolved') {
                    return func.apply(context, args);
                } else {
                    deferred.done(function() {
                        return func.apply(context, args);
                    });
                    if (typeof onDeferral === 'function') {
                        return onDeferral.apply(context);
                    }
                }
            };
        }
    });

    return utils;
});
