import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from '../api/loginService';


const SignOut = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            await logout();
          } catch (error) {
            console.log("Error logging out:", error);
          }
        };
    
        fetchData();
        navigate('/login');

      }, [navigate]);

    return (
        <div className="container">
          <h2>Logging you out...</h2>
        </div>
      );
}

export default SignOut;