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




module.exports = router;
