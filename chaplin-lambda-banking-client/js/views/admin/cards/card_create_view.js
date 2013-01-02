define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/cards/card_create.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;

    var CardCreateView = View.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onSaveClick', 'onCancelClick'); // 'onDeleteClick'

            CardCreateView.__super__.initialize.apply(view, arguments);

            view.delegate('click', '.btn.save', view.onSaveClick);
            view.delegate('click', '.btn.cancel', view.onCancelClick);
        },

        onSaveClick: function() {
            var view = this,
                options = {
                    attributesToSave: {
                        firstName: view.$('.firstName').val(),
                        lastName: view.$('.lastName').val(),
                        passportNumber: view.$('.passportNumber').val(),
                        address: view.$('.address').val()
                    }
                };

            mediator.publish('!saveUser', options);
        },

        onCancelClick: function() {
            var view = this;

            mediator.publish('!router:route', 'users' + (view.model.id ? '/' + view.model.id : ''));
        }
    });


    return CardCreateView;
});

