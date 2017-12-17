var express = require('express');
// Create an Express App
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MessageBoard');
mongoose.Promise = global.Promise;
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

var Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
  message: {type: String},
  name: {type: String,  minlength:[4,'name is too short']},

  comments: [{type: Schema.Types.ObjectId,ref:'Comment'}]
},
{timestamps:true});
MessageSchema.path('name').required(true,'Name cannot be blank');
MessageSchema.path('message').required(true,'Message cannot be blank');
mongoose.model('Message', MessageSchema);
var Message = mongoose.model('Message');

var CommentSchema = new mongoose.Schema({
  _message: {type: Schema.Types.ObjectId,ref:'Message'},
  comment: {type: String},
  name: {type: String,  minlength:[4,'name is too short']},
},
{timestamps:true});

mongoose.model('Comment', CommentSchema);
var Comment = mongoose.model('Comment');
CommentSchema.path('comment').required(true,'Comment cannot be blank');
CommentSchema.path('name').required(true,'Name cannot be blank');

app.get('/',function(req,res){
  Message.find({}).populate('comments').exec(function(err, message){
    if(err){
      console.log('Failed');
    }
      return res.render('index',{msg:message});
  })

})

app.post('/message', function(req, res){
  var message = new Message(req.body);
  console.log(message);
  message.save(function(err, message){
    if(err){
      console.log('Failed to create message');
    return  res.send(err);
    }
    return res.redirect('/');
  })
})

app.post('/comments/:id', function(req,res){
  console.log(req.body);
  Message.findById(req.params.id).exec(function(err,message){
    if(err){
      return res.send(err);
    }
    if(!message){
      return res.send('no message found');
    }
    var comment = new Comment(req.body);
    comment._message = message._id;

    comment.save(function(err,comment){
      if(err){
        return res.send(err);
      }
      message.comments.push(comment._id);
      message.save(function(err, message){
        if(err){
          return res.send(err);
        }
        return res.redirect('/');
      })
    })
  })

})




app.listen(8000, function(){
  console.log('listening on port 8000');
})
