define([
    "backbone"
],
function (Backbone) {
    return Backbone.Router.extend({
        routes: {
            "": "index"
        },

        initialize: function(options) {

        },

        index: function() {
            var router = this;

            //router.model.resetState({
            //    mode: "channel",
            //    data: {
            //        channelIndex: 0
            //    }
            //});
        }
    });
});