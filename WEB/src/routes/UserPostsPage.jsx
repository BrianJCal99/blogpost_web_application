import React, { useEffect, useState, useContext } from "react";
import Card from "../Card";
import supabase from "../utils/supabase";
import { SessionContext } from "../context/userSession.context";
import { Link } from 'react-router-dom';

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
    const [articleList, setArticleList] = useState([]); // User's posts
    const [likedArticleList, setLikedArticleList] = useState([]); // Liked posts
    const [loading, setLoading] = useState(true); // Loading state
    const [activeTab, setActiveTab] = useState("myPosts"); // State for tab switching

    useEffect(() => {
        const fetchUserPosts = async () => {
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
            console.error('Error fetching user posts:', error.message);
            setArticleList(null);
          } finally {
            setLoading(false);
          }
        };

        const fetchLikedPosts = async () => {
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
              .filter('liked_by', 'cs', `{${session?.user?.user_metadata?.uniqueUserName}}`); // Filter posts liked by the current user

            if (error) throw error;
            setLikedArticleList(data);
          } catch (error) {
            console.error('Error fetching liked posts:', error.message);
            setLikedArticleList([]);
          }
        };

        fetchUserPosts();
        fetchLikedPosts();
    }, [session]);

    if (loading) {
        return <div className="container mt-5 text-center">Loading user posts...</div>;
    }

    if (!articleList) {
        return <div className="container mt-5 text-center">No posts found.</div>;
    }

    return (
      <div className="container">
          <div className="row mt-4">
              <div className="col text-center">
                  <h1 className="mt-5 mb-4">My Content</h1>
                  <div className="btn-group" role="group" aria-label="Tab navigation">
                      <button
                          type="button"
                          className={`btn ${activeTab === "myPosts" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setActiveTab("myPosts")}
                      >
                          My Posts
                      </button>
                      <button
                          type="button"
                          className={`btn ${activeTab === "likedPosts" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setActiveTab("likedPosts")}
                      >
                          Liked Posts
                      </button>
                  </div>
              </div>
          </div>

          {activeTab === "myPosts" && (
              <div className="row my-4">
                  {articleList.length === 0 ? (
                      <div className="text-center w-100">
                          <h4>Hmmm... Looks like you haven't posted anything yet.</h4>
                          <h5>Start blogging now.</h5>
                          <Link to="/newpost" className="btn btn-primary m-3">New Post</Link>
                      </div>
                  ) : (
                      <div className="row">
                          {articleList.map((article) => (
                              <CardComponent key={article.id} {...article} />
                          ))}
                      </div>
                  )}
              </div>
          )}

          {activeTab === "likedPosts" && (
              <div className="row mt-4">
                  {likedArticleList.length === 0 ? (
                      <div className="text-center w-100">
                          <h4>You haven't liked any posts yet.</h4>
                          <h5>Start reading now.</h5>
                          <Link to="/posts" className="btn btn-primary m-3">Posts</Link>
                      </div>
                  ) : (
                      <div className="row">
                          {likedArticleList.map((article) => (
                              <CardComponent key={article.id} {...article} />
                          ))}
                      </div>
                  )}
              </div>
          )}
      </div>
  );
};

export default UserPostsPage;
