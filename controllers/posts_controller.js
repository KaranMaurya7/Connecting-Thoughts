const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/users');

module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if (req.xhr) {
            // req.xhr.flash('success', 'Post created!');
            let user = await User.findOne({_id:req.user._id});

            req.flash('success', 'Post pubilished!');

            return res.status(200).json({
                data: {
                    post: post,
                    user:user.name
                },
                message: "Post Created!"
            });
        }

        req.flash('success', 'Post pubilished!');
        return res.redirect('back');

    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }

}

module.exports.destroy = async function (req, res) {

    try {
        let post = await Post.findById(req.params.id);

        //.id means converting the object id into string
        if (post.user == req.user.id) {
            post.deleteOne();

            await Comment.deleteMany({ post: req.params.id });

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    mesaage: "Post Deleted!"
                })
            }

            req.flash('success', 'Post and associated comments deleted');

            return res.redirect('back');

        } else {

            req.flash('success', 'Post deletion failed, you cannot delete this post');

            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}