import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import Input from '../Input';
import supabase from '../utils/supabase';

const SignupPage = (props) => {
    const navigate = useNavigate();
    const [contact, setContact] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const {firstName, lastName, email, password, confirmPassword} = contact;

    console.log(contact);

    const handleChange = (event)=>{
        const {name, value} = event.target
        setContact ((preValue)=>{  
        return {
        ...preValue,
        [name]: value
        }
        })
    }

    const handleSignup = async(event) =>
    {
        event.preventDefault();

        if(password !== confirmPassword){
            alert('Passowrds do not match!')
            return;
        }

        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    firstName: firstName,
                    lastName: lastName
                }
                }
        });
        if (error){
            alert(error.message);
        }else{
            alert('Successfully signed in!');
            navigate ("/profile");
        }
    }

    return (
        <div className="p-4 d-flex justify-content-center pb-4">
            <div>
                <h5 className="m-5">Create a BLOGPOST Account</h5>
                
                <Input
                name= 'firstName'
                type= 'text'
                placeholder = 'first name'
                onChange = {handleChange}
                value = {contact.firstName}
                />

                <Input
                name= 'lastName'
                type= 'text'
                placeholder = 'last name'
                onChange = {handleChange}
                value = {contact.lastName}
                />

                <Input
                name= 'email'
                type= 'email'
                placeholder = 'email'
                onChange = {handleChange}
                value = {contact.email}
                />

                <Input
                name= 'password'
                type= 'password'
                placeholder = 'password'
                onChange = {handleChange}
                value = {contact.password}
                />

                <Input
                name= 'confirmPassword'
                type= 'password'
                placeholder = 'confirm password'
                onChange = {handleChange}
                value = {contact.confirmPassword}
                />

                <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-block mb-4" onClick={handleSignup}>Sign up</button>
                </div>

                <div className="text-center">
                    <p>Already have an account? <Link to="/signin">Sign in</Link></p>
                </div>
            </div>
        </div>
        );
}

export default SignupPage;