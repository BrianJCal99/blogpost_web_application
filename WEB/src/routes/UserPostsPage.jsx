import React, { useEffect, useState, useContext } from "react";
import Card from "../Card";
import supabase from "../utils/supabase";
import { SessionContext } from "../context/userSession.context";
import { Link } from 'react-router-dom'

function CardComponent({ id, title, abstract, users, created_at, created_by, image_url, likes, liked_by }) {
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
          likes={likes}
          liked_by={liked_by}
      />
  );
}

const UserPostsPage = () => {
    const session = useContext(SessionContext);
    const [articleList, setArticleList] = useState([]); // Post list state
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchData = async () => {
          try {
            
          const { data, error } = await supabase
          .from('posts')
          .select(`
            id, 
            created_by, 
            created_at, 
            title, 
            abstract, 
            text,
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
          .eq('created_by', session?.user.id);

          if (error) throw error;
          setArticleList(data);
          } catch (error) {
            console.error('Error fetching details:', error.message);
            setArticleList(null); // Reset user if an error occurs
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [session]);

      if (loading) {
        return <div className="container mt-5 text-center">Loading user posts...</div>;
      }
    
      if (!articleList) {
        return <div className="container mt-5 text-center">No posts found.</div>;
      }
    
    return(
      <div className="container">
        <div className="row">
          <div className="col text-center">
              <h1 className='text-center mt-5 mb-5'>My Posts</h1>
          </div>
          {articleList.length === 0 ? (
            <div className="text-center">
              <h4>Hmmm... Looks like you haven't posted anything yet.</h4> 
              <h5>Start blogging now.</h5>
              <Link to="/post" className="btn btn-primary m-3">New Post</Link>
            </div>
          ) : (
            <div className="row">
              {articleList.map((article) => (
                <CardComponent key={article.id} {...article} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
}

export default UserPostsPage;