import React from "react";
import { useNavigate } from 'react-router-dom';

const CardLarge = (props) => {
    const navigate = useNavigate();

    const handleUsernameClick = () => {
        navigate(`/users/${props.post_user_id}`); // Navigate to the details page with the item's ID
      };

    return (
        <div className="card text-center">
            <div className="card-header">
            <button type="button" className="btn btn-light" onClick={handleUsernameClick}>@{props.post_unique_user_name}</button >
            </div>
            {/* Display the image if image_url is provided */}
            {props.image_url && (
                    <img
                        src={props.image_url}
                        alt={props.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                    />
                )}
            <div className="card-body">
            <h5 className="card-title">{props.title}</h5>
            <p className="card-text">{props.abstract}</p>
            <p className="card-text">{props.text}</p>
            {/* Display the tags */}
            {props.tags && (
                <div className="mt-2">
                    <div className="list-inline">
                        {props.tags.map((tag, index) => (
                            <button key={index} type="button" className="btn btn-light m-1">#{tag}</button >
                        ))}
                    </div>
                </div>
            )}
            </div>
            <div className="card-footer text-muted">
            Posted on {props.date}
            </div>
        </div>
    )
}

export default CardLarge;