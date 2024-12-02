import React,{useState, useContext} from "react";
import {useNavigate} from 'react-router-dom'
import supabase from "./utils/supabase";
import { SessionContext } from "./context/userSession.context";

function NewArticle() {
    const session = useContext(SessionContext);
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: '',
        abstract: '',
        text:'',
    })

    const {title, abstract, text} = post;
       
    const handleChange = (event)=>{
        const {id, value} = event.target
        setPost ((preValue)=>{  
        return {
        ...preValue,
        [id]: value
        }
        })
    }

    const handleSubmit = async(event) =>
        {
            event.preventDefault();

            const { error } = await supabase
                .from('posts')
                .insert
                ({  
                    post_user: session?.user?.user_metadata?.firstName + " " + session?.user?.user_metadata?.lastName,
                    post_user_email: session?.user?.email,
                    post_title: title,
                    post_abstract: abstract,
                    post_text: text,

                });
            if (error){
                alert(error.message);
            }else{
                alert("You have successfully posted your new post!")
                navigate ("/myposts");
            }

            
        }

    return (
        <div>
            <form>
                <div className="form-group m-3">
                    <label for="title">Title: </label>
                    <input type="text" className="form-control" id="title" placeholder="Enter a descriptive title" onChange = {handleChange}/>
                </div>
                <div className="form-group m-3">
                    <label for="abstract">Abstract: </label>
                    <textarea className="form-control" id="abstract" placeholder="Enter a 1-paragraoh abstract" onChange = {handleChange}></textarea>
                </div>
                <div className="form-group m-3">
                    <label for="text">Text: </label>
                    <textarea rows="4" cols="50" className="form-control" id="text" placeholder="Enter a 1-paragraoh abstract" onChange = {handleChange}></textarea>
                </div>
                <button type="submit" className="btn btn-primary m-3" onClick={handleSubmit}>Post</button>
            </form>
        </div>
    )
}

export default NewArticle;