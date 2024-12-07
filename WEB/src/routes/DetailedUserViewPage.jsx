import React, { useState, useEffect, useContext } from 'react';
import Card from '../Card';
import { useParams,Link } from 'react-router-dom'; // For getting route parameters
import supabase from '../utils/supabase';
import { SessionContext } from '../context/userSession.context';

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

const DetailedUserViewPage = (props) => {
  const session = useContext(SessionContext);
  const { id: targetUserID } = useParams();
  const [targetUser, setTargetUser] = useState(null); // User data state
  const [postsList, setPostsList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading 
  const [following, setFollowing] = useState(false); // set following status
  const currentUserID = session?.user?.id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', targetUserID)
          .single();

        if (userError) throw userError;
        setTargetUser(userData);

        if(userData?.followers?.includes(currentUserID)){
          setFollowing(true)
        }
        
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
          .eq('created_by', targetUserID);

        if (postError) throw postError;
        setPostsList(postData);

      } catch (error) {
        console.error('Error fetching user or posts:', error.message);
        setTargetUser(null);
        setPostsList(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [targetUserID, currentUserID]);

  const handleFollow = async () => {
    try {
      // Ensure targetUser?.followers is an array before using it
      const currentFollowers = Array.isArray(targetUser?.followers) ? targetUser.followers : [];
      const currentUserFollowing = Array.isArray(session?.user?.following) ? session.user.following : [];
  
      // Determine the new followers list for the target user
      const updatedFollowers = following
        ? currentFollowers.filter((id) => id !== currentUserID) // Remove the current user if already following
        : [...currentFollowers, currentUserID]; // Add the current user if not following
  
      // Determine the new following list for the current user
      const updatedFollowing = following
        ? currentUserFollowing.filter((id) => id !== targetUserID) // Remove the target user if already following
        : [...currentUserFollowing, targetUserID]; // Add the target user if not following
  
      // Update the followers field for the target user
      const { error: followError } = await supabase
        .from("users")
        .update({ followers: updatedFollowers })
        .eq("id", targetUserID);
  
      if (followError) throw followError;
  
      // Update the following field for the current user
      const { error: followingError } = await supabase
        .from("users")
        .update({ following: updatedFollowing })
        .eq("id", currentUserID);
  
      if (followingError) throw followingError;
  
      // Toggle the 'following' state
      setFollowing(!following);
  
      // Optionally, update the targetUser and currentUser states to reflect changes immediately
      setTargetUser((prevUser) => ({
        ...prevUser,
        followers: updatedFollowers,
      }));
      session.user.following = updatedFollowing; // Assuming session.user is mutable
  
    } catch (error) {
      console.error("Error following/unfollowing user:", error.message);
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading user profile...</div>;
  }

  if (!targetUser) {
    return <div className="container mt-5 text-center">User not found.</div>;
  }

  if (!postsList) {
    return <div className="container mt-5 text-center">This user hasn't posted anything yet.</div>;
  }

  return (
    <div className="container my-5">
      <div className="card text-center my-3">
        <div className="card-header">
          BLOGPOST USER
        </div>
        <div className="card-body">
          <h5 className="card-title">{targetUser.user_name}</h5>
          <p className="card-text small text-muted">@{targetUser.unique_user_name}</p>
          <div>
            <Link to={`/users/${targetUserID}/followers`} className="btn btn-sm m-3">
              <span>Followers <strong>{targetUser?.followers?.length || 0}</strong></span>
            </Link>
            <Link to={`/users/${targetUserID}/following`} className="btn btn-sm m-3">
              <span>Following <strong>{targetUser?.following?.length || 0}</strong></span>
            </Link>
          </div>
          <button className='btn btn-sm btn-outline-primary m-3' onClick={handleFollow}>
            {following ? 'Unfollow' : 'Follow'}
          </button>
          <p className="card-text">{targetUser.first_name +  " " + targetUser.last_name || 'N/A'}</p>
          <p className="card-text">{targetUser.email}</p>
        </div>
        <div className="card-footer text-muted">
          Joined on {new Date(targetUser.created_at).toISOString().split('T')[0]}
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
