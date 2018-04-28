var express = require('express'); //loading package express
var httpModule = require('http'); //loading package http
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

var app = express(); //create an express app (to hanle html stuff)
var http = httpModule.Server(app);

app.use(express.static('assets')); //any assets will be found in the folder assets (pics and such)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  console.log('got a GET request');
}); //get request to / is given to responder function

app.get('/index', (req, res) => {
  //obtain data from shifts into cursor object
  var cursor1 = db.collection('shifts').find();
  var cursor2 = db.collection('volunteer').find();
  //convert to array to extract shift data
  cursor1.toArray(function(err1, results1){
    if(err1)
    return console.log(err1);

    cursor2.toArray(function(err2, results2){
      if(err2)
      return console.log(err2);

      //render sign-up.ejs
      res.render('index.ejs', {shifts:results1, volunteer:results2});
    });
  });

  console.log('got a GET request');
});

app.post('/addVolunteer', (req, res) => {
  console.log('got Post /addVolunteer request');
  console.log(req.body);

  //create object that stores items needed for signup table
  //var signup = {};
  //signup.email = req.body.email;
  //signup.shiftID = req.body.shiftID;
//  signup.numVols = req.body.numVols;

  var vol = {};
  //vol.email = req.body.email;
  vol.firstName = req.body.firstName;
  vol.lastName = req.body.lastName;
//  vol.orgName = req.body.orgName;
//  vol.groupVol = req.body.groupVol;
//  vol.numVols = req.body.numVols;

  db.collection('volunteer').save(vol, (err, result) => {
    if (err)
    return console.log(err);
    console.log('volunteer saved to database');
    updateVolunteersIds();  // update the list of volunteer IDs since a volunteer was added
    // db.collection('signup').save(signup, (err, result) => {
      //if (err)
      //return console.log(err);
      //console.log('signup record saved to database');
      //res.redirect('/location');
    //});
  });
});

var port = process.env.PORT || 3000;

// db will be associated with the database when the connection to
// to MongoLab is established.
var db;
// The ids of current entries in the database are keep in array ids.
var ids = new Array();
var volIds = new Array();
var adminIds = new Array();

// Connect to MongoLab, when the connection is established then
// associate the MongoLab database with variable db and start listening
// to HTML requests.
MongoClient.connect('mongodb://<dbuser>:<dbpassword>@ds161539.mlab.com:61539/gumbo',
(err, database) => {
  if (err)
    return console.log(err);
  db = database;
  console.log("Connected to Mlab...");
  updateIds((result) => {
    console.log(result);
  });
  http.listen(port, portListener);
});

function updateIds(callback) {
  var cursor = db.collection('shifts').find();
  cursor.toArray(function (err, results) {
    if (err)
    return console.log(err);
    ids = [];
    for (var i = 0; i < results.length; i++) {
      ids.push(results[i]._id);
    }
    if (typeof callback != "undefined")
      callback(ids);
  });
}

function updateVolunteersIds(callback) {
  var cursor = db.collection('volunteer').find();
  cursor.toArray(function (err, results) {
    if (err)
    return console.log(err);
    volIds = [];
    for (var i = 0; i < results.length; i++) {
      volIds.push(results[i]._id);
    }
    if (typeof callback != "undefined")
      callback(volIds);
  });
}

function updateAdminIds(callback) {
  var cursor = db.collection('admins').find();
  cursor.toArray(function (err, results) {
    if (err)
    return console.log(err);
    adminIds = [];
    for (var i = 0; i < results.length; i++) {
      ids.push(results[i]._id);
    }
    if (typeof callback != "undefined")
      callback(adminIds);
  });
}
