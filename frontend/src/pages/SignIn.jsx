import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login } from '../api/loginService';
import useRedirectIfLoggedIn from '../hooks/useRedirectIfLoggedIn';
import Layout from '../components/Layout';



const SignIn = () => {
    useRedirectIfLoggedIn();

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});



    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorMap = {
            "global": []
        };

        try {
            const response = await login(email, password);

            if (response.ok) {
                setEmail('');
                setPassword('');
                setErrors('');

                navigate('/shop');
            } else {
                const data = await response.json();

                data.errors.forEach(error => {
                    const paramKey = error.param || "global";

                    if (!errorMap[paramKey]) {
                        errorMap[paramKey] = [];
                    }
                    errorMap[paramKey].push(error.message);
                });

                setPassword('');
            }
        } catch (err) {
            console.warn('Login did not process as expected', err);

            errorMap.global.push(err.message);
        }

        const hasErrors = Object.values(errorMap).some(array => array.length > 0);
        if (hasErrors) {
            setErrors(errorMap);
        }
    };

    return (
        <Layout>
            <div className="py-3 py-md-5">
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                            <div className="bg-secondary bg-gradient p-4 p-md-5 rounded shadow-sm">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="text-center">
                                            <h1>Trading Card Shop</h1>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="row gy-3 gy-md-4 overflow-hidden">
                                        <div className="col-12">
                                            <label htmlFor="loginEmailInput" className="form-label">Email address <span className="text-danger">*</span></label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                                                    </svg>
                                                </span>
                                                <input
                                                    name="loginEmailInput"
                                                    id="loginEmailInput"
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
                                            <label htmlFor="loginPasswordInput" className="form-label">Password <span className="text-danger">*</span></label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-key" viewBox="0 0 16 16">
                                                        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                                                        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                    </svg>
                                                </span>
                                                <input
                                                    name="loginPasswordInput"
                                                    id="loginPasswordInput"
                                                    type="password"
                                                    className="form-control"
                                                    title="Enter your password."
                                                    aria-describedby="passwordHelpBlock"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            {errors.password && errors.password.map((msg, index) => (
                                                <span key={index} className="text-danger">{msg}</span>
                                            ))}
                                        </div>
                                        <div className="col-12 text-center">
                                            <button className="btn btn-primary btn-lg mt-4" type="submit">Log In</button>
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
                                        <div className="text-white d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center">
                                            <a href="/register" className="link-light text-decoration-none">Create new account</a>
                                        </div>
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

export default SignIn;