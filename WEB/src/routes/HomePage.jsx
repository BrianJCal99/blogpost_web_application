import React from 'react';
import { Link } from 'react-router-dom';
import ArticleList from '../ArticleList.jsx';
import Header from '../Header.jsx';

function HomePage() {
    return (
        <div>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col text-center my-3">
                        <h1>Featured Posts</h1>
                    </div>
                    <div>
                        <ArticleList limit={3}/>
                    </div>
                    <div className="col text-center my-3">
                        <Link to='/posts' type="button" className="btn btn-dark">See all posts</Link>
                    </div>
                </div>
            </div>
        </div>
        );
}

export default HomePage;