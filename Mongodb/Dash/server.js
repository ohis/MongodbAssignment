var express = require("express");
var path = require("path");

var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Dash');
mongoose.Promise = global.Promise;

app.use(express.static(path.join(__dirname, "./static")));
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var DogSchema = new mongoose.Schema({
  name: {type: String, required:true},
  color: {type: String, required:true},
  weight: {type: Number, required: true}
},{timestamps: true})
mongoose.model('Dog',DogSchema);
var Dog = mongoose.model('Dog')

app.get('/', function(req,res){
  Dog.find({},function(err, dogs){
    if(err){
      console.log('Could not find the dogs');
      res.render('index',{errors : 'Could not fin dogs'});
    }else{
      console.log('Found all users');
      res.render('index', {dogs: dogs});
    }
  })

})

app.post('/dogs',function(req,res){
  console.log('POSTDATA',req.body);
  var dog = new Dog({name: req.body.name,color: req.body.color, weight: req.body.weight});
  dog.save({}, function(err){
    if(err){
      console.log('Errors saving in db');
      res.render('new',{title:'you have errors', errors: dog.errors})
    }else{
      res.redirect('/');
    }
  })
})

app.get('/new', function(req,res){
  res.render('new');
})

app.get('/dogs/edit/:id', function(req,res){
  console.log('got here');
  Dog.find({_id: req.params.id} ,function(err,response){
   if(err){
     console.log(err);
   }else{
     console.log(response[0]);
     res.render('edit',{dog: response[0]});
   }
  })

})
//update
app.post('/dogs/:id', function(req,res){
  Dog.update({_id: req.params.id},req.body,function(err,dog){
  if(err){console.log(err);}
    res.redirect('/');
  });

})
//Show
app.get('/dogs/:id', function(req,res){
  Dog.find({_id:req.params.id}, function(err,response){
    if(err){
      console.log('Something went wrong');
    }else{
      console.log('Found right dog');
      res.render('one', {dog: response[0]});
    }
  })
})
//delete
app.post('/dogs/destroy/:id', function(req,res){
  Dog.remove({_id: req.params.id}, function(err,response){
    if(err){
      console.log('Failed to delete');
    }else{
      res.redirect('/');
    }
  })
})
app.listen(8000,function(){
  console.log("Listening on port 8000");
});
