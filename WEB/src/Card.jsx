import React from "react";
import { useNavigate } from 'react-router-dom';

const Card = (props) => {
    const navigate = useNavigate();

    const handleViewPostClick = () => {
        navigate(`/posts/${props.post_id}`); // Navigate to the details page with the item's ID
      };

    const handleUsernameClick = () => {
        navigate(`/users/${props.post_user_id}`); // Navigate to the details page with the item's ID
      };

    return (
        <div className="col-lg-4 d-flex justify-content-center my-3">
            <div className="card text-center" style={{width: 24 + 'rem'}}>
                <div className="card-body">
                    <h5 className="card-title">{props.title}</h5>
                    <p className="card-text my-3">{props.abstract}</p>
                    <button type="button" className="btn btn-link" onClick={handleUsernameClick}>@{props.post_user}</button >
                    <p className="small text-muted">{props.date}</p>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleViewPostClick}>View post</button>
                </div>
            </div>
        </div>
    )
}

export default Card;