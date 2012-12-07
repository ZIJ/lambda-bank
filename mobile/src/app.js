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
