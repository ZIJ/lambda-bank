
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