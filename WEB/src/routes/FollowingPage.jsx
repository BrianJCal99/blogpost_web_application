import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../utils/supabase';

const FollowingPage = () => {
  const { id } = useParams(); // Extract the user ID from the URL
  const [followerIds, setFollowerIds] = useState([]);
  const [followerNames, setFollowerNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);

        // Fetch the 'following' array for the user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('following')
          .eq('id', id)
          .single();

        if (userError) throw userError;
        if (!userData?.following || userData.following.length === 0) {
          setFollowerIds([]);
          return;
        }

        setFollowerIds(userData.following);
      } catch (err) {
        console.error(err.message);
        setError('Failed to fetch followers');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [id]);

  useEffect(() => {
    const fetchFollowerNames = async () => {
      if (followerIds.length === 0) {
        setFollowerNames([]);
        return;
      }

      try {
        setLoading(true);

        // Fetch user details for each follower ID
        const { data: followerData, error: followerError } = await supabase
          .from('users')
          .select('id, user_name, unique_user_name')
          .in('id', followerIds);

        if (followerError) throw followerError;

        setFollowerNames(followerData);
      } catch (err) {
        console.error(err.message);
        setError('Failed to fetch follower names');
      } finally {
        setLoading(false);
      }
    };

    if (followerIds.length > 0) {
      fetchFollowerNames();
    }
  }, [followerIds]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Following</h3>
      {followerNames.length > 0 ? (
        <ul className="list-group">
          {followerNames.map((user) => (
            <li key={user.id} className="list-group-item">
              <Link to={`/user/${user.id}`} className="text-decoration-none">
                <strong>{user.user_name}</strong>
                <span className="text-muted"> @{user.unique_user_name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No followers found.</p>
      )}
    </div>
  );
};

export default FollowingPage;
