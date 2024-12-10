import React from "react";
import ArticleList from "../ArticleList.jsx";

const AllPostsPage = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col text-center">
                    <h1>All Posts</h1>
                    <ArticleList />
                </div>
            </div>
        </div>
    )
}

export default AllPostsPage;