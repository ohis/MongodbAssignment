var express = require('express');
var bp = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/bower_components'));
app.use(bp.urlencoded({ extended: true }))

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//connect to the database
mongoose.connect('mongodb://localhost/Associations');

//update the promise library
mongoose.Promise = global.Promise;

//make a user's "table" aka collection
var UserSchema = new mongoose.Schema({
    'name': {
        'type': String,
        'default': 'Cody',
        'minlength': [4, 'Your name is too short, sorry!']
    },
    'email': {
        'type': String
    },
    'password': {
        'type': String
    }
}, { 'timestamps': true })


//the new way, with relationships
var PostSchema = new mongoose.Schema({
    'title': {
        'type': String
    },
    'body': {
        'type': String
    },
    'user': {
        'type': String
    },
    'comments': [{
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'Comment'
    }]
}, { 'timestamps': true })

mongoose.model('Post', PostSchema);

var Post = mongoose.model('Post');

var CommentSchema = new mongoose.Schema({
    'user': {
        'type': String,
    },
    'comment': {
        'type': String
    },
    '_post': {
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'Post'
    }
}, { 'timestamps': true })

mongoose.model('Comment', CommentSchema);

var Comment = mongoose.model('Comment');

//register the schema with the database
mongoose.model('User', UserSchema);

//extracts the model from the database
var User = mongoose.model('User')

//index page
app.get("/", function(req, res){
    Post.find({}).populate('comments').exec(function(err, posts){
        if(err){
            return res.send(err);
        }
        // res.json(posts)
        res.render('index', { 'posts': posts });
    })
})

app.post('/comments/:id', function(req, res){
    //look up the post
    console.log(req.body);
    Post.findById(req.params.id).exec(function(err, post){
        if(err){
            return res.send(err);
        }
        if(!post){
            return res.send('no post found')
        }
        var comment = new Comment(req.body)
        comment._post = post._id;
        comment.save(function(err, comment){
            if(err){
                return res.send(err);
            }
            post.comments.push(comment._id);
            post.save(function(err, post){
                if(err){
                    return res.send(err);
                }
                return res.redirect('/');
            })
        })

    })
})

app.post('/posts', function(req, res){
    console.log(req.body);
    var post = new Post(req.body)
    post.save(function(err, post){
        if(err){
            return res.send(err);
        }
        return res.redirect('/')
    })
});





//saving an object to the database
app.post('/users', function(req, res){
    // console.log(req.body);
    //save the user in the database
    var user = new User(req.body);
    console.log(user);
    user.save(function(err, user){
        if(err){
            res.send(err);
        } else {
            res.send(user);
        }
    })
    // res.redirect('/')
})



//update a specific user from the database
app.get('/users/:id/update', function(req, res){
    console.log(req.params.id);
    User.findById(req.params.id, function(err, user){
        if(err){
            return res.send(err)
        }
        if(!user){
            return res.send('uh no, no user')
        }
        user.name = req.body.name;
        user.email = req.body.email;
        user.save(function(err, user){
            if(err){
                return res.send(err);
            }
            return res.send(user)
        })

    })
})

//get all the users from the database
app.get('/users', function(req, res){
    User.find({}, function(err, users){
        if(err){
            res.send(err);
        } else {
            res.send(users);
        }
    })
})

//delete a user from the database
app.get('/users/:id/delete', function(req, res){
    User.findByIdAndRemove(req.params.id, function(err, user){
        if(err){
            return res.send(err);
        }
        res.redirect('/');
    })
})

app.listen(8000, function(){
    console.log('listening on port 8000...');
})
