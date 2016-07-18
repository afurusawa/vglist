var express = require('express');
var path = require('path');
var app = express();

app.use('/static', express.static(__dirname + '/www'));

app.set('views', path.join(__dirname, '/app/templates'));
app.set('view engine', 'jade');


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});