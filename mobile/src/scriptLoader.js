/**
 * Loads scripts dynamically by given url
 * @constructor
 */
vchat.ScriptLoader = function(){
    this.scripts = {};
};

/**
 * Loads the script and fires all callbacks as soon as it's ready
 * @param url
 * @param onReadyCallback
 */
vchat.ScriptLoader.prototype.require = function(url, onReadyCallback) {
    var script = this.scripts[url];
    if (!script) {
        this.scripts[url] = new ScriptDescriptor(url, onReadyCallback);
    } else if (script.state !== "ready") {
        script.addCallback(onReadyCallback);
    } else {
        onReadyCallback();
    }
};

/**
 * Contains various info about the script. Executes callbacks on script load.
 * @param url
 * @param firstCallback
 * @constructor
 */
function ScriptDescriptor(url, firstCallback){
    var that = this;
    this.state = "loading";
    this.callbacks = [];
    this.addCallback(firstCallback);
    this.script = document.createElement("script");
    this.script.type = "text/javascript";
    this.script.onload = function(){
        that.onReady();
    };
    this.script.src = url;
    document.getElementsByTagName("head")[0].appendChild(this.script);
}

/**
 * Adds callback to queue
 * @param callback
 */
ScriptDescriptor.prototype.addCallback = function(callback){
    if (typeof callback === "function") {
        this.callbacks.push(callback);
    }
};

/**
 * Changes state to ready and fires callbacks
 */
ScriptDescriptor.prototype.onReady = function(){
    this.state = "ready";
    for (var i = 0; i < this.callbacks.length; i+=1) {
        this.callbacks[i]();
    }
    this.callbacks = [];
};
