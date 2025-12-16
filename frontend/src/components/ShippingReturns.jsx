import React, { useState } from 'react';
import { FiTruck, FiRefreshCw, FiChevronDown, FiShield } from 'react-icons/fi';

const AccordionItem = ({ icon: Icon, title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 last:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 group"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-500 group-hover:bg-purple-50 group-hover:text-purple-500'}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className={`font-semibold transition-colors duration-200 ${isOpen ? 'text-purple-700' : 'text-gray-700 group-hover:text-purple-600'}`}>{title}</span>
                </div>
                <div className={`transform transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180 text-purple-500' : ''}`}>
                    <FiChevronDown className="w-5 h-5" />
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed pl-14 pr-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ShippingReturns = () => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mt-6">
            <AccordionItem icon={FiTruck} title="Shipping Information" defaultOpen={true}>
                <p className="mb-2">We offer <strong>Fast Express Shipping</strong> (24-48h) for all domestic orders.</p>
                <ul className="list-disc pl-4 space-y-1 mt-2 mb-2">
                    <li>Orders placed before 2 PM are processed same day</li>
                    <li>Real-time tracking number provided</li>
                    <li>Secure packaging to ensure safety</li>
                </ul>
            </AccordionItem>
            <AccordionItem icon={FiRefreshCw} title="Return Policy">
                <p className="mb-2">We want you to be 100% satisfied with your purchase.</p>
                <p>If you're not happy, you can return your items within <strong>30 days</strong> of delivery for a full refund or exchange. Items must be unused and in original packaging.</p>
            </AccordionItem>
            <AccordionItem icon={FiShield} title="Satisfaction Guarantee">
                <p>All our products are 100% authentic and quality checked. We offer a money-back guarantee if the product doesn't meet our high standards.</p>
            </AccordionItem>
        </div>
    );
};

export default ShippingReturns;
