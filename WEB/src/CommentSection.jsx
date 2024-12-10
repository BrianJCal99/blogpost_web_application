import React, { useEffect, useState, useContext } from "react";
import supabase from "./utils/supabase";
import { SessionContext } from "./context/userSession.context";

const CommentSection = ({ postId }) => {
    const session = useContext(SessionContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const userName = session?.user?.user_metadata?.uniqueUserName || "Anonymous";

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data, error } = await supabase
                    .from("posts")
                    .select("comments")
                    .eq("id", postId)
                    .single();

                if (error) {
                    console.error("Error fetching comments:", error);
                } else {
                    const parsedComments = (data.comments || []).map((comment) =>
                        JSON.parse(comment)
                    );
                    setComments(parsedComments);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        };
        fetchComments();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const newCommentEntry = {
            userName,
            text: newComment,
            posted_on: new Date().toISOString(),
        };

        const updatedComments = [newCommentEntry, ...comments].map((comment) =>
            JSON.stringify(comment)
        );

        const { error } = await supabase
            .from("posts")
            .update({ comments: updatedComments })
            .eq("id", postId);

        if (error) {
            console.error("Error adding comment:", error);
        } else {
            setComments((prevComments) => [newCommentEntry, ...prevComments]);
            setNewComment("");
        }
    };

    return (
        <div className="d-flex flex-column h-100 bg-white border rounded m-3">
            <div className="border-bottom p-3">
                <h5>Comments<span className="mx-3 small text-muted">{comments.length}</span></h5>
            </div>
            <div
                className="flex-grow-1 overflow-auto p-3 d-flex flex-column-reverse"
                style={{ height: "0" }}
            >
                {comments.length === 0 ? (
                    <div className="text-center text-muted">
                        <p>No comments yet. Start the conversation.</p>
                    </div>
                ) : (
                    comments.map((comment, index) => (
                        <div
                            key={index}
                            className="mb-3 p-3 bg-white border rounded shadow-sm"
                        >
                            <p className="mb-1">{comment.text}</p>
                            <div className="text-muted small">
                                <span>@{comment.userName}</span>
                                <span className="ms-2">
                                    {comment.posted_on
                                        ? new Date(comment.posted_on).toLocaleString()
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-3 border-top">
                <textarea
                    className="form-control mb-2"
                    rows="2"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                    className="btn btn-primary w-100"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                >
                    Post Comment
                </button>
            </div>
        </div>
    );
};

export default CommentSection;
