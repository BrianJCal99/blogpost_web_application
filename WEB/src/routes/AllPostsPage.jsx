import React from "react";
import ArticleList from "../ArticleList.jsx";

const AllPostsPage = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col text-center">
                    <h1 className='text-center mt-5 mb-5'>User Posts</h1>
                </div>
                <ArticleList />
            </div>
        </div>
    )
}

export default AllPostsPage;