const User = require('../../../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports.createSession = async function (req, res) {
    try{

        let user = await User.findOne({email: req.body.email});
        
        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: "Invalid username or password "
            });
        }
        
        return res.status(200).json({
            message:'sign in successful, here is your token, please keep it safe!',
            data:{
                token: jwt.sign(user.toJSON(), process.env.JWT_SECRET, {expiresIn: '100000'})
            }
            
        })

    }catch{
        console.log('***', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }

    
}