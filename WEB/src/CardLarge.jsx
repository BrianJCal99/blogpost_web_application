import React from "react";
import { useNavigate } from 'react-router-dom';

const CardLarge = (props) => {
    const navigate = useNavigate();

    const handleUsernameClick = () => {
        navigate(`/users/${props.post_user_id}`); // Navigate to the details page with the item's ID
      };

    return (
        <div className="card text-center">
            {/* Display the image if image_url is provided */}
            {props.image_url && (
                    <img
                        src={props.image_url}
                        className="card-img-top"
                        alt={props.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                    />
                )}
            <div className="card-header">
            Posted by {props.post_user_name}
            </div>
            <div className="card-body">
            <h5 className="card-title">{props.title}</h5>
            <p className="card-text">{props.abstract}</p>
            <p className="card-text">{props.text}</p>
            <button type="button" className="btn btn-light" onClick={handleUsernameClick}>@{props.post_unique_user_name}</button >
            </div>
            <div className="card-footer text-muted">
            Posted on {props.date}
            </div>
        </div>
    )
}

export default CardLarge;