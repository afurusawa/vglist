var express         = require('express');
var path            = require('path');
var session         = require('client-sessions');
var mongoose        = require('mongoose');
var app             = express();
var passport        = require('passport');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var flash           = require('connect-flash');
var multer          = require('multer');
var storage         = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        console.log("WHATLSK " + JSON.stringify(req.file));
        cb(null, Date.now() + file.originalname);
    }
});
var upload = multer({ storage: storage }, { limits : { fileSize : 1000000 }}); // 1MB limit



// Custom modules
var REST            = require('./app/services/RESTService.js');
var configDB        = require('./app/config/database.js');

// Express config
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/static', express.static(__dirname + '/www'));
app.use(express.static(__dirname + '/www'));
app.use(express.static(__dirname + '/app/services'));
app.use(express.static(__dirname + '/app/config'));


// Jade
app.set('views', path.join(__dirname, '/app/templates'));
app.set('view engine', 'jade');

// Session configuration and handling w/ Passport
app.use(session({
    cookieName: 'session',
    secret: 'sup2erextr5ase@cretilsolu58in',
    duration: 4 * 60 * 60 * 1000,           // 60 minutes
    activeDuration: 30 * 60 * 1000,         // +30 minutes
}));
app.use(passport.initialize());
app.use(passport.session());            // persistent login sessions
app.use(flash());                       // use connect-flash for flash messages stored in session

// Connect to DB
mongoose.connect(configDB.url); // connect to our database

// Initialize Passport authentication
require('./app/config/passport')(passport); // pass passport for configuration

// Routes
require('./app/routes.js')(app, passport);

// Launch
var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});


// REST API


// GET
app.get('/allGames', REST.findAll);
app.get('/myGames', REST.findMyGameList);
app.get('/game/:id', REST.findByGameId);

app.get('/games/:uid', REST.findGameListByUser);

app.get('/search/:searchString', REST.findGameBySearch);

app.get('/allUsers', REST.findAllUsers);
app.get('/profile/:id', REST.findProfile);

app.get('/:uid/:gid', REST.findGameFromUser);

// POST
//app.post('/addGame', upload.single('gameImage'), function(req, res) {
//    //console.log('uploading image file: ' + JSON.stringify(req.file, null, 4));
//    //console.log('uploading image file: ' + JSON.stringify(req.file, null, 4));
//
//    var post = req.body;
//
//
//    var Game = require('./app/models/game');
//    var newGame = new Game();
//    newGame.title = post.title;
//    newGame.series = post.series;
//    newGame.platform = post.platform;
//    newGame.released = post.released;
//    newGame.developer = post.developer;
//    newGame.publisher = post.publisher;
//    //newGame.img.data = fs.readFileSync(req.file.path);
//    //newGame.img.contentType = req.file.mimetype;
//
//    //newGame.save(function(err) {
//    //    if (err)
//    //        console.error('ERROR: could not add game');
//    //});
//
//    res.redirect('back');
//});
app.post('/addGame', REST.addGame);

app.post('/addToGameList', REST.addToGameList);

app.post('/updateGameRating', REST.updateGameRating);
app.post('/updateHoursPlayed', REST.updateHoursPlayed);

app.post('/toggleCompleted', REST.toggleCompleted);
app.post('/toggleNowPlaying', REST.toggleNowPlaying);