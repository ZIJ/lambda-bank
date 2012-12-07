/**
 * Model of Geolocation entity
 * @type {*}
 */
var LocationModel = Backbone.Model.extend({
    defaults: {
        url: "http://vapes.ws/videochat/mobile/readlatlng.php",
        lat: 0,
        lng: 0
    },
    initialize: function(){
        var that = this;
        that.set({
            lat: 53.917821,
            lng: 27.594909
        });
    }
});