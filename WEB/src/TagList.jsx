import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import supabase from "./utils/supabase";

const TagList = ({limit}) => {
    const navigate = useNavigate();
    const [tagsList, setTagsList] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading

    const handleTagClick = (tag) => {
        navigate(`/tag/${tag}`); // Navigate to the details page with the tag value
    };

    // Fetch tags from the Supabase 'tags' table when the component mounts
    useEffect(() => {
        const fetchTags = async () => {
            const { data, error } = await supabase
                .from("tag")
                .select("*");

            if (error) {
                console.error("Error fetching tags:", error);
            } else {
                setTagsList(data);
            }
            setLoading(false);
        };

        fetchTags();
    }, []);

    if (loading) {
        return <div className="container mt-5 text-center">Loading tags...</div>;
      }

    if (!tagsList || tagsList.length === 0) {
    return <div className="container mt-5 text-center">No tags available...</div>;
    }

    // If a limit is passed, slice the articleList
    const displayedTags = limit ? tagsList.slice(0, limit) : tagsList;

    return (
            <div className="row">
                <div className="d-flex flex-wrap justify-content-center">
                    {displayedTags.map(tag => (
                        <button key={tag.id} className="btn btn-light m-4" onClick={() => handleTagClick(tag.id)}>
                            #{tag.name}
                        </button>
                    ))}
                </div>
            </div>
    );
};

export default TagList;