import React, { useState, useEffect } from "react";
import Card from "../Card";
import supabase from "../utils/supabase";
import { useParams } from 'react-router-dom'; // For getting route parameters

function CardComponent({ id, title, abstract, users, created_at, created_by, image_url }) {
    const date = new Date(created_at).toISOString().split('T')[0];
  
    return (
        <Card
            post_id={id}
            title={title}
            abstract={abstract}
            post_user={users?.unique_user_name}
            post_user_id={created_by}
            date={date}
            image_url={image_url}
        />
    );
  }

const DeatiledTagsViewPage = () => {
    const { tag_name } = useParams(); // Get the post ID from the URL
    const [postsList, setPostsList] = useState(null); // Post data state
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Fetch posts with the specific tag
        const fetchPosts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("posts")
                .select("*, users(unique_user_name)") // Adjust to include related data like user info
                .contains("tags", [tag_name]); // Query where tags contain the specified tag
            
            if (error) {
                console.error("Error fetching posts:", error);
            } else {
                setPostsList(data);
            }
            setLoading(false);
        };

        fetchPosts();
    }, [tag_name]);

    if (loading) {
        return <div className="container my-4 text-center">Loading posts...</div>;
    }
    
    if (!postsList) {
        return <div className="container my-4 text-center">No posts for #{tag_name}</div>;
    }
    
    return (
        <div className="container">
            <div className="row">
                <div className="col text-center">
                    <h1><span className="badge badge-light text-dark m-4">#{tag_name}<span className="small text-muted"> {postsList.length} posts</span></span></h1>
                </div>
            </div>
            <div className="row">
              {postsList.map((post) => (
                <CardComponent key={post.id} {...post} />
              ))}
            </div>
        </div>
    )
}

export default DeatiledTagsViewPage;