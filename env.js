var logger = (function() {
	var debug = false;
	
	function isDebug(b) {
		debug = b;
	}
	
	function log(msg) {
		if(debug) console.log(msg);
	}	
	
	function warn(msg) {
		if(debug) console.warn(msg);
	}
	
	function error(msg) {
		console.error(msg);
	}
	
	return {
		isDebug: isDebug,
		log: log,
		warn: warn,
		error: error
	};	
})();