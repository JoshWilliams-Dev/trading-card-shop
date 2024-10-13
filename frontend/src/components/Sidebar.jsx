import React from 'react';
import { NavLink } from 'react-router-dom';

import LoadingButton from '../components/LoadingButton';
import { useAuth } from '../contexts/AuthenticationContext';

import './Sidebar.css';


const Sidebar = () => {
    const { isUserLoggedIn, isLoading } = useAuth();


    return (
        <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary position-fixed">
            <div className="offcanvas-md offcanvas-end bg-body-tertiary" tabIndex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="sidebarMenuLabel">AVN Corporation</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                    <ul className="nav flex-column">
                        {isLoading && <li className="nav-item">
                            <LoadingButton />
                        </li>}
                        {!isLoading && <>
                            {isUserLoggedIn && <li className="nav-item">
                                <NavLink
                                    to="/cardsmith"
                                    className={({ isActive }) => isActive ? "nav-link d-flex align-items-center gap-2 active" : "nav-link d-flex align-items-center gap-2"}
                                >
                                    <svg className="bi"><use href="#puzzle"></use></svg>
                                    Cardsmith
                                </NavLink>
                            </li>}
                            {isUserLoggedIn && <li className="nav-item">
                                <NavLink
                                    to="/inventory"
                                    className={({ isActive }) => isActive ? "nav-link d-flex align-items-center gap-2 active" : "nav-link d-flex align-items-center gap-2"}
                                >
                                    <svg className="bi"><use href="#house-fill"></use></svg>
                                    Inventory
                                </NavLink>
                            </li>}
                            <li className="nav-item">
                                <NavLink
                                    to="/shop"
                                    className={({ isActive }) => isActive ? "nav-link d-flex align-items-center gap-2 active" : "nav-link d-flex align-items-center gap-2"}
                                >
                                    <svg className="bi"><use href="#cart"></use></svg>
                                    Shop
                                </NavLink>
                            </li>
                            {isUserLoggedIn && <li><hr className="my-3" /></li>}
                            {isUserLoggedIn && <li className="nav-item">
                                <NavLink
                                    to="/cart"
                                    className={({ isActive }) => isActive ? "nav-link d-flex align-items-center gap-2 active" : "nav-link d-flex align-items-center gap-2"}
                                >
                                    <svg className="bi"><use href="#cart"></use></svg>
                                    Cart
                                </NavLink>
                            </li>}
                        </>}
                    </ul>

                    {!isLoading && <>
                        <hr className="my-3" />
                        <ul className="nav flex-column mb-auto">
                            {isUserLoggedIn && <li className="nav-item">
                                <NavLink
                                    to="/logout"
                                    className={({ isActive }) => isActive ? "nav-link d-flex align-items-center gap-2 active" : "nav-link d-flex align-items-center gap-2"}
                                >
                                    <svg className="bi"><use href="#door-closed"></use></svg>
                                    Sign out
                                </NavLink>
                            </li>}
                            {!isUserLoggedIn && <>
                                <li className="nav-item">
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) => isActive ? "nav-link d-flex align-items-center gap-2 active" : "nav-link d-flex align-items-center gap-2"}
                                    >
                                        <svg className="bi"><use href="#door-open"></use></svg>
                                        Sign In
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/register"
                                        className={({ isActive }) => isActive ? "nav-link d-flex align-items-center gap-2 active" : "nav-link d-flex align-items-center gap-2"}
                                    >
                                        <svg className="bi"><use href="#pencil"></use></svg>
                                        Register
                                    </NavLink>
                                </li>
                            </>}
                        </ul>
                    </>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;