const User = require('../models/users');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function (req, res) {

    try {

        let user = await User.findById(req.params.id);

        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });

    } catch (err) {
        console.log('Error', err);
        return;
    }


}

module.exports.update = async function (req, res) {

    if (req.user.id == req.params.id) {

        try {

            let user = await User.findById(req.params.id);

            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('**** Multer error', err)}

                user.name = req.body.name;
                user.email = req.body.email;
                
                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    // this is saving the path of the uploded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash('success', 'Profile Updated!')
                return res.redirect('back');
            });

           
           

        } catch (err) {
            req.flash('error', err)
            return res.redirect('back');
        }

    } else {
        req.flash('error', 'Unauthorized!')
        return res.status(401).send('Unauthorized');
    }
}

// render sign up page 
module.exports.signUp = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Connecting Thoughts | Sign Up"
    })
}

// render the sign in page 
module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Connecting Thoughts | Sign In"
    })
}

// get the sign up data
module.exports.create = async function (req, res) {

    try {

        if (req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }

        let user = await User.findOne({ email: req.body.email });

        if (!user) {

            await User.create(req.body);

            return res.redirect('/users/sign-in');

        } else {
            return res.redirect('back');
        }

    } catch (err) {
        console.log('Error', err);
        return;
    }

}

// create the session 
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res, next) {

    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'You have Logged out');

        res.redirect('/');
    });

}