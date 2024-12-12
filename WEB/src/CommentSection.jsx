import React, { useEffect, useState, useContext } from "react";
import supabase from "./utils/supabase";
import { SessionContext } from "./context/userSession.context";

const CommentSection = ({ postId }) => {
    const session = useContext(SessionContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const userId = session?.user?.id;

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data, error } = await supabase
                    .from("comment")
                    .select(`
                        id,
                        content,
                        created_at,
                        user:user_id (
                            unique_user_name
                        )
                    `)
                    .eq("post_id", postId)
                    .order("created_at", { ascending: false });

                if (error) throw error;

                setComments(data);
            } catch (err) {
                console.error("Error fetching comments:", err.message);
            }
        };

        fetchComments();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("comment")
                .insert({
                    post_id: postId,
                    user_id: userId,
                    content: newComment.trim(),
                })
                .select(`
                    id,
                    content,
                    created_at,
                    user:user_id (
                        unique_user_name
                    )
                `)
                .single();

            if (error) throw error;

            setComments((prev) => [data, ...prev]);
            setNewComment("");
        } catch (err) {
            console.error("Error adding comment:", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column h-100 bg-white border rounded">
            <div className="border-bottom p-3">
                <h5>
                    Comments<span className="mx-3 small text-muted">{comments.length}</span>
                </h5>
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
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="mb-3 p-3 bg-white border rounded shadow-sm"
                        >
                            <p className="mb-1">{comment.content}</p>
                            <div className="text-muted small">
                                <span>@{comment.user?.unique_user_name || "Anonymous"}</span>
                                <span className="ms-2">
                                    {new Date(comment.created_at).toLocaleString()}
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
                    disabled={!newComment.trim() || loading}
                >
                    {loading ? "Posting..." : "Post Comment"}
                </button>
            </div>
        </div>
    );
};

export default CommentSection;
