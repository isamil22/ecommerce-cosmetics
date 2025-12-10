import React, { useState, useRef } from 'react';
import { uploadDescriptionImage } from '../../../api/apiService';

/**
 * Image Uploader Component
 * Allows users to upload images or enter URLs manually
 */
const ImageUploader = ({ value, onChange, label = "Image" }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Please select a valid image (JPG, PNG, GIF, or WEBP)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5MB');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await uploadDescriptionImage(formData);
            // Backend returns { url: "..." }
            let imageUrl = response.data?.url || response.data?.imageUrl || response.data;
            
            // Ensure it's a string
            if (typeof imageUrl !== 'string') {
                imageUrl = String(imageUrl);
            }
            
            console.log('[ImageUploader] Uploaded image URL:', imageUrl);
            onChange(imageUrl);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleUrlChange = (e) => {
        onChange(e.target.value);
    };

    const clearImage = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: '#333',
            }}>
                🖼️ {label}
            </label>

            {/* Image Preview */}
            {value && typeof value === 'string' && (
                <div style={{
                    position: 'relative',
                    marginBottom: '15px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #e9ecef',
                    backgroundColor: '#f8f9fa',
                }}>
                    <img
                        src={value.startsWith('http') ? value : `${window.location.origin}${value}`}
                        alt="Preview"
                        style={{
                            width: '100%',
                            maxHeight: '200px',
                            objectFit: 'contain',
                            display: 'block',
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div style={{
                        display: 'none',
                        height: '100px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        fontSize: '0.9rem',
                    }}>
                        Image cannot be loaded - check URL
                    </div>
                    <button
                        onClick={clearImage}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title="Remove image"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Upload Area */}
            <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
            }}>
                {/* Upload Button */}
                <label style={{
                    flex: '1',
                    minWidth: '150px',
                    padding: '20px',
                    border: '2px dashed #dee2e6',
                    borderRadius: '8px',
                    backgroundColor: uploading ? '#e9ecef' : '#fafafa',
                    cursor: uploading ? 'wait' : 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                    {uploading ? (
                        <div>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                border: '3px solid #dee2e6',
                                borderTopColor: '#ff69b4',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 8px',
                            }} />
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>Uploading...</span>
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📤</div>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>
                                Click to upload image
                            </span>
                            <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>
                                JPG, PNG, GIF, WEBP (max 5MB)
                            </div>
                        </div>
                    )}
                </label>

                {/* OR divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                    color: '#999',
                    fontSize: '0.85rem',
                }}>
                    OR
                </div>

                {/* URL Input Toggle */}
                <button
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    style={{
                        padding: '20px',
                        minWidth: '150px',
                        border: '2px dashed #dee2e6',
                        borderRadius: '8px',
                        backgroundColor: showUrlInput ? '#fff0f5' : '#fafafa',
                        cursor: 'pointer',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔗</div>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                        {showUrlInput ? 'Hide URL input' : 'Enter URL'}
                    </span>
                </button>
            </div>

            {/* URL Input Field */}
            {showUrlInput && (
                <div style={{ marginTop: '15px' }}>
                    <input
                        type="text"
                        value={value || ''}
                        onChange={handleUrlChange}
                        placeholder="https://example.com/image.jpg or /api/images/..."
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            fontSize: '0.95rem',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* CSS for spinner animation */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ImageUploader;

