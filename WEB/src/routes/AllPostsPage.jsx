import React from "react";
import ArticleList from "../ArticleList.jsx";

const AllPostsPage = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h2 className="text-center my-3">All Posts</h2>
                    <ArticleList />
                </div>
            </div>
        </div>
    )
}

export default AllPostsPage;