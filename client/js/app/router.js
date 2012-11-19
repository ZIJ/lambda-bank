define([
    "backbone"
],
function (Backbone) {
    return Backbone.Router.extend({
        routes: {
            "": "index"
        },

        initialize: function (options) {

        },

        index: function () {
            var router = this;

            //router.model.resetState({
            //    mode: "channel",
            //    data: {
            //        channelIndex: 0
            //    }
            //});
        }
    });

    //Backbone.Model.extend({
    //    defaults: {
    //        str: "appModel",
    //        user: null
    //    },

    //    initialize: function () {
    //        var app = this;
    //        var user = new UserModel({app: app});
    //        this.set("user", user);
    //        this.load();
    //    },

    //    load: function () {
    //        var model = this;

    //        model.trigger("loaded");
    //    }
    //});
});