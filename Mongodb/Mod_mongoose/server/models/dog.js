var mongoose = require("mongoose");

var DogSchema = new mongoose.Schema({
  name: {type: String, required:true},
  color: {type: String, required:true},
  weight: {type: Number, required: true}
},{timestamps: true})

var Dog = mongoose.model('Dog',DogSchema);
//var Dog = mongoose.model('Dog')
