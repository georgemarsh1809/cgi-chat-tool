import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (error) => {
        error.preventDefault();
        const {target: [email, password]} = error

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/')
            console.log("Logged in")
        } catch (err) {
            setError(true);
        }
    };



    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">CGI Chat Tool</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <button>Sign In</button>
                    {error && <span>Something went wrong...</span>}
                </form>
                <p>You don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}

export default Login;

