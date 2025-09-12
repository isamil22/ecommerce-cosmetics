import React from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const SocialShare = ({ productUrl, productName }) => {
    const encodedUrl = encodeURIComponent(productUrl);
    const encodedName = encodeURIComponent(productName);

    return (
        <div className="flex items-center mt-4">
            <span className="text-sm font-semibold text-gray-600 mr-4">Share this product:</span>
            <div className="flex space-x-3">
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600"
                    aria-label="Share on Facebook"
                >
                    <FaFacebook size={24} />
                </a>
                <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-400"
                    aria-label="Share on Twitter"
                >
                    <FaTwitter size={24} />
                </a>
                <a
                    href={`https://api.whatsapp.com/send?text=${encodedName}%20-%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-green-500"
                    aria-label="Share on WhatsApp"
                >
                    <FaWhatsapp size={24} />
                </a>
            </div>
        </div>
    );
};

export default SocialShare;