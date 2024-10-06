import useRedirectIfNotLoggedIn from '../hooks/useRedirectIfNotLoggedIn';

const ProtectedRoute = ({ children }) => {
    useRedirectIfNotLoggedIn()

    return children;
};

export default ProtectedRoute;