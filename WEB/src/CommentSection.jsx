import React, { useEffect, useState, useContext } from "react";
import supabase from "./utils/supabase";
import { SessionContext } from "./context/userSession.context";

const CommentSection = ({ postId }) => {
    const session = useContext(SessionContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    // const userId = session?.user?.id;
    const userName = session?.user?.user_metadata?.uniqueUserName || "Anonymous";

// Fetch comments when the component is mounted
useEffect(() => {
    // Fetch existing comments when the component loads
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
            // Parse JSON strings into objects
            const parsedComments = (data.comments || []).map((comment) =>
              JSON.parse(comment)
            );
            setComments(parsedComments);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
        }
    };
    fetchComments()
}, [postId]);

// Add a new comment
const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const newCommentEntry = {
        userName,
        text: newComment,
        posted_on: new Date().toISOString(), // Add the timestamp
      };

    // Serialize the comment to a JSON string
    const updatedComments = [...comments, newCommentEntry].map((comment) =>
        JSON.stringify(comment)
    );

    const { error } = await supabase
      .from("posts")
      .update({ comments: updatedComments })
      .eq("id", postId);

    if (error) {
        console.error("Error adding comment:", error);
    } else {
        setComments((prevComments) => [...prevComments, newCommentEntry]);
        setNewComment("");
    }
};

  return (
    <div className="mt-4">
      <h5>Comments</h5>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button
          className="btn btn-primary mt-2"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          Post Comment
        </button>
      </div>
      <ul className="list-group">
        {comments.map((comment, index) => (
          <li key={index} className="list-group-item">
            <p className="mb-1">{comment.text}</p>
            <div className="small text-muted">
              @{comment.userName} 
            </div>
            <div className="small text-muted">
              {comment.posted_on ? new Date(comment.posted_on).toLocaleString() : "N/A"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
