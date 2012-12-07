
vchat.loader = new vchat.ScriptLoader();
var loader = vchat.loader;

var scriptUrl = "./js/main.js";
loader.require(scriptUrl);

var button = document.getElementById("enterButton");

function bindLogin(){
    launchApp();
}

// handling submit events

button.addEventListener("click", bindLogin);

function launchApp(){
    var loginScreen = document.getElementById("login");
    loginScreen.setAttribute("style", "display: none");
}



