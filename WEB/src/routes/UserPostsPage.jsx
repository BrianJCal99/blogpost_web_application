import React, { useEffect, useState, useContext } from "react";
import Card from "../Card";
import supabase from "../utils/supabase";
import { SessionContext } from "../context/userSession.context";
import { Link } from 'react-router-dom'

function CardComponent(article) {
    const timestamp = article.created_at;
    const date = new Date(timestamp).toISOString().split('T')[0];
    
    return (
        <Card
            id = {article.id}
            title = {article.post_title}
            text = {article.post_text}
            authour = {article.owner}
            date = {date}
        />
    )
}

const UserPostsPage = () => {
    const session = useContext(SessionContext);
    const [articleList, setArticleList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const { data, error } = await supabase
          .from('articles')
          .select()
          .eq('created_by', session?.user.id);
    
          if (error) {
            console.error(error.message);
          } else {
            console.log(data);
            setArticleList(data);
          }
        };
    
        fetchData();
      }, [session]);
    
    return(
      <div className="container">
        <div className="row">
          <div className="col text-center">
              <h1 className='text-center mt-5 mb-5'>User Posts</h1>
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