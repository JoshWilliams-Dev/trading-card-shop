import React from 'react';
import './MainContent.css'; // Optional custom styles

const MainContent = ({title, children}) => {
  return (
    <div className="main-content">
      {/* Header section */}
      <header className="main-header bg-primary text-white p-3">
        <h1>{title}</h1>
      </header>
      
      {/* Content section */}
      <div className="content-area p-4">
        {children}
      </div>
    </div>
  );
};

export default MainContent;