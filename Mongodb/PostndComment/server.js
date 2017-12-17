var express = require('express');
// Create an Express App
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/PostndComment');
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

var PostSchema = new mongoose.Schema({
  text: {type: String, required: true},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
},
{timestamps: true});

var CommentSchema = new mongoose.Schema({
  _post: {type: Schema.Types.ObjectId, ref: 'Post'},
text: {type: String, required: true}
},
{timestamps: true});

mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

app.get('/',function(req,res){
  Post.find({}).populate('comments').exec(function(err,posts){
    if(err){
      res.send(err);
      console.log("Got an error")
    }else{
      console.log('Got here');
      res.render('index',{posts:posts});
    }
  })

})

app.post('/posts', function(req,res){
  var post = new Post(req.body);
  console.log(post);
  post.save(function(err,post){
    if(err){
    return   res.send(err);
    }else{
  return res.redirect('/');
    }
  })
})

app.post('/comments/:id', function(req,res){
  console.log(req.body);
  Post.findById(req.params.id).exec(function(err,post){
    if(err){
      return res.send(err);
    }
    if(!post){
      return res.send('no post found');
    }
    var comment = new Comment(req.body)
    comment._post = post._id;
    comment.save(function(err,comment){
      if(err){
        return res.send(err);
      }
      post.comments.push(comment._id);
      post.save(function(err,post){
        if(err){
          return res.send(err);
        }
        return res.redirect('/');
      })
    })
  })
})

app.listen(8000, function(){
  console.log('Listening on port 8000')
})
