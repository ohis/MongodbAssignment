//var mongoose = require("mongoose");
//var User = mongoose.model('User');
var quotes = require('../controllers/quotes.js');

module.exports = function(app){
  app.get('/', function(req, res){
    res.render("index");
  })

  app.post('/quotes',function(req,res){
    quotes.create(req,res)
  })

  //app.get('/quotes',function(req, res){

  //})

  app.get('/show', function(req,res){
    quotes.show(req, res)
  })

}
