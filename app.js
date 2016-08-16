var express = require('express');
var path = require('path');

var games = require('./app/js/games.js');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/static', express.static(__dirname + '/www'));
app.use(express.static(__dirname + '/www'));
app.use(express.static(__dirname + '/app/js'));


// Not sure if this is necessary
app.set('views', path.join(__dirname, '/app/templates'));
app.set('view engine', 'jade');


var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

// Routing
// Not going to use res.render() to render jade because of cost
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/www/home.html'));
});

app.get('/submit', function(req, res) {
    res.sendFile(path.join(__dirname + '/www/submission.html'));
});

app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname + '/www/about.html'));
});

app.get('/games', function(req, res) {
    res.sendFile(path.join(__dirname + '/www/games.html'));
});






// REST API

// GET
app.get('/browse-games', games.findAll);

// POST
app.post('/submit', games.addGame);
