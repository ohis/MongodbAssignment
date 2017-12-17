var mongoose = require("mongoose");

var Dog = mongoose.model('Dog');

module.exports = {
create: function(req,res){
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


  },
show: function(req,res){
  Dog.find({},function(err, dogs){
    if(err){
      console.log('Could not find the dogs');
      res.render('index',{errors : 'Could not fin dogs'});
    }else{
      console.log('Found all users');
      res.render('index', {dogs: dogs});
    }
  })

},

edit: function(req,res){
  console.log('got here');
  Dog.find({_id: req.params.id} ,function(err,response){
   if(err){
     console.log(err);
   }else{
     console.log(response[0]);
     res.render('edit',{dog: response[0]});
   }
  })
},

update: function(req,res){
  Dog.update({_id: req.params.id},req.body,function(err,dog){
  if(err){console.log(err);}
    res.redirect('/');
  });
},

show_one: function(req,res){
  Dog.find({_id:req.params.id}, function(err,response){
    if(err){
      console.log('Something went wrong');
    }else{
      console.log('Found right dog');
      res.render('one', {dog: response[0]});
    }
  })


},

delete: function(req,res){
  Dog.remove({_id: req.params.id}, function(err,response){
    if(err){
      console.log('Failed to delete');
    }else{
      res.redirect('/');
    }
  })
}


}
