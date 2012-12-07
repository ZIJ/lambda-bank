
module.exports = function(grunt) {
    "use strict";
    // Project configuration.
    grunt.initConfig({
        lint: {
            all: ['grunt.js',
                  'www/js/start.js',
                  'www/js/app.js']
        },
        jshint: {
            options: {
                strict: true,           // strict mode
                browser: true,          // browser environment
                devel: true,            // console, alert, etc
                jquery: true,           // jQuery
                bitwise: true,          // no bitwise operators
                camelcase: true,        // only camelCase and UNDER_SCORE
                curly: true,            // no "braceless" loops
                eqeqeq: true,           // no casting comparisons
                forin: true,            // for..in loops with hasOwnProperty() check
                immed: true,            // no immediate function invokation
                indent: 4,              // tab width
                latedef: true,          // no variable usage before definition
                newcap: true,           // capitalized constructors. FALSE because of iScroll
                noarg: true,            // no arguments.caller and arguments.callee
                noempty: true,          // no empty blocks
                nonew: true,            // no constructor invokation without assigning
                plusplus: true,         // no ++ and --
                quotmark: true,         // consistency of quote style
                regexp: true,           // no unsafe . in regexps
                undef: true,            // no explicitly undefined variables
                unused: true,           // no unused variables
                trailing: true          // no spaces after / in multiline strings
            },
            globals: {
                vchat: true,
                module: true,
                Backbone: true,
                _: true,
                iScroll: true,
                L: true,
                Handlebars: true,
                EventSource: true
            }
        },
        concat: {
            start: {
                src: ['build/header.js.part',
                      'src/scriptLoader.js',
                      'src/login.js',
                      'build/footer.js.part'],
                dest: 'www/js/start.js'
            },
            libs: {
                src: ['src/libs/essential/*.js',
                      'src/libs/*.js'],
                dest: 'www/js/libs.js'
            },
            app: {
                src: ['build/header.js.part',
                      'src/utils/*.js',
                      'src/init.js',
                      'src/models/*.js',
                      'src/views/*.js',
                      'src/app.js',
                      'build/footer.js.part'],
                dest: 'www/js/app.js'
            },
            main: {
                src: ['www/js/libs.min.js',
                      'www/js/app.js'],
                dest: 'www/js/main.js'
            }
        },
        min: {
            libs: {
                src: ['www/js/libs.js'],
                dest: 'www/js/libs.min.js'
            }
        }
    });

    // Default task.
    //grunt.registerTask('default', 'concat:start concat:app concat:main');
    grunt.registerTask('default', 'concat:start concat:app concat:libs min:libs concat:main lint');

};