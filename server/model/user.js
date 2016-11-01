var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  	firstname: String,
  	lastname: String,
  	username: {type: String, unique:true},
  	password: String,
  	email: {type: String, unique:true},
  	dateofbirth: {type: Date, default: ''},
  	gameinventory: {type: Array, default: ''},
  	gamertype: {type: String, default: ''},
  	friends: {type: Array, default: ''},
  	mic: {type: Boolean, default: ''}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
