(function (context) {
    context.browserInfo = new (function () {
        var versionSearchString,
            dataBrowser = [
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                },
                {
                    string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                },
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                },
                {
                    prop: window.opera,
                    identity: "Opera",
                    versionSearch: "Version"
                },
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                },
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                },
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                },
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                },
                {
                    // for newer Netscapes (6+)
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                },
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                },
                {
                    // for older Netscapes (4-)
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ],
            dataOS = [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                },
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                },
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iOS"
                },
                {
                    string: navigator.userAgent,
                    subString: "iPad",
                    identity: "iOS"
                },
                {
                    string: navigator.userAgent,
                    subString: "Android",
                    identity: "Android"
                },
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                },
                {
                    string: navigator.userAgent,
                    subString: "BlackBerry",
                    identity: "BlackBerry"
                }
            ];

        this.reset = function () {
            this.browser = searchString(dataBrowser) || "An unknown browser";
            this.version = searchVersion(navigator.userAgent) || searchVersion(navigator.appVersion) || "An unknown version";
            this.OS = searchString(dataOS) || "An unknown OS";
        };

        this.reset();

        function searchString(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string,
                    dataProp = data[i].prop;

                versionSearchString = data[i].versionSearch || data[i].identity;

                if (dataString && dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity;
                } else if (dataProp) {
                    return data[i].identity;
                }
            }
        }

        function searchVersion(dataString) {
            var index = dataString.indexOf(versionSearchString);

            if (index === -1) return;

            return parseFloat(dataString.substring(index + versionSearchString.length + 1));
        }
    })();
})(window);