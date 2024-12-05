import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import supabase from "./utils/supabase";

const TagsList = ({limit}) => {
    const navigate = useNavigate();
    const [tagsList, setTagsList] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading

    const handleTagClick = (tag) => {
        navigate(`/tags/${tag}`); // Navigate to the details page with the tag value
    };

    // Fetch tags from the Supabase 'tags' table when the component mounts
    useEffect(() => {
        const fetchTags = async () => {
            const { data, error } = await supabase
                .from("tags")
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

    if (!tagsList) {
    return <div className="container mt-5 text-center">No tags available...</div>;
    }

    // If a limit is passed, slice the articleList
    const displayedTags = limit ? tagsList.slice(0, limit) : tagsList;

    return (
            <div className="row">
                <div className="d-flex flex-wrap justify-content-center">
                    {displayedTags.map(tag => (
                        <button key={tag.id} className="btn btn-lg btn-light m-4" onClick={() => handleTagClick(tag.name)}>
                            #{tag.name}
                        </button>
                    ))}
                </div>
            </div>
    );
};

export default TagsList;