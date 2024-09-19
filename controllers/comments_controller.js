const Comment = require('../models/comment');
const Post = require('../models/post');
const commentMailer = require('../mailers/comments_mailer');
const { name } = require('ejs');


module.exports.create = async function(req, res){
    try{
        let post = await  Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({

                content: req.body.content,
                post: req.body.post,
                user: req.user._id

            });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email');
            commentMailer.newComment(comment);
            console.log('new comment');

            req.flash('success', 'Comment pubilished on this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err)
        return res.redirect('back');
    }
  
}

module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){

            let postId = comment.post;

            comment.deleteOne();

            let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            req.flash('success', 'Comment Deleted!')
            return res.redirect('back');

        }else{
            req.flash('error', 'Comment deletion failed');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}