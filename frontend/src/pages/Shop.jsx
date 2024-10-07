import React from 'react';
import CardCollection from '../components/CardCollection';
import Layout from '../components/Layout';
import useAuthDetection from '../hooks/useAuthDetection';
import LoadingButton from '../components/LoadingButton';


const Shop = () => {
    const { isLoading, isUserLoggedIn } = useAuthDetection();

    if (isLoading) {
        return <LoadingButton />;
    }

    return (
        <Layout title="Storefront">
            <CardCollection />
        </Layout>
    );
};

export default Shop;