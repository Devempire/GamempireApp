'use strict';
var path = require('path');
const express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// Constants
const port = process.env.PORT || 8080;
const app = express();


var userRoute = require('./controller/routeUser.js');

mongoose.connect('mongodb://localhost/db', function(err) {
        if(err) {
            console.log('connection error', err);
        } else {
            console.log('connection successful');
        }
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/user',userRoute);
app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });



app.listen(port);
console.log("Listening on port" + port);


