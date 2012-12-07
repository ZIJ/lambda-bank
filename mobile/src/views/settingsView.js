
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