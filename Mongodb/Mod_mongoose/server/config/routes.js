var dogs = require('../controllers/dogs.js');

module.exports = function(app){
  //show
  app.get('/', function(req,res){
    dogs.show(req,res)
  })
//create
  app.post('/dogs',function(req,res){
    dogs.create(req,res)

  })

  app.get('/new', function(req,res){
    res.render('new');
  })
//edit
  app.get('/dogs/edit/:id', function(req,res){
     dogs.edit(req,res)
  })
  //update
  app.post('/dogs/:id', function(req,res){
      dogs.update(req,res)
  })
  //Show one
  app.get('/dogs/:id', function(req,res){
    dogs.show_one(req,res)
  })
  //delete
  app.post('/dogs/destroy/:id', function(req,res){
     dogs.delete(req,res)
  })

}
