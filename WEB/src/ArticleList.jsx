import React, { useEffect, useState } from "react";
import Card from "./Card";
import supabase from "./utils/supabase.js";

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

const ArticleList = ({limit}) => {
    const [articleList, setArticleList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const { data, error } = await supabase.from('articles').select();
    
          if (error) {
            console.error(error.message);
          } else {
            console.log(data);
            setArticleList(data);
          }
        };
    
        fetchData();
      }, []);
    
    // If a limit is passed, slice the articleList
    const displayedArticles = limit ? articleList.slice(0, limit) : articleList;
    
    return(
        <div className="row">
            {displayedArticles.map((article) => (
                <CardComponent key={article.id} {...article} />
            ))}
        </div>
    )
}

export default ArticleList;