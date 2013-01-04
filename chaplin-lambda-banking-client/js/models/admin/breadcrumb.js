define([
    'underscore',
    'models/base/model'
], function(_, Model) {
    'use strict';

    var Breadcrumb = Model.extend({
        routesRegistry: {
            '': [
                {
                    label: 'Home'
                }
            ],
            'index': [
                {
                    label: 'Home'
                }
            ],
            // Users part
            'users': [
                {
                    label: 'Users'
                }
            ],
            'users/create': [
                {
                    label: 'Users',
                    href: '#users'
                },
                {
                    label: 'Create'
                }
            ],
            'users/:id': [
                {
                    label: 'Users',
                    href: '#users'
                },
                {
                    label: '<%= id %>'
                }
            ],
            'users/:id/edit': [
                {
                    label: 'Users',
                    href: '#users'
                },
                {
                    label: '<%= id %>',
                    href: '#users/<%= id %>'
                },
                {
                    label: 'Edit'
                }
            ],
            'users/:userId/cards/create': [
                {
                    label: 'Users',
                    href: '#users'
                },
                {
                    label: '<%= userId %>',
                    href: '#users/<%= userId %>'
                },
                {
                    label: 'Cards',
                    href: '#users/<%= userId %>'
                },
                {
                    label: 'Create'
                }
            ],
            // Cards part
            'cards': [
                {
                    label: 'Cards'
                }
            ],
            'cards/create': [
                {
                    label: 'Cards',
                    href: '#cards'
                },
                {
                    label: 'Create'
                }
            ],
            'cards/:id': [
                {
                    label: 'Cards',
                    href: '#cards'
                },
                {
                    label: '<%= id %>'
                }
            ],
            'cards/:id/edit': [
                {
                    label: 'Cards',
                    href: '#cards'
                },
                {
                    label: '<%= id %>',
                    href: '#cards/<%= id %>'
                },
                {
                    label: 'Edit'
                }
            ],
            // Settings part
            'settings': [
                {
                    label: 'Settings'
                }
            ]
        },

        defaults: {
            value: null // Array Of {label, [href]}
        },

        initialize: function(attributes, options) {
            var model = this;

            Breadcrumb.__super__.initialize.apply(model, arguments);
        },

        setByRoute: function(route, params) {
            params || (params = {});

            var model = this,
                rowValue = model.routesRegistry[route.pattern],
                newValue = [],
                i = 0;

            rowValue || (rowValue = []);

            while (i < rowValue.length - 1) {
                var currParamInfo = rowValue[i];

                newValue.push({
                    label: _.template(currParamInfo.label, params),
                    href: _.template(currParamInfo.href, params)
                });

                i++;
            }

            if (rowValue.length > 0) {
                newValue.push({
                    label: _.template(rowValue[i].label, params)
                });
            }

            model.set({
                value: newValue
            });
        }

    });

    return Breadcrumb;
});