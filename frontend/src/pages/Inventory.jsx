import React from 'react';
import CardCollection from '../components/CardCollection';
import Layout from '../components/Layout';

const Inventory = () => {
    return (
        <Layout title="Inventory">
            <div className='row my-3'>
                <div className='col-12'>
                    <p>Here you'll find the stash of cards you've been squirrelling away.</p>
                </div>
            </div>
            <CardCollection filterByLoggedInUser={true} cartEnabled={false} />
        </Layout>
    );
};

export default Inventory;