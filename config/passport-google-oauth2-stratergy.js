const passport = require('passport');
const googleStratergy = require('passport-google-oauth').OAuth2Strategy;
const  crypto = require('crypto');
const User = require('../models/users');
require('dotenv').config();


//tell passport to use a new statergy for goog;e login
passport.use(new googleStratergy({
        clientID: process.env.PASSPORT_CLIENTID,
        clientSecret: process.env.PASSPORT_CLIENTSECRET, 
        callbackURL: process.env.PASSPORT_CALLBACKURL
    },

    function(accessToken, refreshToken, profile, done){

        User.findOne({email: profile.emails[0].value}).exec().then((user)=>{
           
            // console.log(profile);
           
            if(user){
                // if found, set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }).then((user)=>{
                    return done(null, user);
                }).catch((err)=>{
                    console.log('error in creating user google stratergy', err); 
                    return;
                });

            }
        }).catch((err)=>{
            console.log('error in google stratergy', err); 
            return;
        });


        
        // call back function 
        
        // User.findOne({email: profile.emails[0].value}).exec(function(err, user){
        //     if(err){console.log('error in gogogle stratergy', err); return;}

        //     console.log(profile);

        //     if(user){
        //         // if found, set this user as req.user
        //         return done(null, user);
        //     }else{
        //         // if not found, create the user and set it as req.user
        //         User.create({
        //             name: profile.displayName,
        //             email: profile.emails[0].value,
        //             password: crypto.randomBytes(20).toString('hex')
        //         },function(err, user){
        //             if(err){console.log('error in creating user gogogle stratergy', err); return;}

        //             return done(null, user);
        //         })
        //     }
        // })
    }
))