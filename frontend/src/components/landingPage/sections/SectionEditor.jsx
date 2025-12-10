import React from 'react';
import ImageUploader from './ImageUploader';

/**
 * Visual Section Editor - User-friendly form editors for each section type
 * No more JSON editing! 🎉
 */

// Common styles
const styles = {
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        fontSize: '0.9rem',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '0.95rem',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '0.95rem',
        resize: 'vertical',
        minHeight: '80px',
        boxSizing: 'border-box',
    },
    colorInput: {
        width: '100%',
        height: '45px',
        padding: '4px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        cursor: 'pointer',
    },
    select: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '0.95rem',
        backgroundColor: 'white',
        cursor: 'pointer',
    },
    row: {
        display: 'flex',
        gap: '15px',
        marginBottom: '15px',
    },
    col: {
        flex: 1,
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        marginTop: '10px',
    },
    removeButton: {
        padding: '8px 12px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.85rem',
    },
    listItem: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '10px',
        border: '1px solid #e9ecef',
    },
    sectionTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '2px solid #ff69b4',
        color: '#333',
    },
};

// ============================================
// HERO SECTION EDITOR (Premium)
// ============================================
const HeroEditor = ({ data, onChange }) => {
    const update = (field, value) => onChange({ ...data, [field]: value });

    return (
        <div>
            {/* Hero Background Image */}
            <ImageUploader
                value={data.backgroundImage || ''}
                onChange={(url) => update('backgroundImage', url)}
                label="🖼️ Background Image (Optional)"
            />

            <div style={styles.formGroup}>
                <label style={styles.label}>🏷️ Badge (Optional - appears above headline)</label>
                <input
                    type="text"
                    value={data.badge || ''}
                    onChange={(e) => update('badge', e.target.value)}
                    placeholder="🔥 Best Seller"
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>📢 Headline (Main Title)</label>
                <input
                    type="text"
                    value={data.headline || ''}
                    onChange={(e) => update('headline', e.target.value)}
                    placeholder="Amazing Product!"
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>📝 Subheadline</label>
                <input
                    type="text"
                    value={data.subheadline || ''}
                    onChange={(e) => update('subheadline', e.target.value)}
                    placeholder="Transform your life today"
                    style={styles.input}
                />
            </div>

            <div style={styles.sectionTitle}>🔘 Primary Button</div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Button Text</label>
                    <input
                        type="text"
                        value={data.ctaText || ''}
                        onChange={(e) => update('ctaText', e.target.value)}
                        placeholder="Buy Now - $49.99"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Button Link</label>
                    <input
                        type="text"
                        value={data.ctaLink || ''}
                        onChange={(e) => update('ctaLink', e.target.value)}
                        placeholder="#order"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.sectionTitle}>🔗 Secondary Button (Optional)</div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Button Text</label>
                    <input
                        type="text"
                        value={data.secondaryCtaText || ''}
                        onChange={(e) => update('secondaryCtaText', e.target.value)}
                        placeholder="Learn More"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Button Link</label>
                    <input
                        type="text"
                        value={data.secondaryCtaLink || ''}
                        onChange={(e) => update('secondaryCtaLink', e.target.value)}
                        placeholder="#features"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.sectionTitle}>🎨 Colors</div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Background Color</label>
                    <input
                        type="color"
                        value={data.backgroundColor || '#ffeef8'}
                        onChange={(e) => update('backgroundColor', e.target.value)}
                        style={styles.colorInput}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Text Color</label>
                    <input
                        type="color"
                        value={data.textColor || '#333333'}
                        onChange={(e) => update('textColor', e.target.value)}
                        style={styles.colorInput}
                    />
                </div>
            </div>
        </div>
    );
};

