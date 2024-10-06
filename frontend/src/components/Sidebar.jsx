import React from 'react';
import './Sidebar.css'; // Import the custom styles

const Sidebar = () => {
    return (

        <div className="sidebar bg-secondary vh-100">

            <div className="row justify-content-center py-3">
                <div className="col-auto">
                    <div className="text-center">
                        <div className="d-inline-flex flex-column">
                            <div className="fw-lighter fst-italic text-start text-danger">*Potential</div>
                            <a href="#!">
                                <img src="https://wp-avn.b-cdn.net/uploads/2022/12/main_logo.svg" alt="AVN Logo" width="175" height="57" />
                            </a>
                        </div>
                        <h1 className="text-white">Trading Card Shop</h1>
                    </div>
                </div>
            </div>


            <nav>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a href="/cardsmith" className="nav-link sidebar-link">Cardsmith</a>
                    </li>
                    <li className="nav-item">
                        <a href="/cards" className="nav-link sidebar-link">My Cards</a>
                    </li>
                    <li className="nav-item">
                        <a href="/shop" className="nav-link sidebar-link">Shop</a>
                    </li>
                    <li className="nav-item">
                        <a href="/logout" className="nav-link sidebar-link">Logout</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;