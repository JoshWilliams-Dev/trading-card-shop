import React from 'react';
import Layout from '../components/Layout';
// import useAuthDetection from '../hooks/useAuthDetection';
// import LoadingButton from '../components/LoadingButton';
import Cart from '../components/Cart';


const CartPage = () => {
    // const { isLoading, isUserLoggedIn } = useAuthDetection();

    // if (isLoading) {
    //     return <LoadingButton />;
    // }

    return (
        <Layout title="Shopping Cart">
            <Cart />
        </Layout>
    );
};

export default CartPage;