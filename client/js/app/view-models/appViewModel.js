define([
    "backbone",
    "zepto",
    "models/userModel",

    "backbone.extended"
],
function (Backbone, $, UserModel) {
    return Backbone.ViewModel.Extended.extend({
        disposable: [],

        defaults: {
            //usersUrl: "http://lambda-bank.drs-cd.com/WebService.svc/user/users/get",
        },

        initialize: function() {
            var viewModel = this;



        },

        load: function() {
            var viewModel = this;


        }
    });
});