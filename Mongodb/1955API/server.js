var express = require("express");
var path = require("path");

var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/Dash');
mongoose.Promise = global.Promise;

app.use(express.static(path.join(__dirname, "./client/static")));

app.use(bodyParser.urlencoded({ extended: true }));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

require('./server/config/mongoose.js');
var routes_setter = require('./server/config/routes.js');

routes_setter(app);
app.listen(8000,function(){
  console.log("Listening on port 8000");
});
