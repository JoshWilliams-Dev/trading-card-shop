import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import useRedirectIfLoggedIn from '../hooks/useRedirectIfLoggedIn';
import Layout from '../components/Layout';



const Register = () => {
    useRedirectIfLoggedIn();

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [errors, setErrors] = useState({});

    const validatePassword = (password) => {
        if (password.length < 16) {
            return "Password must be at least 16 characters long.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must contain at least one special character.";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorMap = {
            "global": []
        };

        if (password !== confirmPassword) {
            errorMap["password_confirmation"] = ["Passwords do not match."];
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            errorMap["password"] = [passwordError];
        }

        const backendUrl = process.env.REACT_APP_BACKEND_URL;

        try {
            const response = await fetch(backendUrl + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, "display_name": displayName }),
            });

            if (response.ok) {
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                const data = await response.json();

                localStorage.setItem('api_token', data.token);

                navigate('/login');
            } else {
                const data = await response.json();

                data.errors.forEach(error => {
                    if (!errorMap[error.param]) {
                        errorMap[error.param] = [];
                    }
                    errorMap[error.param].push(error.message);
                });
            }
        } catch (err) {
            console.error(err);
            errorMap.global.push(err.message);
        }

        const hasErrors = Object.values(errorMap).some(array => array.length > 0);
        if (hasErrors) {
            setErrors(errorMap);
        }
    };

    return (
        <Layout>
            <div>
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                            <div className="bg-secondary bg-gradient p-4 p-md-5 rounded shadow-sm">
                                <div className="text-center">
                                    <h1>Trading Card Shop</h1>
                                </div>
                                <div className='row my-3'>
                                    <div className='col-12'>
                                        <h2>User Registration</h2>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="row gy-3 gy-md-4 overflow-hidden">
                                        <div className="col-12">
                                            <label htmlFor="registrationEmailInput" className="form-label">Email address <span className="text-danger">*</span></label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                                                    </svg>
                                                </span>
                                                <input
                                                    name="registrationEmailInput"
                                                    id="registrationEmailInput"
                                                    type="email"
                                                    className="form-control"
                                                    title="Enter your email address."
                                                    placeholder="account@example.com"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            {errors.email && errors.email.map((msg, index) => (
                                                <span key={index} className="text-danger">{msg}</span>
                                            ))}
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="registrationPasswordInput" className="form-label">Password <span className="text-danger">*</span></label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-key" viewBox="0 0 16 16">
                                                        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                                                        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                    </svg>
                                                </span>
                                                <input
                                                    name="registrationPasswordInput"
                                                    id="registrationPasswordInput"
                                                    type="password"
                                                    className="form-control"
                                                    title="Enter your password."
                                                    aria-describedby="passwordHelpBlock"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div id="passwordHelpBlock" className="form-text text-info-emphasis small">
                                                Your password must be at least 16 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one of the following special characters:
                                                <mark className="text-nowrap">! @ # $ % ^ & * ( ) , . ? " : | &#123; &#125; &lt; &gt;</mark>
                                            </div>
                                            {errors.password && errors.password.map((msg, index) => (
                                                <span key={index} className="text-danger">{msg}</span>
                                            ))}
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="registrationPasswordConfirmationInput" className="form-label">Password confirmation <span className="text-danger">*</span></label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-key" viewBox="0 0 16 16">
                                                        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                                                        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                    </svg>
                                                </span>
                                                <input
                                                    name="registrationPasswordConfirmationInput"
                                                    id="registrationPasswordConfirmationInput"
                                                    type="password"
                                                    className="form-control"
                                                    title="Enter the same password you entered above."
                                                    required
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>
                                            {errors.password_confirmation && errors.password_confirmation.map((msg, index) => (
                                                <span key={index} className="text-danger">{msg}</span>
                                            ))}
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="displayNameInput" className="form-label">Preferred name <span className="text-danger">*</span></label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-vcard" viewBox="0 0 16 16">
                                                        <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
                                                        <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12z" />
                                                    </svg>
                                                </span>
                                                <input
                                                    name="displayNameInput"
                                                    id="displayNameInput"
                                                    type="text"
                                                    className="form-control"
                                                    title="Enter the name by which you'd like to be referred."
                                                    placeholder="Nameless"
                                                    required
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                />
                                            </div>
                                            {errors.display_name && errors.display_name.map((msg, index) => (
                                                <span key={index} className="text-danger">{msg}</span>
                                            ))}
                                        </div>
                                        <div className="col-12 text-center">
                                            <button className="btn btn-primary btn-lg mt-4" type="submit">Sign Up</button>
                                        </div>
                                        <div className="col-12">
                                            {errors.global && errors.global.map((msg, index) => (
                                                <span key={index} className="text-danger">{msg}</span>
                                            ))}
                                        </div>
                                    </div>
                                </form>

                                <div className="row">
                                    <div className="col-12">
                                        <hr className="mt-5 mb-4 border-primary-subtle" />
                                        <p className="m-0 text-white text-center">Already have an account? <a href="/login" className="link-light text-decoration-none">Log in</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Register;