// frontend/src/components/Breadcrumbs.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ categoryId, categoryName, productName }) => {
    return (
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
            <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                    <Link to="/" className="hover:text-pink-500">Home</Link>
                    <span className="mx-2">/</span>
                </li>
                <li className="flex items-center">
                    <Link to="/products" className="hover:text-pink-500">Products</Link>
                    <span className="mx-2">/</span>
                </li>
                {categoryName && (
                    <li className="flex items-center">
                        <Link to={`/products?categoryId=${categoryId}`} className="hover:text-pink-500">{categoryName}</Link>
                        <span className="mx-2">/</span>
                    </li>
                )}
                <li className="text-gray-700 font-medium" aria-current="page">
                    {productName}
                </li>
            </ol>
        </nav>
    );
};

export default Breadcrumbs;