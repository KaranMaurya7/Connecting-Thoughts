const Post = require('../models/post');
const User = require('../models/users');


module.exports.home = async function (req, res) {

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
    
        let users = await User.find({});
    
        return res.render('home', {
            title: "Connecting Thoughts | Home",
            posts: posts,
            all_users: users
        });
    
    }catch(err){
        console.log('Error', err);
        return;
    }

}