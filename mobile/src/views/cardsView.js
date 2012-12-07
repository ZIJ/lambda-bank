
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