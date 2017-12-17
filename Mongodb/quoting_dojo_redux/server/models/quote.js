var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name:{type: String, required: true, minlength:3},
  quote:{type: String, required: true, minlength:5}

},{timestamps: true})

var User = mongoose.model('User', UserSchema);
