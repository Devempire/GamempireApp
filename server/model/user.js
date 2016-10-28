var mongoose = require('mongoose');
//var bcrypt =require('bcrypt');
//const SALT_WORK_FACTOR= 10;

var UserSchema = mongoose.Schema({
  username:{type: String, unique:true },
  email: {type: String, unique:true},
  password: String,
  dateofbirth: {type: Date, default: ''},
  firstname: String,
  lastname: String,
});

/**UserSchema.pre('save',function(next){
	var user = this;
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){

	if (err)  return next(err)
	else {
		bcrypt.hash(user.password,salt ,function(err,hash){
			if (err)  return next(err)
			else{
				user.password = hash ;
				next() ;
			}
		})
	}
});

});
**/

var User = mongoose.model('User', UserSchema);

module.exports = User;
