/**
 * Main view of Geolocation entity as a map
 * @type {*}
 */
var LocationView = Backbone.View.extend({
    initialize: function(){
        this.leafletScriptPath = "./leaflet/leaflet.js";
        vchat.loader.require(this.leafletScriptPath);
        this.el = $("#map");
        this.minZoom = 3;
        this.maxZoom = 18;
        this.initialZoom = 13;
        this.model.on("change", this.render, this);
    },
    render: function(){
        var view = this;
        // setting fixed height to map container due to Leaflet requirements
        this.el.height(this.el.parent().height());
        // map needs Leaflet script to be loaded before rendering
        vchat.loader.require(this.leafletScriptPath, function(){
            var map = new L.Map('map');

            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib = 'Map data © OpenStreetMap contributors';
            var osm = new L.TileLayer(osmUrl, {
                minZoom: view.minZoom,
                maxZoom: view.maxZoom,
                attribution: osmAttrib
            });

            var latitude = view.model.get("lat");
            var longitude = view.model.get("lng");

            map.setView(new L.LatLng(latitude, longitude), view.initialZoom);
            map.addLayer(osm);
            L.marker([latitude, longitude]).addTo(map);
        });
    }
});