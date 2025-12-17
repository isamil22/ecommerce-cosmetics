import React, { useState } from 'react';
import { FiTruck, FiRefreshCw, FiChevronDown, FiShield } from 'react-icons/fi';

const AccordionItem = ({ icon: Icon, title, children, defaultOpen = false, delay }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            className="glass-panel-pro rounded-2xl mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg animate-slide-up"
            style={{ animationDelay: delay }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/40 transition-all duration-200 group"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isOpen ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white transform scale-110' : 'bg-white text-gray-500 group-hover:bg-purple-50 group-hover:text-purple-500'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-bold text-lg transition-colors duration-200 ${isOpen ? 'text-gray-900' : 'text-gray-700 group-hover:text-purple-600'}`}>{title}</span>
                </div>
                <div className={`transform transition-transform duration-300 text-gray-400 bg-white/50 p-2 rounded-full ${isOpen ? 'rotate-180 text-purple-600 bg-purple-50' : ''}`}>
                    <FiChevronDown className="w-5 h-5" />
                </div>
            </button>
            <div
                className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-4 pt-0 text-sm lg:text-base text-gray-600 leading-relaxed pl-16 pr-6 pb-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ShippingReturns = () => {
    return (
        <div className="space-y-4">
            <AccordionItem icon={FiTruck} title="Shipping Information" defaultOpen={true} delay="0s">
                <p className="mb-2">We offer <strong>Fast Express Shipping</strong> (24-48h) for all domestic orders.</p>
                <ul className="space-y-2 mt-3">
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Orders placed before 2 PM are processed same day
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Real-time tracking number provided
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Secure packaging to ensure safety
                    </li>
                </ul>
            </AccordionItem>
            <AccordionItem icon={FiRefreshCw} title="Return Policy" delay="0.1s">
                <p className="mb-3">We want you to be <strong>100% satisfied</strong> with your purchase.</p>
                <p>If you're not happy, you can return your items within <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">30 days</span> of delivery for a full refund or exchange. Items must be unused and in original packaging.</p>
            </AccordionItem>
            <AccordionItem icon={FiShield} title="Satisfaction Guarantee" delay="0.2s">
                <p>All our products are <strong>100% authentic</strong> and quality checked. We offer a money-back guarantee if the product doesn't meet our high standards.</p>
            </AccordionItem>
        </div>
    );
};

export default ShippingReturns;
