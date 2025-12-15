// Section Registry
// Maps section types to their components

import HeroSection from './HeroSection';
import TrustSignalsSection from './TrustSignalsSection';
import ProductShowcaseSection from './ProductShowcaseSection';
import KeyBenefitsSection from './KeyBenefitsSection';
import BeforeAfterSection from './BeforeAfterSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import UrgencyBannerSection from './UrgencyBannerSection';
import FinalCTASection from './FinalCTASection';
import HeroPremiumSection from './HeroPremiumSection';
import FeaturesZigZagSection from './FeaturesZigZagSection';
import RelatedProductsSection from './RelatedProductsSection';

/**
 * Maps section types (from backend enum) to React components
 */
export const SECTION_COMPONENTS = {
    HERO: HeroSection,
    HERO_PREMIUM: HeroPremiumSection,
    FEATURES_ZIGZAG: FeaturesZigZagSection,
    TRUST_SIGNALS: TrustSignalsSection,
    PRODUCT_SHOWCASE: ProductShowcaseSection,
    KEY_BENEFITS: KeyBenefitsSection,
    BEFORE_AFTER: BeforeAfterSection,
    HOW_IT_WORKS: KeyBenefitsSection, // Reuse KeyBenefits with numbered steps
    INGREDIENTS: KeyBenefitsSection, // Reuse KeyBenefits for ingredients
    TESTIMONIALS: TestimonialsSection,
    FAQ: FAQSection,
    URGENCY_BANNER: UrgencyBannerSection,
    FINAL_CTA: FinalCTASection,
    RELATED_PRODUCTS: RelatedProductsSection,
    CUSTOM_HTML: null, // Will handle separately
};

/**
 * Default section data templates for each section type
 */
export const DEFAULT_SECTION_DATA = {
    HERO: {
        headline: 'Amazing Product!',
        subheadline: 'Transform your life today',
        backgroundColor: '#ffeef8',
        ctaText: 'Buy Now - $49.99',
        ctaLink: '#order',
        textColor: '#333',
    },
    HERO_PREMIUM: {
        titleBack: 'SKIN CARE',
        headline: 'Love your bits...',
        subheadline: '(and your bod)',
        productImage: '',
        backgroundColor: '#e6e6fa', // Light lavender
        ctaText: 'Shop Now',
        ctaLink: '#shop',
        badge: 'New Arrival',
    },
    FEATURES_ZIGZAG: {
        features: [
            {
                title: 'Every Apps you wanted',
                description: 'You won\'t just send and receive messages, calls, and mail more easily and efficiently. Your express yourself in unique, fun, and more personal ways.',
                image: '', // Placeholder
            },
            {
                title: 'Health and Fitness',
                description: 'Fitness isn\'t just about running, biking, or hitting the gym. It\'s also about being active throughout the day.',
                image: '', // Placeholder
            }
        ],
        backgroundColor: '#ffffff',
        textColor: '#333333'
    },
    TRUST_SIGNALS: {
        badges: [
            { icon: '🏆', text: 'Award Winning' },
            { icon: '✓', text: 'Money-Back Guarantee' },
            { icon: '⭐', text: '5-Star Rated' },
            { icon: '🚚', text: 'Free Shipping' },
        ],
        backgroundColor: '#ffffff',
    },
    PRODUCT_SHOWCASE: {
        image: '/placeholder-image.jpg',
        title: 'Our Amazing Product',
        description: 'Discover the perfect solution for your needs.',
        features: ['Premium Quality', 'Fast Results', 'Natural Formula'],
        imagePosition: 'left',
        backgroundColor: '#fafafa',
    },
    BEFORE_AFTER: {
        title: 'See The Transformation',
        subtitle: 'Real results from real customers',
        comparisons: [
            {
                beforeImage: '',
                afterImage: '',
                beforeLabel: 'Before',
                afterLabel: 'After',
                caption: 'Results after 4 weeks',
            },
        ],
        backgroundColor: '#ffffff',
    },
    KEY_BENEFITS: {
        title: 'Why Choose Us?',
        subtitle: 'Here are the key benefits',
        benefits: [
            { icon: '💎', title: 'Premium Quality', description: 'Made with the finest ingredients' },
            { icon: '⚡', title: 'Fast Results', description: 'See results in just 7 days' },
            { icon: '🌿', title: 'Natural Formula', description: '100% natural and organic' },
        ],
        backgroundColor: '#ffffff',
        columns: 3,
    },
    TESTIMONIALS: {
        title: 'What Our Customers Say',
        subtitle: 'Real reviews from real customers',
        testimonials: [
            { name: 'Jane Doe', rating: 5, comment: 'This product changed my life!' },
            { name: 'John Smith', rating: 5, comment: 'Amazing quality and fast shipping.' },
        ],
        backgroundColor: '#ffffff',
    },
    FAQ: {
        title: 'Frequently Asked Questions',
        faqs: [
            { question: 'How long does shipping take?', answer: 'Delivery takes 3-5 business days.' },
            { question: 'What is your return policy?', answer: 'We offer a 30-day money-back guarantee.' },
        ],
        backgroundColor: '#fafafa',
    },
    URGENCY_BANNER: {
        title: 'LIMITED TIME OFFER!',
        discount: '20% OFF',
        message: 'Offer ends soon',
        ctaText: 'Claim Your Discount',
        ctaLink: '#order',
        backgroundColor: '#ff69b4',
        textColor: '#ffffff',
    },
    FINAL_CTA: {
        title: 'Ready to Transform Your Life?',
        subtitle: 'Join thousands of satisfied customers',
        ctaText: 'Buy Now - $49.99',
        ctaLink: '#order',
        trustBadges: ['Free Shipping', '30-Day Money Back', 'Secure Checkout'],
        backgroundColor: '#ffffff',
    },
    RELATED_PRODUCTS: {
        title: 'You Might Also Like',
        subtitle: 'Perfect additions to your routine',
        productIds: [], // To be populated by admin
        backgroundColor: '#f9f9f9',
    },
};

/**
 * Section type labels for admin UI
 */
export const SECTION_TYPE_LABELS = {
    HERO: 'Hero Section (Standard)',
    HERO_PREMIUM: 'Hero Section (3D Immersive)',
    FEATURES_ZIGZAG: 'Features (Zig-Zag)',
    TRUST_SIGNALS: 'Trust Signals',
    PRODUCT_SHOWCASE: 'Product Showcase',
    KEY_BENEFITS: 'Key Benefits',
    BEFORE_AFTER: 'Before/After',
    HOW_IT_WORKS: 'How It Works',
    INGREDIENTS: 'Ingredients',
    TESTIMONIALS: 'Testimonials',
    FAQ: 'FAQ',
    URGENCY_BANNER: 'Urgency Banner',
    FINAL_CTA: 'Final CTA',
    RELATED_PRODUCTS: 'Related Products (Upsells)',
    CUSTOM_HTML: 'Custom HTML',
};

