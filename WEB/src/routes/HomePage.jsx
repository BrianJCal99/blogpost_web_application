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
                    <div className="col text-center">
                        <h1 className='text-center mt-5 mb-5'>Featured Posts</h1>
                    </div>
                    <ArticleList limit={3}/>
                    <div className="col text-center">
                        <Link to='/allposts' type="button" className="btn btn-dark m-4">See all posts</Link>
                    </div>
                </div>
            </div>
        </div>
        );
}

export default HomePage;