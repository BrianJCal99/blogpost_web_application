import React, { useState, useEffect, useContext } from "react";
import supabase from "./utils/supabase";
import { SessionContext } from "./context/userSession.context";

const LikeSection = ({ postId }) => {
    const session = useContext(SessionContext);
    const [likesCount, setLikesCount] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const userId = session?.user?.id;

    useEffect(() => {
        const fetchLikesData = async () => {
            try {
                // Fetch the total number of likes
                const { data: likeData, error: likesError } = await supabase
                    .from("like")
                    .select("*", { count: "exact" })
                    .eq("post_id", postId);

                if (likesError) throw likesError;

                setLikesCount(likeData.length);

                // Check if the current user liked the post
                if (userId) {
                    const { data: userLikeData, error: userLikeError } = await supabase
                        .from("like")
                        .select("id")
                        .eq("post_id", postId)
                        .eq("user_id", userId)
                        .maybeSingle();

                    if (userLikeError && userLikeError.code !== "PGRST116") {
                        throw userLikeError;
                    }

                    setUserLiked(!!userLikeData);
                }
            } catch (error) {
                console.error("Error fetching like data:", error.message);
            }
        };

        fetchLikesData();
    }, [postId, userId]);

    const handleLike = async () => {
        if (!userId) {
            alert("You must be logged in to like a post.");
            return;
        }

        try {
            if (userLiked) {
                // Remove like
                const { error } = await supabase
                    .from("like")
                    .delete()
                    .eq("post_id", postId)
                    .eq("user_id", userId);

                if (error) throw error;

                setLikesCount((prev) => prev - 1);
                setUserLiked(false);
            } else {
                // Add like
                const { error } = await supabase
                    .from("like")
                    .insert({ post_id: postId, user_id: userId });

                if (error) throw error;

                setLikesCount((prev) => prev + 1);
                setUserLiked(true);
            }
        } catch (error) {
            console.error("Error updating like:", error.message);
        }
    };

    return (
        <div className="d-flex align-items-center">
            <button
                className={`btn btn-sm ${userLiked ? "btn-primary" : "btn-outline-primary"}`}
                onClick={handleLike}
            >
                {userLiked ? "Liked" : "Like"}
            </button>
            <span className="ms-2">{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
        </div>
    );
};

export default LikeSection;
