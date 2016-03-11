var express = require('express');

var app = express();

app.get('/', function(request,response){
	response.sendFile(__dirname + '/index.html')
})

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port'));
});
