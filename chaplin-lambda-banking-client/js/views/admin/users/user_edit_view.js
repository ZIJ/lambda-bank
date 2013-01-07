define([
    'underscore',
    'chaplin',
    'views/base/view',
    'text!templates/admin/users/user_edit.hbs'
], function(_, Chaplin, View, template) {
    'use strict';

    var mediator = Chaplin.mediator;
    
    var weight = [7,3,1];
    var digits = /^\d$/;
    var letters = /^[a-z]$/;
    function numerize(str) {
      var chars = str.toLowerCase().split('');
      return chars.map(function(chr){
        if (letters.test(chr)) {
          return chr.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
        } else if (digits.test(chr)) {
          return chr; 
        } else {
          throw new Error('unexpected character'); 
        }
      });
    }

    var UserEditView = View.extend({

        template: template,

        className: 'span10',
        container: 'div.row-fluid',
        autoRender: true,

        // Expects the serviceProviders in the options.
        initialize: function(options) {
            var view = this;

            _.bindAll(view, 'onSaveClick', 'onCancelClick'); // 'onDeleteClick'

            UserEditView.__super__.initialize.apply(view, arguments);

            view.delegate('submit', 'form', view.onSaveClick);
            view.delegate('click', '.btn.cancel', view.onCancelClick);
            view.modelBind('dispose', function(){
                $('.popover').remove();
            });

//            view.delegate('click', '.btn.delete', view.onDeleteClick);

//            view.modelBind('dispose', view.modelDisposeHandler);
        },

//        onDeleteClick: function() {
//            var view = this;
//
//            view.model.destroy();
//        },

        onSaveClick: function(e) {
            e.preventDefault();
            var view = this,
                options = {
                    attributesToSave: {
                        firstName: view.$('.firstName').val(),
                        lastName: view.$('.lastName').val(),
                        passportNumber: view.$('.passportNumber').val(),
                        address: view.$('.address').val()
                    }
                };


            var passport_input = $('input[data-validate="passport"]');
            console.log(passport_input);
            passport_input.popover({title:function(){return '';}});
            var val = passport_input.val();
            var re = new RegExp(passport_input.prop('pattern'));
            var result = re.exec(val);
            if(passport_input.is(':valid'))
            {
                var checksumm = Number(result[5]);
                var summ = 0;
                var multiplyer = 1;
                var numbers = numerize(val);
                for (var i = 0; i < numbers.length - 1; i++) {
                    multiplyer = weight[i%weight.length];
                    summ += numbers[i] * multiplyer;
                }
                var result = summ%10;
                if ( result !== checksumm )
                {
                    
                    passport_input.popover('show');
                    passport_input.on('input',function(){
                        passport_input.popover('hide'); //test that shit
                    });
                    return;
                }
                else 
                {
                    passport_input.popover('hide');
                }
            }

            mediator.publish('!saveUser', options);
        },

        onCancelClick: function() {
            var view = this;

            mediator.publish('!router:route', 'users' + (view.model.id ? '/' + view.model.id : ''));
        }

//        modelDisposeHandler: function() {
//            mediator.publish('!router:route', 'users');
//        }
    });


    return UserEditView;
});

