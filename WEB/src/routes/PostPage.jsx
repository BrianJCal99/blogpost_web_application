import React from "react";
import NewArticle from "../NewArticle";

const PostPage = () => {
    return (
        <div className="container">
            <h3 className="text-center m-3">New Post</h3>
            <h5 className="text-center m-3">What's on you mind</h5>
            <NewArticle />
        </div>
    )
}

export default PostPage;