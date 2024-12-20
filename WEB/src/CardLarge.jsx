import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./utils/supabase.js";
import { SessionContext } from "./context/userSession.context.jsx";

const CardLarge = (props) => {
    const session = useContext(SessionContext);
    const navigate = useNavigate();
    const [likes, setLikes] = useState(props.likes || 0);
    const [likedBy, setLikedBy] = useState(props.liked_by || []);
    const userID = session?.user?.id;
    const userName = session?.user?.user_metadata?.uniqueUserName;

    useEffect(() => {
        setLikes(props.likes || 0);
        setLikedBy(props.liked_by || []);
    }, [props.likes, props.liked_by]);

    const handleUsernameClick = () => {
        navigate(`/users/${props.post_user_id}`);
    };

    const handleTagClick = (tag) => {
        navigate(`/tags/${tag}`);
    };

    const handleLike = async () => {
        try {
            const hasLiked = likedBy.includes(userName);
            const updatedLikes = hasLiked ? likes - 1 : likes + 1;
            const updatedLikedBy = hasLiked
                ? likedBy.filter((id) => id !== userName)
                : [...likedBy, userName];

            const { error: postError } = await supabase
                .from("posts")
                .update({
                    likes: updatedLikes,
                    liked_by: updatedLikedBy,
                })
                .eq("id", props.id);

            if (postError) throw postError;

            setLikes(updatedLikes);
            setLikedBy(updatedLikedBy);

            // Fetch and update the user's liked posts
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("liked_posts")
                .eq("id", userID)
                .single();

            if (userData) {
                const likedPosts = userData.liked_posts || [];
                const updatedLikedPosts = hasLiked
                    ? likedPosts.filter((postId) => postId !== props.id)
                    : [...likedPosts, props.id];

                const { error: updateUserError } = await supabase
                    .from("users")
                    .update({
                        liked_posts: updatedLikedPosts,
                    })
                    .eq("id", userID);

                if (updateUserError) {
                    console.error("Error updating user's liked posts:", updateUserError);
                }
            } else {
                console.error("Error fetching user data:", userError);
            }
        } catch (error) {
            console.error("Error updating likes:", error.message);
        }
    };

    return (
        <div className="card text-center">
            <div className="card-header">
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={handleUsernameClick}
                >
                    @{props.post_unique_user_name}
                </button>
            </div>
            <div className="card-header small text-muted">
                {props.date}
            </div>
            {props.image_url && (
                <img
                    src={props.image_url}
                    alt={props.title}
                    style={{ height: "200px", objectFit: "cover" }}
                />
            )}
            <div className="card-body">
                <h5 className="card-title">{props.title}</h5>
                <p className="card-text">{props.abstract}</p>
                <p className="card-text">{props.text}</p>
                {props.tags && (
                    <div className="mt-2">
                        <div className="list-inline">
                            {props.tags.map((tag, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className="btn btn-light m-1"
                                    onClick={() => handleTagClick(tag)}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="card-footer text-muted">
                <div className="d-flex justify-content-center align-items-center m-4">
                    <button
                        type="button"
                        className={`btn btn-${likedBy.includes(userName) ? "outline-primary" : "outline-secondary"} mx-2`}
                        onClick={handleLike}
                    >
                        {likedBy.includes(userName) ? "Liked" : "Like"} 
                    </button>
                </div>
                <div className="row m-4">
                    <strong>{likes} Likes</strong>
                    <div className="col">
                        <strong>Liked by </strong> 
                        {likedBy.map((name, index) => (
                            <span className="small text-muted" key={index}>
                                {name}{index < likedBy.length - 1 && ', '}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardLarge;
