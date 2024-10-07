import React from 'react';
import PropTypes from 'prop-types';


const LayoutContent = ({ title, children, actionButtons }) => {
    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-5 border-bottom">
                    <h1 className="h2">{title}</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        {actionButtons}
                    </div>
                </div>


                {children}

                

                
            </main>
    );
};

// Define PropTypes for LayoutContent
LayoutContent.propTypes = {
    title: PropTypes.string.isRequired, // Title is required and must be a string
    children: PropTypes.node.isRequired, // Children is required and can be any renderable node
    //actionButtons: PropTypes.arrayOf(PropTypes.node).isRequired, // Action buttons must be an array of nodes
};

export default LayoutContent;