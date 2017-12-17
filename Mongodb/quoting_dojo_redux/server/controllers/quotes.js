var mongoose = require("mongoose");
var User = mongoose.model('User');

module.exports = {
  show: function(req, res){
    User.find({}, function(err,users){
      if(err){
        console.log('Could not find users');
        res.render('quote',{errors:'Could not find users'})
      }else{
        console.log('Found all the users');
       res.render('quote',{quote: users});
      //  res.render('quote', {quote: users});
      }
    })
  },

  create: function(req, res){
    console.log('POSTDATA', req.body);
    console.log('got here');
    var user = new User({name: req.body.name,quote: req.body.quote});

    user.save({},function(err){
      if(err){
        console.log('Errors saving in db');
        res.render('index',{title:'you have errors', errors: user.errors})
      }else{
        //res.redirect('/quotes');
        res.redirect('/show');
      }

    })

  }
}
