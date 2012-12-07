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