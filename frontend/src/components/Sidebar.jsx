import React from 'react';
import useAuthDetection from '../hooks/useAuthDetection';
import LoadingButton from '../components/LoadingButton';


const Sidebar = () => {
    const { isLoading, isUserLoggedIn } = useAuthDetection();

    if (isLoading) {
        return <LoadingButton />;
    }


    const renderAuthenticationButtons = () => {
        if (isUserLoggedIn) {
            return <li className="nav-item">
                <a className="nav-link d-flex align-items-center gap-2" href="/logout">
                    <svg className="bi"><use href="#door-closed"></use></svg>
                    Sign out
                </a>
            </li>
        }

        return <>
            <li className="nav-item">
                <a className="nav-link d-flex align-items-center gap-2" href="/login">
                    <svg className="bi"><use href="#door-open"></use></svg>
                    Sign In
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link d-flex align-items-center gap-2" href="/register">
                    <svg className="bi"><use href="#pencil"></use></svg>
                    Register
                </a>
            </li>
        </>
    }

    return (
        <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
            <div className="offcanvas-md offcanvas-end bg-body-tertiary" tabIndex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="sidebarMenuLabel">Company name</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                    <ul className="nav flex-column">
                        {isUserLoggedIn && <li className="nav-item">
                            <a className="nav-link d-flex align-items-center gap-2" href="/cardsmith">
                                <svg className="bi"><use href="#puzzle"></use></svg>
                                Cardsmith
                            </a>
                        </li>}
                        {isUserLoggedIn && <li className="nav-item">
                            <a className="nav-link d-flex align-items-center gap-2 active" aria-current="page" href="/inventory">
                                <svg className="bi"><use href="#house-fill"></use></svg>
                                Inventory
                            </a>
                        </li>}
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center gap-2" href="/shop">
                                <svg className="bi"><use href="#cart"></use></svg>
                                Shop
                            </a>
                        </li>
                    </ul>


                    <hr className="my-3" />


                    <ul className="nav flex-column mb-auto">
                        {renderAuthenticationButtons()}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;