import React from 'react';
import { Link } from 'react-router-dom';
import ArticleList from '../ArticleList.jsx';
import TagsList from '../TagsList.jsx';
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
                    <div className="col text-center m-4">
                        <Link to='/posts' type="button" className="btn btn-dark m-4">See all posts</Link>
                    </div>
                    <div className="row">
                        <div className="col text-center my-3">
                            <h1>Featured #hashtags</h1>
                        </div>
                        <div>
                            <TagsList limit={10}/>
                        </div>
                        <div className="col text-center m-4">
                            <Link to='/tags' type="button" className="btn btn-dark m-4">See all hashtags</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
}

export default HomePage;