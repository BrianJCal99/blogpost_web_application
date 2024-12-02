import React, { useEffect, useState } from "react";
import Card from "./Card";
import supabase from "./utils/supabase.js";


function CardComponent({ id, title, abstract, users, created_at, created_by }) {
  const date = new Date(created_at).toISOString().split('T')[0];

  return (
      <Card
          post_id={id}
          title={title}
          abstract={abstract}
          post_user={users?.unique_user_name}
          date={date}
          post_user_id={created_by}
      />
  );
}

const ArticleList = ({limit}) => {
    const [articleList, setArticleList] = useState([]);
    

    useEffect(() => {
        const fetchData = async () => {
          const { data, error } = await supabase
            .from('posts')
            .select(`
              id, 
              created_by, 
              created_at, 
              title, 
              abstract, 
              text, 
              users (
                first_name,
                last_name,
                user_name,
                unique_user_name,
                email
                )
            `);

    
          if (error) {
            console.error(error.message);
          } else {
            // console.log(data);
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