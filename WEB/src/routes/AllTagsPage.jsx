import React from "react";
import TagsList from "../TagsList";

const AllTagsPage = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col text-center">
                    <h1 className='text-center mt-5 mb-5'>All #hashtags</h1>
                </div>
                <TagsList />
            </div>

        </div>
    );
};

export default AllTagsPage;