import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../utils/supabase';
import CardLarge from '../CardLarge';

function CardComponent({article}) {
    const timestamp = article.created_at;
    const date = new Date(timestamp).toISOString().split('T')[0];
    
    return (
        <CardLarge
            id = {article.id}
            title = {article.post_title}
            abstract = {article.post_abstract}
            text = {article.post_text}
            author = {article.post_user}
            email = {article.post_user_email}
            date = {date}
        />
    )
}

const DetailedPostViewPage = () => {
  const { id } = useParams(); // Get the item ID from the URL
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data, error } = await supabase
          .from('posts') // Replace with your table name
          .select('*')
          .eq('id', id) // Match the ID
          .single(); // Fetch a single record

        if (error) throw error;
        setItem(data);
      } catch (error) {
        console.error('Error fetching details:', error.message);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <CardComponent article={item} />
    </div>
  );
};

export default DetailedPostViewPage;
