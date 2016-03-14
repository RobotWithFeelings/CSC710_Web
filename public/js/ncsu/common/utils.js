/**
 * Find an object in a specified array.
*/
function findInArray(arr, o) {
	for(var i = 0; i < arr.length; i++){
		if(arr[i] == o) {
			return true;
		}
	}
	return false;
}

/**
 * Gets query string arguments.
*/
function getQueryString(key, default_) {
	if (default_ == null) default_ = "";
	
	key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	
	var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
	var qs = regex.exec(window.location.href);
	if(qs == null)
		return default_;
	else return qs[1];
}