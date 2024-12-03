import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import supabase from "./utils/supabase";

function NewArticle() {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: '',
        abstract: '',
        text: '',
    });

    const [image, setImage] = useState(null); // For the selected image file

    const { title, abstract, text } = post;

    const handleChange = (event) => {
        const { id, value } = event.target;
        setPost((prevValue) => {
            return {
                ...prevValue,
                [id]: value
            };
        });
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]); // Store the selected file
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let imageUrl = null;

        if (image) {
            // Upload the image to Supabase
            const { data, error: uploadError } = await supabase.storage
                .from('post_image')
                .upload(`public/${Date.now()}-${image.name}`, image);

            if (uploadError) {
                alert(`Image upload failed: ${uploadError.message}`);
                return;
            }

            // Generate the public URL of the uploaded image
            const { data: publicUrlData } = supabase.storage
                .from('post_image')
                .getPublicUrl(data.path);

            imageUrl = publicUrlData.publicUrl;
        }

        // Insert the post into the database
        const { error } = await supabase
            .from('posts')
            .insert({
                title: title,
                abstract: abstract,
                text: text,
                image_url: imageUrl, // Save the image URL
            });

        if (error) {
            alert(error.message);
        } else {
            alert("You have successfully posted your new post!");
            navigate("/myposts");
        }
    };

    return (
        <div>
            <form>
                <div className="form-group m-3">
                    <label htmlFor="title">Title: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="Enter a descriptive title"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group m-3">
                    <label htmlFor="abstract">Abstract: </label>
                    <textarea
                        className="form-control"
                        id="abstract"
                        placeholder="Enter a 1-paragraph abstract"
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="form-group m-3">
                    <label htmlFor="text">Text: </label>
                    <textarea
                        rows="4"
                        cols="50"
                        className="form-control"
                        id="text"
                        placeholder="Enter the post text"
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="form-group m-3">
                    <label htmlFor="image">Image: </label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary m-3" onClick={handleSubmit}>
                    Post
                </button>
            </form>
        </div>
    );
}

export default NewArticle;
