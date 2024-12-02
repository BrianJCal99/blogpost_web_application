import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For getting route parameters
import supabase from '../utils/supabase';

const DetailedUserViewPage = () => {
  const { id } = useParams(); // Get user ID from the URL
  const [user, setUser] = useState(null); // User data state
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users') // Replace with your users table name
          .select('*')
          .eq('id', id) // Fetch user by ID
          .single(); // Expect a single record

        if (error) throw error;
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error.message);
        setUser(null); // Reset user if an error occurs
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{user.user_name}'s Profile</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{user.user_name}</h5>
          <h6 className="card-title small text-muted">@{user.unique_user_name}</h6>
          <p className="card-text">{user.first_name +  " " + user.last_name|| 'N/A'}</p>
          <p className="card-text">{user.email}</p>
          {/* Add more fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default DetailedUserViewPage;
