define([
    "app",

    "backbone",
    "jquery",

    "backbone.extended"
],
function (app, Backbone, $, UserModel) {
    return Backbone.ViewModel.Extended.extend({
        disposable: [],

        defaults: {
            //usersUrl: "http://lambda-bank.drs-cd.com/WebService.svc/user/users/get",
        },

        initialize: function() {
            var viewModel = this;



        },

        load: function() {
            var def = new $.Deferred(),
                viewModel = this;

            app.request({
                url: "http://lambda-bank.drs-cd.com/WebService.svc/user/users/get",
                data: {

                },
                success: function () {
                    def.resolve();
                },
                error: function () {
                    def.reject();
                }
            });

            return def.promise();
        }
    });
});