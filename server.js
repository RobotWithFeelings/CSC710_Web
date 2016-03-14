var express = require('express');

var app = express();


app.use('/', express.static('public'));
app.set('port', (process.env.PORT || 3000));

// app.get('/', function(request,response){
// 	response.sendFile('/index.html')
// });

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port'));
});
