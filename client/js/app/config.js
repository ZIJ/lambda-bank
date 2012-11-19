require.config({
    deps: ["main"],
    paths: {
        // JavaScript folders
        libs: "../libs",
        plugins: "../libs/plugins",

        // Libraries
        jquery: "../libs/jquery-1.8.2.min",
		zepto: "../libs/zepto.min",
        lodash: "../libs/lodash.min",
        backbone: "../libs/backbone-min",		
        handlebars: "../libs/handlebars",

        // Plugins
        "backbone.extended": "backbone.extended"
    },
    shim: {
        jquery: {		
			init: function () {
				this.jQuery.noConflict();
			}
		},
		zepto: {
			deps: ["jquery"]
		},
        backbone: {
            deps: ["lodash", "zepto"],
            exports: "Backbone",
			init: function (_, $) {
				this.Backbone.setDomLibrary($);
			}
        },
        handlebars: {
            exports: "Handlebars"
        },
        "backbone.extended": {
            deps: ["backbone", "jquery"]
        }
    }
});