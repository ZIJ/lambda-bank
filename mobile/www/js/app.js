
(function(){

    "use strict";

    if (!window.vchat) {
        window.vchat = {};
    }
    var vchat = window.vchat;

/**
 * Creates an object with precompiled templating methods
 * @param {String[]} names Array of template names
 * @constructor
 */
function Templater(){
    var that = this;
    var templates = $("[data-template-name]");
    templates.each(function(){
        var element = $(this);
        var name = element.attr("data-template-name");
        var source = element.html();
        that[name] = Handlebars.compile(source);
    });
}
/*
    Application start code. Exeduted before creation of any models or views
*/

var templater = new Templater();

var CardsModel = Backbone.Model.extend({
    defaults: {

    },

    initialize: function()
    {

    }
});
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

var PaymentsModel = Backbone.Model.extend({
    defaults: {

    },

    initialize: function()
    {

    }
});

var SettingsModel = Backbone.Model.extend({
    defaults: {

    },

    initialize: function()
    {

    }
});

var UsersModel = Backbone.Model.extend({
    defaults: {

    },

    initialize: function()
    {

    }
});

var CardsView = Backbone.View.extend({
    initialize: function()
    {
        this.el = $("#cards");
        this.model.on("change", this.render, this);
        //this.iscroll = new iScroll(this.el);
    },

    render: function(){
        //this.iscroll.refresh();
    }
});
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
        this.render();
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

var PaymentsView = Backbone.View.extend({
    initialize: function()
    {
        this.el = $("#payments");
        this.model.on("change", this.render, this);
        //this.iscroll = new iScroll(this.el);
    },

    render: function(){
        //this.iscroll.refresh();
    }
});

var SettingsView = Backbone.View.extend({
    initialize: function()
    {
        this.el = $("#settings");
        this.model.on("change", this.render, this);
        //this.iscroll = new iScroll(this.el);
    },

    render: function(){
        //this.iscroll.refresh();
    }
});

var UsersView = Backbone.View.extend({
    initialize: function()
    {
        this.el = $("#users");
        this.model.on("change", this.render, this);
        this.iscroll = new iScroll("userList");
    },

    render: function(){
        this.iscroll.refresh();
    }
});
var location = new LocationModel();
var map = new LocationView({ model: location });

var cards = new CardsModel();
var cardsView = new CardsView({ model: cards });

var payments = new PaymentsModel();
var paymentsView = new PaymentsView({ model: payments });

var settings = new SettingsModel();
var settingsView = new SettingsView({model: settings});

var users = new UsersModel();
var usersView = new UsersView({model: users});


var PageRouter = Backbone.Router.extend({
    initialize: function(){
        var that = this;
        that.currentPageName = null;
        that.pages = {};
        that.links = {};
        $("nav a").each(function(){
            var link = $(this);
            var pageName = link.attr("href").slice(1);
            that.links[pageName] = link;
            that.pages[pageName] = $("#" + pageName);

        });
    },
    routes: {
        ":pageName": "pageRoute"
    },
    pageRoute: function(pageName) {

        var lastPage = this.currentPageName;
        if (lastPage) {
            this.pages[lastPage].css("visibility", "hidden");
            this.links[lastPage].removeClass("selected");
        }
        if (this.pages[pageName]) {
            this.pages[pageName].css("visibility", "visible");
            this.links[pageName].addClass("selected");
            this.currentPageName = pageName;
        } else {
            console.log("No such page: " + pageName);
        }

        // омг тут всё быдлокод, но это просто моя гордость
        if(usersView.iscroll) {
            usersView.iscroll.refresh();
        }
    }
});

var router = new PageRouter();
Backbone.history.start();
router.navigate("location", {
    replace: true,
    trigger: true
});


}());