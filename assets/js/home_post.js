{
    // method to submit form data for new using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {

                    // console.log(data);
                    let newPost = newPostDom(data.data.post, data.data.user);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }

    // method to create a post in DOM
    let newPostDom = function (post,userName){

        return $(`<li id="post-${post._id}">
            <div class="content">
                <p>        
                    ${post.content}
                    <br>
                    <small>
                    ${userName} (Author)
                    </small>
                </p>

                <a class="delete-post-button" href="/posts/destroy/${post._id}"> Delete </a>
            </div>
            
            <div class="post-comments">
                
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type Comment..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>
            
                <div class="post-comments-list">
                    <ul id="post-comments-${post._id}">
        
                    </ul>
                </div>
            </div>
        
        </li>`)
    }

    //method to delete a post from DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'GET',
                url: $(deleteLink).prop('href'),
                success: function (data) {

                    $(`#post-${data.data.post._id}`).remove();
                
                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }

    createPost();
}