// ============================================
// TRUST SIGNALS EDITOR (Premium)
// ============================================
const TrustSignalsEditor = ({ data, onChange }) => {
    const badges = data.badges || [];
    const stats = data.stats || [];

    const updateBadge = (index, field, value) => {
        const newBadges = [...badges];
        newBadges[index] = { ...newBadges[index], [field]: value };
        onChange({ ...data, badges: newBadges });
    };

    const addBadge = () => {
        onChange({ ...data, badges: [...badges, { icon: '✓', text: 'New Badge', subtext: 'Description' }] });
    };

    const removeBadge = (index) => {
        onChange({ ...data, badges: badges.filter((_, i) => i !== index) });
    };

    const updateStat = (index, field, value) => {
        const newStats = [...stats];
        newStats[index] = { ...newStats[index], [field]: value };
        onChange({ ...data, stats: newStats });
    };

    const addStat = () => {
        onChange({ ...data, stats: [...stats, { number: '100+', label: 'Happy Customers' }] });
    };

    const removeStat = (index) => {
        onChange({ ...data, stats: stats.filter((_, i) => i !== index) });
    };

    return (
        <div>
            {/* Stats Section */}
            <div style={styles.sectionTitle}>📊 Stats Counter (Optional)</div>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
                Show impressive numbers like customer count, ratings, etc.
            </p>
            
            {stats.map((stat, index) => (
                <div key={index} style={styles.listItem}>
                    <div style={styles.row}>
                        <div style={{ width: '120px' }}>
                            <label style={styles.label}>Number</label>
                            <input
                                type="text"
                                value={stat.number || ''}
                                onChange={(e) => updateStat(index, 'number', e.target.value)}
                                placeholder="50K+"
                                style={styles.input}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Label</label>
                            <input
                                type="text"
                                value={stat.label || ''}
                                onChange={(e) => updateStat(index, 'label', e.target.value)}
                                placeholder="Happy Customers"
                                style={styles.input}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button onClick={() => removeStat(index)} style={styles.removeButton}>
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            
            <button onClick={addStat} style={{ ...styles.addButton, backgroundColor: '#6c757d' }}>
                + Add Stat
            </button>

            {/* Trust Badges */}
            <div style={{ ...styles.sectionTitle, marginTop: '30px' }}>🏆 Trust Badges</div>
            
            {badges.map((badge, index) => (
                <div key={index} style={styles.listItem}>
                    <div style={styles.row}>
                        <div style={{ width: '80px' }}>
                            <label style={styles.label}>Icon</label>
                            <input
                                type="text"
                                value={badge.icon || ''}
                                onChange={(e) => updateBadge(index, 'icon', e.target.value)}
                                placeholder="🏆"
                                style={styles.input}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Text</label>
                            <input
                                type="text"
                                value={badge.text || ''}
                                onChange={(e) => updateBadge(index, 'text', e.target.value)}
                                placeholder="Award Winning"
                                style={styles.input}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button onClick={() => removeBadge(index)} style={styles.removeButton}>
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <label style={styles.label}>Subtext (Optional)</label>
                        <input
                            type="text"
                            value={badge.subtext || ''}
                            onChange={(e) => updateBadge(index, 'subtext', e.target.value)}
                            placeholder="Best Product 2024"
                            style={styles.input}
                        />
                    </div>
                </div>
            ))}
            
            <button onClick={addBadge} style={styles.addButton}>
                + Add Badge
            </button>

            <div style={{ ...styles.formGroup, marginTop: '20px' }}>
                <label style={styles.label}>🎨 Background Color</label>
                <input
                    type="color"
                    value={data.backgroundColor || '#ffffff'}
                    onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
                    style={styles.colorInput}
                />
            </div>
        </div>
    );
};

// ============================================
// PRODUCT SHOWCASE EDITOR (Premium)
// ============================================
const ProductShowcaseEditor = ({ data, onChange }) => {
    const features = data.features || [];

    const updateFeature = (index, value) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        onChange({ ...data, features: newFeatures });
    };

    const addFeature = () => {
        onChange({ ...data, features: [...features, 'New Feature'] });
    };

    const removeFeature = (index) => {
        onChange({ ...data, features: features.filter((_, i) => i !== index) });
    };

    return (
        <div>
            {/* Product Image Upload */}
            <ImageUploader
                value={data.image || ''}
                onChange={(url) => onChange({ ...data, image: url })}
                label="🖼️ Product Image"
            />

            <div style={styles.formGroup}>
                <label style={styles.label}>🏷️ Badge (Optional - floating label)</label>
                <input
                    type="text"
                    value={data.badge || ''}
                    onChange={(e) => onChange({ ...data, badge: e.target.value })}
                    placeholder="Best Seller"
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>📌 Title</label>
                <input
                    type="text"
                    value={data.title || ''}
                    onChange={(e) => onChange({ ...data, title: e.target.value })}
                    placeholder="Our Amazing Product"
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>📝 Description</label>
                <textarea
                    value={data.description || ''}
                    onChange={(e) => onChange({ ...data, description: e.target.value })}
                    placeholder="Discover the perfect solution for your needs..."
                    style={styles.textarea}
                />
            </div>

            {/* Pricing Section */}
            <div style={styles.sectionTitle}>💰 Pricing (Optional)</div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Current Price</label>
                    <input
                        type="text"
                        value={data.price || ''}
                        onChange={(e) => onChange({ ...data, price: e.target.value })}
                        placeholder="$49.99"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Original Price (for strikethrough)</label>
                    <input
                        type="text"
                        value={data.originalPrice || ''}
                        onChange={(e) => onChange({ ...data, originalPrice: e.target.value })}
                        placeholder="$99.99"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.sectionTitle}>✨ Features</div>
            {features.map((feature, index) => (
                <div key={index} style={{ ...styles.row, marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="Feature description"
                            style={styles.input}
                        />
                    </div>
                    <button onClick={() => removeFeature(index)} style={styles.removeButton}>
                        🗑️
                    </button>
                </div>
            ))}
            <button onClick={addFeature} style={styles.addButton}>
                + Add Feature
            </button>

            {/* CTA Button */}
            <div style={{ ...styles.sectionTitle, marginTop: '20px' }}>🔘 Call-to-Action Button (Optional)</div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Button Text</label>
                    <input
                        type="text"
                        value={data.ctaText || ''}
                        onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
                        placeholder="Add to Cart"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Button Link</label>
                    <input
                        type="text"
                        value={data.ctaLink || ''}
                        onChange={(e) => onChange({ ...data, ctaLink: e.target.value })}
                        placeholder="#order"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={{ ...styles.row, marginTop: '20px' }}>
                <div style={styles.col}>
                    <label style={styles.label}>📍 Image Position</label>
                    <select
                        value={data.imagePosition || 'left'}
                        onChange={(e) => onChange({ ...data, imagePosition: e.target.value })}
                        style={styles.select}
                    >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>🎨 Background Color</label>
                    <input
                        type="color"
                        value={data.backgroundColor || '#fafafa'}
                        onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
                        style={styles.colorInput}
                    />
                </div>
            </div>
        </div>
    );
};

// ============================================
// KEY BENEFITS EDITOR
// ============================================
const KeyBenefitsEditor = ({ data, onChange }) => {
    const benefits = data.benefits || [];

    const updateBenefit = (index, field, value) => {
        const newBenefits = [...benefits];
        newBenefits[index] = { ...newBenefits[index], [field]: value };
        onChange({ ...data, benefits: newBenefits });
    };

    const addBenefit = () => {
        onChange({ 
            ...data, 
            benefits: [...benefits, { icon: '⭐', title: 'New Benefit', description: 'Description here' }] 
        });
    };

    const removeBenefit = (index) => {
        onChange({ ...data, benefits: benefits.filter((_, i) => i !== index) });
    };

    return (
        <div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>📌 Section Title</label>
                    <input
                        type="text"
                        value={data.title || ''}
                        onChange={(e) => onChange({ ...data, title: e.target.value })}
                        placeholder="Why Choose Us?"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>📝 Subtitle</label>
                    <input
                        type="text"
                        value={data.subtitle || ''}
                        onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
                        placeholder="Here are the key benefits"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.sectionTitle}>💎 Benefits</div>
            {benefits.map((benefit, index) => (
                <div key={index} style={styles.listItem}>
                    <div style={styles.row}>
                        <div style={{ width: '80px' }}>
                            <label style={styles.label}>Icon</label>
                            <input
                                type="text"
                                value={benefit.icon || ''}
                                onChange={(e) => updateBenefit(index, 'icon', e.target.value)}
                                placeholder="💎"
                                style={styles.input}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Title</label>
                            <input
                                type="text"
                                value={benefit.title || ''}
                                onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                                placeholder="Premium Quality"
                                style={styles.input}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button onClick={() => removeBenefit(index)} style={styles.removeButton}>
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            value={benefit.description || ''}
                            onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                            placeholder="Describe this benefit..."
                            style={{ ...styles.textarea, minHeight: '60px' }}
                        />
                    </div>
                </div>
            ))}
            <button onClick={addBenefit} style={styles.addButton}>
                + Add Benefit
            </button>

            <div style={{ ...styles.row, marginTop: '20px' }}>
                <div style={styles.col}>
                    <label style={styles.label}>📊 Columns</label>
                    <select
                        value={data.columns || 3}
                        onChange={(e) => onChange({ ...data, columns: parseInt(e.target.value) })}
                        style={styles.select}
                    >
                        <option value={2}>2 Columns</option>
                        <option value={3}>3 Columns</option>
                        <option value={4}>4 Columns</option>
                    </select>
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>🎨 Background Color</label>
                    <input
                        type="color"
                        value={data.backgroundColor || '#ffffff'}
                        onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
                        style={styles.colorInput}
                    />
                </div>
            </div>
        </div>
    );
};

// ============================================
// TESTIMONIALS EDITOR
// ============================================
const TestimonialsEditor = ({ data, onChange }) => {
    const testimonials = data.testimonials || [];

    const updateTestimonial = (index, field, value) => {
        const newTestimonials = [...testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        onChange({ ...data, testimonials: newTestimonials });
    };

    const addTestimonial = () => {
        onChange({ 
            ...data, 
            testimonials: [...testimonials, { 
                name: 'Customer Name', 
                rating: 5, 
                comment: 'Great product!', 
                avatar: '',
                productImages: [] // Array of product/review images
            }] 
        });
    };

    const addProductImage = (testimonialIndex) => {
        const newTestimonials = [...testimonials];
        if (!newTestimonials[testimonialIndex].productImages) {
            newTestimonials[testimonialIndex].productImages = [];
        }
        newTestimonials[testimonialIndex].productImages.push('');
        onChange({ ...data, testimonials: newTestimonials });
    };

    const updateProductImage = (testimonialIndex, imageIndex, url) => {
        const newTestimonials = [...testimonials];
        newTestimonials[testimonialIndex].productImages[imageIndex] = url;
        onChange({ ...data, testimonials: newTestimonials });
    };

    const removeProductImage = (testimonialIndex, imageIndex) => {
        const newTestimonials = [...testimonials];
        newTestimonials[testimonialIndex].productImages = 
            newTestimonials[testimonialIndex].productImages.filter((_, i) => i !== imageIndex);
        onChange({ ...data, testimonials: newTestimonials });
    };

    const removeTestimonial = (index) => {
        onChange({ ...data, testimonials: testimonials.filter((_, i) => i !== index) });
    };

    return (
        <div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>📌 Section Title</label>
                    <input
                        type="text"
                        value={data.title || ''}
                        onChange={(e) => onChange({ ...data, title: e.target.value })}
                        placeholder="What Our Customers Say"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>📝 Subtitle</label>
                    <input
                        type="text"
                        value={data.subtitle || ''}
                        onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
                        placeholder="Real reviews from real customers"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.sectionTitle}>⭐ Testimonials</div>
            {testimonials.map((testimonial, index) => (
                <div key={index} style={styles.listItem}>
                    {/* Customer Avatar */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={styles.label}>📷 Customer Photo (Optional)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {testimonial.avatar && (
                                <img
                                    src={typeof testimonial.avatar === 'string' && testimonial.avatar.startsWith('http') ? testimonial.avatar : `${window.location.origin}${testimonial.avatar || ''}`}
                                    alt="Avatar"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #ff69b4',
                                    }}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                            <div style={{ flex: 1 }}>
                                <ImageUploader
                                    value={testimonial.avatar || ''}
                                    onChange={(url) => updateTestimonial(index, 'avatar', url)}
                                    label=""
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div style={styles.row}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>👤 Customer Name</label>
                            <input
                                type="text"
                                value={testimonial.name || ''}
                                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                placeholder="Jane Doe"
                                style={styles.input}
                            />
                        </div>
                        <div style={{ width: '120px' }}>
                            <label style={styles.label}>⭐ Rating</label>
                            <select
                                value={testimonial.rating || 5}
                                onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                                style={styles.select}
                            >
                                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                                <option value={4}>⭐⭐⭐⭐ (4)</option>
                                <option value={3}>⭐⭐⭐ (3)</option>
                                <option value={2}>⭐⭐ (2)</option>
                                <option value={1}>⭐ (1)</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button onClick={() => removeTestimonial(index)} style={styles.removeButton}>
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <label style={styles.label}>💬 Comment</label>
                        <textarea
                            value={testimonial.comment || ''}
                            onChange={(e) => updateTestimonial(index, 'comment', e.target.value)}
                            placeholder="This product changed my life!"
                            style={styles.textarea}
                        />
                    </div>

                    {/* Product/Review Images */}
                    <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
                        <label style={{ ...styles.label, color: '#0066cc' }}>📦 Product Images (Photos of what they received)</label>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
                            Add photos showing the actual product the customer received
                        </p>
                        
                        {/* Existing product images */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                            {(testimonial.productImages || []).map((img, imgIndex) => (
                                <div key={imgIndex} style={{ 
                                    position: 'relative', 
                                    width: '120px',
                                    border: '2px solid #ddd',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    backgroundColor: '#fff'
                                }}>
                                    {img && typeof img === 'string' ? (
                                        <img
                                            src={img.startsWith('http') ? img : `${window.location.origin}${img}`}
                                            alt={`Product ${imgIndex + 1}`}
                                            style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    ) : (
                                        <div style={{ 
                                            width: '100%', 
                                            height: '100px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            backgroundColor: '#f5f5f5',
                                            color: '#999'
                                        }}>
                                            📷
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeProductImage(index, imgIndex)}
                                        style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '22px',
                                            height: '22px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        ×
                                    </button>
                                    <div style={{ padding: '5px' }}>
                                        <ImageUploader
                                            value={img || ''}
                                            onChange={(url) => updateProductImage(index, imgIndex, url)}
                                            label=""
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => addProductImage(index)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#0066cc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                            }}
                        >
                            📷 + Add Product Image
                        </button>
                    </div>
                </div>
            ))}
            <button onClick={addTestimonial} style={styles.addButton}>
                + Add Testimonial
            </button>

            <div style={{ ...styles.formGroup, marginTop: '20px' }}>
                <label style={styles.label}>🎨 Background Color</label>
                <input
                    type="color"
                    value={data.backgroundColor || '#ffffff'}
                    onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
                    style={styles.colorInput}
                />
            </div>
        </div>
    );
};

// ============================================
// BEFORE/AFTER EDITOR
// ============================================
const BeforeAfterEditor = ({ data, onChange }) => {
    const comparisons = data.comparisons || [];

    const updateComparison = (index, field, value) => {
        const newComparisons = [...comparisons];
        newComparisons[index] = { ...newComparisons[index], [field]: value };
        onChange({ ...data, comparisons: newComparisons });
    };

    const addComparison = () => {
        onChange({ 
            ...data, 
            comparisons: [...comparisons, { 
                beforeImage: '', 
                afterImage: '', 
                beforeLabel: 'Before', 
                afterLabel: 'After',
                caption: '' 
            }] 
        });
    };

    const removeComparison = (index) => {
        onChange({ ...data, comparisons: comparisons.filter((_, i) => i !== index) });
    };

    return (
        <div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>📌 Section Title</label>
                    <input
                        type="text"
                        value={data.title || ''}
                        onChange={(e) => onChange({ ...data, title: e.target.value })}
                        placeholder="See The Transformation"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>📝 Subtitle</label>
                    <input
                        type="text"
                        value={data.subtitle || ''}
                        onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
                        placeholder="Real results from real customers"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.sectionTitle}>📸 Before/After Comparisons</div>
            {comparisons.map((comparison, index) => (
                <div key={index} style={{ ...styles.listItem, padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <strong>Comparison #{index + 1}</strong>
                        <button onClick={() => removeComparison(index)} style={styles.removeButton}>
                            🗑️ Remove
                        </button>
                    </div>
                    
                    <div style={styles.row}>
                        <div style={styles.col}>
                            <ImageUploader
                                value={comparison.beforeImage || ''}
                                onChange={(url) => updateComparison(index, 'beforeImage', url)}
                                label="Before Image"
                            />
                            <input
                                type="text"
                                value={comparison.beforeLabel || 'Before'}
                                onChange={(e) => updateComparison(index, 'beforeLabel', e.target.value)}
                                placeholder="Before"
                                style={{ ...styles.input, marginTop: '5px' }}
                            />
                        </div>
                        <div style={styles.col}>
                            <ImageUploader
                                value={comparison.afterImage || ''}
                                onChange={(url) => updateComparison(index, 'afterImage', url)}
                                label="After Image"
                            />
                            <input
                                type="text"
                                value={comparison.afterLabel || 'After'}
                                onChange={(e) => updateComparison(index, 'afterLabel', e.target.value)}
                                placeholder="After"
                                style={{ ...styles.input, marginTop: '5px' }}
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.col}>
                            <label style={styles.label}>📝 Caption</label>
                            <input
                                type="text"
                                value={comparison.caption || ''}
                                onChange={(e) => updateComparison(index, 'caption', e.target.value)}
                                placeholder="Amazing transformation!"
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.col}>
                            <label style={styles.label}>⏱️ Timeframe</label>
                            <input
                                type="text"
                                value={comparison.timeframe || ''}
                                onChange={(e) => updateComparison(index, 'timeframe', e.target.value)}
                                placeholder="4 weeks"
                                style={styles.input}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addComparison} style={styles.addButton}>
                + Add Before/After Comparison
            </button>

            <div style={{ ...styles.formGroup, marginTop: '20px' }}>
                <label style={styles.label}>🎨 Background Color</label>
                <input
                    type="color"
                    value={data.backgroundColor || '#ffffff'}
                    onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
                    style={styles.colorInput}
                />
            </div>
        </div>
    );
};

// ============================================
// FAQ EDITOR (Premium)
// ============================================
const FAQEditor = ({ data, onChange }) => {
    const faqs = data.faqs || [];

    const updateFAQ = (index, field, value) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        onChange({ ...data, faqs: newFaqs });
    };

    const addFAQ = () => {
        onChange({ 
            ...data, 
            faqs: [...faqs, { question: 'New Question?', answer: 'Answer here...' }] 
        });
    };

    const removeFAQ = (index) => {
        onChange({ ...data, faqs: faqs.filter((_, i) => i !== index) });
    };

    return (
        <div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>📌 Section Title</label>
                    <input
                        type="text"
                        value={data.title || ''}
                        onChange={(e) => onChange({ ...data, title: e.target.value })}
                        placeholder="Frequently Asked Questions"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>📝 Subtitle</label>
                    <input
                        type="text"
                        value={data.subtitle || ''}
                        onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
                        placeholder="Got questions? We have answers"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.sectionTitle}>❓ Questions & Answers</div>
            {faqs.map((faq, index) => (
                <div key={index} style={styles.listItem}>
                    <div style={styles.row}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>❓ Question</label>
                            <input
                                type="text"
                                value={faq.question || ''}
                                onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                placeholder="How long does shipping take?"
                                style={styles.input}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button onClick={() => removeFAQ(index)} style={styles.removeButton}>
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <label style={styles.label}>💬 Answer</label>
                        <textarea
                            value={faq.answer || ''}
                            onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                            placeholder="Delivery takes 3-5 business days."
                            style={styles.textarea}
                        />
                    </div>
                </div>
            ))}
            <button onClick={addFAQ} style={styles.addButton}>
                + Add FAQ
            </button>

            <div style={{ ...styles.formGroup, marginTop: '20px' }}>
                <label style={styles.label}>🎨 Background Color</label>
                <input
                    type="color"
                    value={data.backgroundColor || '#fafafa'}
                    onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
                    style={styles.colorInput}
                />
            </div>
        </div>
    );
};

// ============================================
// URGENCY BANNER EDITOR (Premium)
// ============================================
const UrgencyBannerEditor = ({ data, onChange }) => {
    return (
        <div>
            <div style={styles.formGroup}>
                <label style={styles.label}>⚡ Banner Title</label>
                <input
                    type="text"
                    value={data.title || ''}
                    onChange={(e) => onChange({ ...data, title: e.target.value })}
                    placeholder="🔥 LIMITED TIME OFFER!"
                    style={styles.input}
                />
            </div>

            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>🏷️ Discount</label>
                    <input
                        type="text"
                        value={data.discount || ''}
                        onChange={(e) => onChange({ ...data, discount: e.target.value })}
                        placeholder="20% OFF"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>📝 Message</label>
                    <input
                        type="text"
                        value={data.message || ''}
                        onChange={(e) => onChange({ ...data, message: e.target.value })}
                        placeholder="Offer ends soon"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>🔘 Button Text</label>
                    <input
                        type="text"
                        value={data.ctaText || ''}
                        onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
                        placeholder="Claim Your Discount"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>🔗 Button Link</label>
                    <input
                        type="text"
                        value={data.ctaLink || ''}
                        onChange={(e) => onChange({ ...data, ctaLink: e.target.value })}
                        placeholder="#order"
                        style={styles.input}
                    />
                </div>
            </div>

            {/* Social Proof Section */}
            <div style={styles.sectionTitle}>📊 Social Proof (Creates urgency!)</div>
            
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>
                        <input
                            type="checkbox"
                            checked={data.showStock !== false}
                            onChange={(e) => onChange({ ...data, showStock: e.target.checked })}
                            style={{ marginRight: '8px' }}
                        />
                        Show Stock Counter
                    </label>
                    <input
                        type="number"
                        value={data.stockLeft || 47}
                        onChange={(e) => onChange({ ...data, stockLeft: parseInt(e.target.value) })}
                        placeholder="47"
                        style={styles.input}
                        min="1"
                        max="999"
                    />
                    <small style={{ color: '#666' }}>Items left in stock</small>
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>
                        <input
                            type="checkbox"
                            checked={data.showBuyers !== false}
                            onChange={(e) => onChange({ ...data, showBuyers: e.target.checked })}
                            style={{ marginRight: '8px' }}
                        />
                        Show Recent Buyers
                    </label>
                    <input
                        type="number"
                        value={data.recentBuyers || 23}
                        onChange={(e) => onChange({ ...data, recentBuyers: parseInt(e.target.value) })}
                        placeholder="23"
                        style={styles.input}
                        min="1"
                        max="999"
                    />
                    <small style={{ color: '#666' }}>People bought today</small>
                </div>
            </div>

            <div style={{ ...styles.row, marginTop: '20px' }}>
                <div style={styles.col}>
                    <label style={styles.label}>🎨 Background Color</label>
                    <input
                        type="color"
                        value={data.backgroundColor || '#ff69b4'}
                        onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
                        style={styles.colorInput}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>✏️ Text Color</label>
                    <input
                        type="color"
                        value={data.textColor || '#ffffff'}
                        onChange={(e) => onChange({ ...data, textColor: e.target.value })}
                        style={styles.colorInput}
                    />
                </div>
            </div>
        </div>
    );
};

// ============================================
// FINAL CTA EDITOR (Premium)
// ============================================
const FinalCTAEditor = ({ data, onChange }) => {
    const trustBadges = data.trustBadges || [];

    const updateBadge = (index, value) => {
        const newBadges = [...trustBadges];
        newBadges[index] = value;
        onChange({ ...data, trustBadges: newBadges });
    };

    const addBadge = () => {
        onChange({ ...data, trustBadges: [...trustBadges, 'New Badge'] });
    };

    const removeBadge = (index) => {
        onChange({ ...data, trustBadges: trustBadges.filter((_, i) => i !== index) });
    };

    return (
        <div>
            <div style={styles.formGroup}>
                <label style={styles.label}>📌 Title</label>
                <input
                    type="text"
                    value={data.title || ''}
                    onChange={(e) => onChange({ ...data, title: e.target.value })}
                    placeholder="Ready to Transform Your Life?"
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>📝 Subtitle</label>
                <input
                    type="text"
                    value={data.subtitle || ''}
                    onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
                    placeholder="Join thousands of satisfied customers"
                    style={styles.input}
                />
            </div>

            {/* Pricing Section */}
            <div style={styles.sectionTitle}>💰 Pricing Display</div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Current Price</label>
                    <input
                        type="text"
                        value={data.price || ''}
                        onChange={(e) => onChange({ ...data, price: e.target.value })}
                        placeholder="$49.99"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Original Price (strikethrough)</label>
                    <input
                        type="text"
                        value={data.originalPrice || ''}
                        onChange={(e) => onChange({ ...data, originalPrice: e.target.value })}
                        placeholder="$99.99"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>🏷️ Savings Badge</label>
                    <input
                        type="text"
                        value={data.savings || ''}
                        onChange={(e) => onChange({ ...data, savings: e.target.value })}
                        placeholder="Save 50%"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>🛡️ Guarantee Text</label>
                    <input
                        type="text"
                        value={data.guarantee || ''}
                        onChange={(e) => onChange({ ...data, guarantee: e.target.value })}
                        placeholder="30-Day Money-Back Guarantee"
                        style={styles.input}
                    />
                </div>
            </div>

            {/* CTA Button */}
            <div style={styles.sectionTitle}>🔘 Call-to-Action Button</div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Button Text</label>
                    <input
                        type="text"
                        value={data.ctaText || ''}
                        onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
                        placeholder="Buy Now"
                        style={styles.input}
                    />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Button Link</label>
                    <input
                        type="text"
                        value={data.ctaLink || ''}
                        onChange={(e) => onChange({ ...data, ctaLink: e.target.value })}
                        placeholder="#order"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.sectionTitle}>✅ Trust Badges</div>
            {trustBadges.map((badge, index) => (
                <div key={index} style={{ ...styles.row, marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            value={badge}
                            onChange={(e) => updateBadge(index, e.target.value)}
                            placeholder="Free Shipping"
                            style={styles.input}
                        />
                    </div>
                    <button onClick={() => removeBadge(index)} style={styles.removeButton}>
                        🗑️
                    </button>
                </div>
            ))}
            <button onClick={addBadge} style={styles.addButton}>
                + Add Badge
            </button>

            <div style={{ ...styles.formGroup, marginTop: '20px' }}>
                <label style={styles.label}>🎨 Background Color</label>
                <input
                    type="color"
                    value={data.backgroundColor || '#ffffff'}
                    onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
                    style={styles.colorInput}
                />
            </div>
        </div>
    );
};

// ============================================
// CUSTOM HTML EDITOR
// ============================================
const CustomHTMLEditor = ({ data, onChange }) => {
    return (
        <div>
            <div style={styles.formGroup}>
                <label style={styles.label}>🖥️ Custom HTML Code</label>
                <textarea
                    value={data.html || ''}
                    onChange={(e) => onChange({ ...data, html: e.target.value })}
                    placeholder="<div>Your custom HTML here...</div>"
                    style={{ ...styles.textarea, minHeight: '200px', fontFamily: 'monospace' }}
                />
            </div>
            <small style={{ color: '#666' }}>
                ⚠️ Be careful with custom HTML - only use trusted code!
            </small>
        </div>
    );
};

// ============================================
// MAIN SECTION EDITOR COMPONENT
// ============================================
const SectionEditor = ({ sectionType, data, onChange }) => {
    const editors = {
        HERO: HeroEditor,
        TRUST_SIGNALS: TrustSignalsEditor,
        PRODUCT_SHOWCASE: ProductShowcaseEditor,
        KEY_BENEFITS: KeyBenefitsEditor,
        BEFORE_AFTER: BeforeAfterEditor,
        HOW_IT_WORKS: KeyBenefitsEditor,
        INGREDIENTS: KeyBenefitsEditor,
        TESTIMONIALS: TestimonialsEditor,
        FAQ: FAQEditor,
        URGENCY_BANNER: UrgencyBannerEditor,
        FINAL_CTA: FinalCTAEditor,
        CUSTOM_HTML: CustomHTMLEditor,
    };

    const Editor = editors[sectionType];

    if (!Editor) {
        return (
            <div style={{ padding: '20px', color: '#666', textAlign: 'center' }}>
                No editor available for this section type.
            </div>
        );
    }

    return (
        <div style={{ padding: '10px 0' }}>
            <Editor data={data || {}} onChange={onChange} />
        </div>
    );
};

export default SectionEditor;

