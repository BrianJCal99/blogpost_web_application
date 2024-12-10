import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { SessionContext } from '../context/userSession.context';
import supabase from '../utils/supabase';
import Card from '../Card';

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

const UserProfilePage = () => {
    const session = useContext(SessionContext);
    const [postsList, setPostsList] = useState([]);
    const [loading, setLoading] = useState(); // Loading state
    const [currentUser, setCurrentUser] = useState(); // set current user from user table using auth

    useEffect(() => {
        const fetchUser = async () => {
          try {
            setLoading(true); 
            const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session?.user?.id)
            .single();

            if (userError) throw userError;
            setCurrentUser(userData);

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
              .eq('created_by', session?.user?.id);
    
              if (postError) throw postError;
              setPostsList(postData);
    
          } catch (error) {
            console.error('Error fetching posts:', error.message);
            setPostsList(null);
          } finally {
            setLoading(false);
          }
        };
    
        fetchUser();
      }, [session?.user?.id]);

      if (loading) {
        return <div className="container mt-5 text-center">Loading user posts...</div>;
      }

      if (!postsList) {
        return <div className="container mt-5 text-center">You haven't posted anything yet...</div>;
      }

    return (
        <div className='container'>
                {session ? (
                    <div className="card text-center">
                        <div className="card-header bg-white">
                            MY PROFILE
                        </div>
                        <div className="card-body bg-white">
                            <h5 className="card-title">@{session?.user?.user_metadata?.uniqueUserName}</h5>
                            <p className="card-text small text-muted">@{session?.user?.user_metadata?.uniqueUserName}</p>
                            <p className="card-text">{session?.user?.user_metadata?.firstName + " " + session?.user?.user_metadata?.lastName || "User Name"}</p>
                            <p className="card-text">{session?.user.email || "User Email"}</p>
                            <div>
                                <Link to={`/myprofile/${session?.user?.id}/followers`} className="btn btn-sm mr-3">
                                <span>Followers <strong>{currentUser?.followers?.length || 0}</strong></span>
                                </Link>
                                <Link to={`/myprofile/${session?.user?.id}/following`} className="btn btn-sm ml-3">
                                <span>Following <strong>{currentUser?.following?.length || 0}</strong></span>
                                </Link>
                            </div>
                        </div>
                        <div className="card-footer bg-white small text-muted">
                            Joined on {new Date(session?.user?.created_at).toISOString().split('T')[0]}
                        </div>
                    </div>
                ) : (
                    <div className="container text-center my-3">
                        <div className="alert alert-primary m-3" role="alert">
                        Please{" "}
                        <Link to="/signin" className="btn btn-primary m-3">
                            Sign in
                        </Link>
                        to continue.
                        </div>
                    </div>
                )}
            <div className="row my-4">
                {postsList.length === 0 ? (
                    <div className="text-center w-100">
                        <h4>Hmmm... Looks like you haven't posted anything yet.</h4>
                        <h5>Start blogging now.</h5>
                        <Link to="/newpost" className="btn btn-primary m-3">New Post</Link>
                    </div>
                ) : (
                    <div className="row">
                        {postsList.map((article) => (
                            <CardComponent key={article.id} {...article} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;
