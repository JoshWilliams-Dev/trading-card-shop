import React from 'react';
import CardCollection from '../components/CardCollection';
import Layout from '../components/Layout';


const Shop = () => {
    
    return (
        <Layout title="Storefront">
            <CardCollection filterByLoggedInUser={false} cartEnabled={true} />
        </Layout>
    );
};

export default Shop;