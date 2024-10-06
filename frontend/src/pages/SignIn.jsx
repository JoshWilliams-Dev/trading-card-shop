import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";



const SignIn = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorMap = {};

        const backendUrl = process.env.REACT_APP_BACKEND_URL;

        try {
            const response = await fetch(backendUrl + '/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                setSuccess('User registered successfully!');
                setEmail('');
                setPassword('');
                setError('');
                setErrors('');

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
                setErrors(errorMap);
            }
        } catch (err) {
            setError('Failed to connect to the server.');
            console.error(err);
        }
    };

    return (
        <div className="bg-light py-3 py-md-5 vh-100">
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                        <div className="bg-white p-4 p-md-5 rounded shadow-sm">
                            <div className="row">
                                <div className="col-12">
                                    <div className="text-center">
                                        <div className="d-inline-flex flex-column">
                                            <div className="fw-lighter fst-italic text-start text-danger" style={{ "fontSize": "x-small" }}>*Potential</div>
                                            <a href="#!">
                                                <img src="https://wp-avn.b-cdn.net/uploads/2022/12/main_logo.svg" alt="AVN Logo" width="175" height="57" />
                                            </a>
                                        </div>
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
                                        {error && <p style={{ color: 'red' }}>{error}</p>}
                                        {success && <p style={{ color: 'green' }}>{success}</p>}
                                    </div>
                                </div>
                            </form>
                            <div className="row">
                                <div className="col-12">
                                    <hr className="mt-5 mb-4 border-secondary-subtle" />
                                    <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center">
                                        <a href="#!" className="link-secondary text-decoration-none">Create new account</a>
                                        <a href="#!" className="link-secondary text-decoration-none">Forgot password</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;