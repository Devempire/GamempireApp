var express = require('express');
var app = express();
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('../model/user.js');
var crypto = require('crypto');


router.get('/test',function(req,res,next){
    console.log("test done");
});
/* show all users (for testing only), delete if running server in real application*/
router.get('/show', function (req, res, next) {
    User.find(function (err, users) {
    if (err) return next(err);
    console.log(users);
    res.json(users);
    });
});


/* add a user */
router.post('/add', function (req, res, next) {
    var key = crypto.pbkdf2Sync(req.body.password, 'salt', 10000, 512);
    User.find({'username':req.body.username}, function (err, users) {
        if (err) return next(err);
        console.log(req.body.username);
        if (users[0] == null){
            new User({
                username: req.body.username,
                email: req.body.email,
                password: key,
                firstname: req.body.firstname,
                lastname:req.body.lastname
            }).save(function ( err, user, count ){
                if( err ) return next( err );
                res.end("Submission completed");
            });
        }else{
          res.status(400);
            return next(new Error("Invalid Username"));
        }
    });

});

/*find a user*/
router.post('/find', function (req, res, next) {
    var key = crypto.pbkdf2Sync(req.body.password, 'salt', 10000, 512);
    console.log(key);
    User.find({'username':req.body.username, 'password':key}, function (err, users) {
        if (err) return next(err);
        if (!(users[0] == null)){
            var token = jwt.sign(users[0], 'SecretKey', {
                expiresIn: 1440*60 // expires in 24 hours
            });
            //console.log(token);
            res.send(token);
            res.end("Information found");
        }else{
          res.status(400);
            return next(new Error("Incorrect information"));
        }
    });
});

//load user with valid token 
router.post('/load', function(req,res,next){

    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'SecretKey', function(err, decoded) {          
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });      
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;  
                res.send(
                {
                    _id :decoded._doc._id
                });
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
        });
        
    }
    
});

//get certerain user info
router.get('/profile/:id/info',function(req,res,next){
    User.findById(req.params.id, function(err, user){
    if (err) return next(err);
 
    res.send({username : user.username});
    });
});





module.exports = router;
