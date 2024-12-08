import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../utils/supabase';

const FollowersPage = () => {
  const { id } = useParams(); // Extract the user ID from the URL
  const [followerIds, setFollowerIds] = useState([]);
  const [followerNames, setFollowerNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);

        // Fetch the followers array for the user with the given ID
        const { data, error } = await supabase
          .from('users')
          .select('followers')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Check if there are followers
        if (data?.followers && data.followers.length > 0) {
          setFollowerIds(data.followers);
        } else {
          setFollowerIds([]); // No followers
        }
      } catch (err) {
        console.error(err.message);
        setError('Failed to fetch followers.');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [id]);

  useEffect(() => {
    const fetchFollowerNames = async () => {
      if (followerIds.length === 0) {
        setFollowerNames([]); // No follower IDs to fetch
        return;
      }

      try {
        setLoading(true);

        // Fetch the follower details
        const { data, error } = await supabase
          .from('users')
          .select('id, user_name, unique_user_name')
          .in('id', followerIds);

        if (error) throw error;

        setFollowerNames(data || []);
      } catch (err) {
        console.error(err.message);
        setError('Failed to fetch follower details.');
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
      <h3 className="mb-3">Followers</h3>
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
        <p className="text-muted">0 followers</p>
      )}
    </div>
  );
};

export default FollowersPage;
