var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: {type: String, unique:true},
    password: String,
    email: {type: String, unique:true},
    dateofbirth: {type: String, default:''},
    gameinventory:[{ game: String, interest: Array}],
    friends: {type: Array, default: ''},
    mic: {type: Boolean, default: ''},
    img: {type: Buffer, contentType: String, default: ''}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
