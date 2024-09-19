const passport = require('passport');
const JWTStratergy = require('passport-jwt').Strategy;
const ExtractJWt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

const User = require('../models/users');

let opts = {
    jwtFromRequest: ExtractJWt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStratergy(opts, async function(jwtPayload ,done){
    try{
        let user = await User.findById(jwtPayload._id);

        if(user){return done(null, user);}
        else{return done(null, false);}

    }catch(err){
        console.log('Error in finding user from JWT');
        return;
    }
}));

module.exports = passport;