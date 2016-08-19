var express         = require('express');
var path            = require('path');
var session         = require('client-sessions');
var mongoose        = require('mongoose');
var app             = express();
var passport        = require('passport');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var flash           = require('connect-flash');

// Custom modules
var games           = require('./app/js/games.js');
var configDB        = require('./app/config/database.js');

// Express config
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/static', express.static(__dirname + '/www'));
app.use(express.static(__dirname + '/www'));
app.use(express.static(__dirname + '/app/js'));
app.use(express.static(__dirname + '/app/config'));

// Jade
app.set('views', path.join(__dirname, '/app/templates'));
app.set('view engine', 'jade');

// Session configuration and handling w/ Passport
app.use(session({
    cookieName: 'session',
    secret: 'superextrasecretilsoluin',
    duration: 60 * 60 * 1000,           // 60 minutes
    activeDuration: 10 * 60 * 1000,     // +10 minutes
}));
app.use(passport.initialize());
app.use(passport.session());            // persistent login sessions
app.use(flash());                       // use connect-flash for flash messages stored in session

// Connect to DB
mongoose.connect(configDB.url); // connect to our database

// Initialize Passport authentication
require('./app/config/passport')(passport); // pass passport for configuration

// Routes
require('./app/routes.js')(app, path, passport);




// Launch
var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});


// REST API

// GET
app.get('/browse-games', games.findAll);

// POST
app.post('/submit', games.addGame);
