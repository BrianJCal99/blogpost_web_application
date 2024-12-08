import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../utils/supabase';
import CardLarge from '../CardLarge';
import CommentSection from '../CommentSection';

function CardComponent({article}) {
    const timestamp = article.created_at;
    const date = new Date(timestamp).toISOString().split('T')[0];
    
    return (
        <CardLarge
            id = {article.id}
            title = {article.title}
            abstract = {article.abstract}
            text = {article.text}
            post_unique_user_name = {article.users?.unique_user_name}
            post_user_name = {article.users?.user_name}
            email = {article.users?.email}
            post_user_id={article.created_by}
            image_url={article.image_url}
            tags={article.tags}
            likes={article.likes}
            liked_by={article.liked_by}
            date = {date}
        />
    )
}

const DetailedPostViewPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null); // Post data state
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts') // Replace with your table name
          .select(`
            id, 
            created_by, 
            created_at, 
            title, 
            abstract, 
            text,
            tags,
            image_url, 
            likes,
            liked_by,
            users (
              first_name,
              last_name,
              user_name,
              unique_user_name,
              email
              )
          `)
          .eq('id', id) // Match the ID
          .single(); // Fetch a single record

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching details:', error.message);
        setPost(null); // Reset user if an error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="container mt-5 text-center">Loading post...</div>;
  }

  if (!post) {
    return <div className="container mt-5 text-center">Post not found.</div>;
  }

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <CardComponent article={post} />
      <CommentSection postId={id} />
    </div>
  );
};

export default DetailedPostViewPage;
