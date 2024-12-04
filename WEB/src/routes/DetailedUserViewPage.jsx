import React, { useState, useEffect } from 'react';
import Card from '../Card';
import { useParams } from 'react-router-dom'; // For getting route parameters
import supabase from '../utils/supabase';

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

const DetailedUserViewPage = () => {
  const { id } = useParams(); // Get user ID from the URL
  const [user, setUser] = useState(null); // User data state
  const [postsList, setPostsList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data: userData, error: userError } = await supabase
          .from('users') // Replace with your users table name
          .select('*')
          .eq('id', id) // Fetch user by ID
          .single(); // Expect a single record

        if (userError) throw userError;
        setUser(userData);

        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            id, 
            created_by, 
            created_at, 
            title, 
            abstract, 
            text,
            image_url, 
            users (
              first_name,
              last_name,
              user_name,
              unique_user_name,
              email
              )
          `)
          .eq('created_by', id);

          if (postError) throw postError;
          setPostsList(postData);

      } catch (error) {
        console.error('Error fetching user or posts:', error.message);
        setUser(null); // Reset user if an error occurs
        setPostsList(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="container mt-5 text-center">Loading user profile...</div>;
  }

  if (!user) {
    return <div className="container mt-5 text-center">User not found.</div>;
  }

  if (!postsList) {
    return <div className="container mt-5 text-center">This user haven't posted anything yet.</div>;
  }

  return (
    <div className="container my-5">
      <div className="card text-center my-3">
        <div className="card-header">
          {user.user_name}
        </div>
        <div className="card-body">
          <h5 className="card-title">{user.user_name}</h5>
          <p className="card-text small text-muted">@{user.unique_user_name}</p>
          <p className="card-text">{user.first_name +  " " + user.last_name|| 'N/A'}</p>
          <p className="card-text">{user.email}</p>
        </div>
        <div className="card-footer text-muted">
          Joined on {new Date(user.created_at).toISOString().split('T')[0]}
        </div>
      </div>
      <div className="row my-3">
        {postsList.map((article) => (
          <CardComponent key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
};

export default DetailedUserViewPage;
