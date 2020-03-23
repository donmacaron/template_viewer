var Platform = {
    VENDOR: {
        BROWSER: 'browser', //'pc-browser',
        LG: 'lg',
        SAMSUNG: 'samsung',
        PHILIPS: 'philips',
        PANASONIC: 'panasonic',
        TOSHIBA: 'toshiba'
    },

	vendor: null, // samsung|lg
	device: null, // tv|bd

    hasNoPhysicalNumberKeys: false,

    keyMap: {
        ENTER : 13,
        BACK: 8,
        INFO:457,

        LEFT : 37,
        UP: 38,
        RIGHT: 39,
        DOWN:40,

        PLAY:415,
        STOP:413,
        PAUSE: 19,
        FF: 417,
        RW:412,

        0:48,
        1:49,
        2:50,
        3:51,
        4:52,
        5:53,
        6:54,
        7:55,
        8:56,
        9:57,

        CH_UP: 187,
        CH_DOWN: 189,

        CH_LIST: 57,

        RED: 403,
        GREEN: 404,
        YELLOW: 405,
        BLUE: 406,

        MENU: -1
    },

    _inited: false
};

Platform.appendStyle = function(source){
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('link');
	script.rel = 'stylesheet';
	script.type = 'text/css';
	script.href = source;
	head.appendChild(script);
};

Platform.applyCompatibility = function(){
	window.alert = function(s){
        Platform.log(s);
	};
};

Platform.log = function(text) {
    if (Platform.inited) {
        // alert(text);
    }

    if(window.console && window.console.log){
        console.log(text);
    }

    if (window != top) {
        top.postMessage(['alert', '' + text], '*');
    }
};

Platform.init = function(platformInfo) {
    Platform.applyVendor(platformInfo.vendor);

    this.MRC = platformInfo.MRC;
    this.hasNoPhysicalNumberKeys = platformInfo.hasNoPhysicalNumberKeys;

    if (platformInfo.keyMap) {
        for(var key in platformInfo.keyMap) {
            Platform.log('--- ' + key + ' ' + platformInfo.keyMap[key]);
        }

        if(platformInfo.keyMap) {
            Platform.Input.keyMap = platformInfo.keyMap;
            Platform.Input.inited = true;
        }
    }

    Platform._inited = true;
};

Platform.setup = function() {
    if(!window.postMessage){
        window.postMessage = Platform.postMessage;
    }
};

Platform.getUrlVars = function() { // Read a page's GET URL variables and return them as an associative array.
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

Platform.applyVendor = function(vendor) {
    if (!vendor) {
        vendor = Platform.VENDOR.SAMSUNG;
    }

    Platform.vendor = vendor;

    if(Platform.vendor != Platform.VENDOR.SAMSUNG){
        Platform.applyCompatibility();
    } else {
        if(!window.console){
            window.console = {
                log: function(obj){
                    Platform.log(obj);
                }
            };
        }
    }

};

Platform.postMessage = function(message, targetOrigin){
	if(window.onmessage){
		setTimeout(function(){
			window.onmessage({data: message, origin: null, targetOrigin: null})
		}, 0);
	}
};
