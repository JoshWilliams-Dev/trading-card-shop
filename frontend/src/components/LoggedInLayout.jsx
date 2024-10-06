import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';


const LoggedInLayout = ({ title, children }) => {
    return (
        <div className="container-fluid vh-100">
            <div className="row">
                {/* Sidebar on medium and larger screens */}
                <div className="col-md-2 d-none d-md-block">
                    <Sidebar />
                </div>

                {/* Main content area, takes full width on smaller screens */}
                <div className="col-12 col-md-10">
                    <MainContent title={title}>
                        {children}
                    </MainContent>
                </div>
            </div>
        </div>
    );
};

export default LoggedInLayout;