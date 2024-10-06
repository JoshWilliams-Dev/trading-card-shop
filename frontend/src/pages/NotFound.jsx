import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center vh-100">
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for does not exist.</p>
      <Link to="/" style={styles.link}>Go back to Home</Link>
    </div>
  );
};


const styles = {
  heading: {
    fontSize: '48px',
    margin: '20px 0',
  },
  paragraph: {
    fontSize: '18px',
  },
  link: {
    marginTop: '20px',
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '20px',
  }
};

export default NotFound;