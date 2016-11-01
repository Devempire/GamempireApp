var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  username:{type: String, unique:true },
  email: {type: String, unique:true},
  password: String,
  dateofbirth: {type: Date, default: ''},
  firstname: String,
  lastname: String,

});


var User = mongoose.model('User', UserSchema);

module.exports = User;
