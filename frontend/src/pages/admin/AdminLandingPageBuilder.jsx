import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import landingPageService from '../../api/landingPageService';
import { SECTION_TYPE_LABELS, DEFAULT_SECTION_DATA, SECTION_COMPONENTS } from '../../components/landingPage/sections/SectionRegistry';
import SectionEditor from '../../components/landingPage/sections/SectionEditor';
import Loader from '../../components/Loader';

/**
 * Admin Landing Page Builder
 * Create and edit landing pages with drag-and-drop section builder
 */
const AdminLandingPageBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [status, setStatus] = useState('DRAFT');
    const [productId, setProductId] = useState('');
    const [sections, setSections] = useState([]);
    const [settings, setSettings] = useState({
        themeColor: '#ff69b4',
        fontFamily: 'Arial, sans-serif',
        customCss: '',
        customJs: '',
        faviconUrl: '',
    });

    // UI state
    const [editingSection, setEditingSection] = useState(null);
    const [showSectionPicker, setShowSectionPicker] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            loadLandingPage();
        }
    }, [id]);

    const loadLandingPage = async () => {
        try {
            setLoading(true);
            const data = await landingPageService.getLandingPageById(id);
            setTitle(data.title);
            setSlug(data.slug);
            setMetaTitle(data.metaTitle || '');
            setMetaDescription(data.metaDescription || '');
            setStatus(data.status);
            setProductId(data.productId || '');
            setSections(data.sections || []);
            setSettings(data.settings || settings);
        } catch (error) {
            console.error('Error loading landing page:', error);
            alert('Failed to load landing page');
            navigate('/admin/landing-pages');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (publish = false) => {
        // Validation
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }
        if (!slug.trim()) {
            alert('Please enter a slug');
            return;
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            alert('Slug must be lowercase with hyphens only (e.g., summer-serum-2024)');
            return;
        }

        const landingPageData = {
            title,
            slug,
            metaTitle,
            metaDescription,
            status: publish ? 'PUBLISHED' : status,
            productId: productId || null,
            sections,
            settings,
        };

        try {
            setSaving(true);
            
            if (isEditMode) {
                await landingPageService.updateLandingPage(id, landingPageData);
                alert('Landing page updated successfully!');
            } else {
                await landingPageService.createLandingPage(landingPageData);
                alert('Landing page created successfully!');
                // Navigate back to list to see the new page
                navigate('/admin/landing-pages');
            }
        } catch (error) {
            console.error('[LandingPageBuilder] Error saving landing page:', error);
            console.error('[LandingPageBuilder] Error response:', error.response);
            alert(error.response?.data?.message || 'Failed to save landing page');
        } finally {
            setSaving(false);
        }
    };

    const addSection = (sectionType) => {
        // Check for duplicates
        const duplicateCount = sections.filter(s => s.sectionType === sectionType).length;
        if (duplicateCount > 0) {
            const confirmAdd = window.confirm(
                `⚠️ You already have ${duplicateCount} "${SECTION_TYPE_LABELS[sectionType]}" section(s).\n\n` +
                `Are you sure you want to add another one?`
            );
            if (!confirmAdd) {
                return;
            }
        }

        const newSection = {
            sectionType,
            sectionOrder: sections.length,
            sectionData: DEFAULT_SECTION_DATA[sectionType] || {},
            isVisible: true,
        };
        setSections([...sections, newSection]);
        setShowSectionPicker(false);
        setEditingSection(sections.length);
    };

    // Helper function to check if a section is a duplicate
    const isDuplicate = (index) => {
        const section = sections[index];
        const sameTypeSections = sections.filter(s => s.sectionType === section.sectionType);
        return sameTypeSections.length > 1;
    };

    const deleteSection = (index) => {
        if (!confirm('Are you sure you want to delete this section?')) return;
        
        const updatedSections = sections.filter((_, i) => i !== index);
        // Reorder sections
        updatedSections.forEach((section, idx) => {
            section.sectionOrder = idx;
        });
        setSections(updatedSections);
        setEditingSection(null);
    };

    const moveSection = (index, direction) => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === sections.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const updatedSections = [...sections];
        const temp = updatedSections[index];
        updatedSections[index] = updatedSections[newIndex];
        updatedSections[newIndex] = temp;

        // Update section orders
        updatedSections.forEach((section, idx) => {
            section.sectionOrder = idx;
        });

        setSections(updatedSections);
    };

    const updateSectionData = (index, newData) => {
        const updatedSections = [...sections];
        updatedSections[index].sectionData = newData;
        setSections(updatedSections);
    };

    const toggleSectionVisibility = (index) => {
        const updatedSections = [...sections];
        updatedSections[index].isVisible = !updatedSections[index].isVisible;
        setSections(updatedSections);
    };

    const generateSlugFromTitle = () => {
        const generatedSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setSlug(generatedSlug);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <Loader />
            </div>
        );
    }

    if (previewMode) {
        return (
            <div>
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#333',
                    color: 'white',
                    padding: '15px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Preview Mode</span>
                    <button
                        onClick={() => setPreviewMode(false)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#ff69b4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                        }}
                    >
                        Exit Preview
                    </button>
                </div>
                <div style={{ marginTop: '60px', fontFamily: settings.fontFamily }}>
                    {sections
                        .filter(section => section.isVisible !== false)
                        .sort((a, b) => a.sectionOrder - b.sectionOrder)
                        .map((section, index) => {
                            const SectionComponent = SECTION_COMPONENTS[section.sectionType];
                            if (!SectionComponent) return null;
                            
                            return (
                                <SectionComponent
                                    key={index}
                                    data={section.sectionData}
                                    isEditing={true}
                                />
                            );
                        })}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                    {isEditMode ? 'Edit Landing Page' : 'Create Landing Page'}
                </h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setPreviewMode(true)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            👁️ Preview
                        </button>
                        <button
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            {saving ? 'Saving...' : 'Save as Draft'}
                        </button>
                        <button
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            {saving ? 'Publishing...' : 'Save & Publish'}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
                    {/* Sidebar - Settings */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        height: 'fit-content',
                        position: 'sticky',
                        top: '20px',
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Page Settings</h3>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="My Amazing Landing Page"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                Slug * <button
                                    type="button"
                                    onClick={generateSlugFromTitle}
                                    style={{
                                        marginLeft: '8px',
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        backgroundColor: '#e9ecef',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Generate
                                </button>
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="my-amazing-page"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                    fontFamily: 'monospace',
                                }}
                            />
                            <small style={{ color: '#666', fontSize: '0.85rem' }}>
                                URL: /landing/{slug || '...'}
                            </small>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                Meta Title
                            </label>
                            <input
                                type="text"
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}
                                placeholder="SEO title"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                Meta Description
                            </label>
                            <textarea
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                placeholder="SEO description"
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                Theme Color
                            </label>
                            <input
                                type="color"
                                value={settings.themeColor}
                                onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                                style={{
                                    width: '100%',
                                    height: '40px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => setShowSectionPicker(!showSectionPicker)}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    backgroundColor: '#ff69b4',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                }}
                            >
                                + Add Section
                            </button>

                            {showSectionPicker && (
                                <div style={{
                                    marginTop: '10px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '6px',
                                    padding: '10px',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                }}>
                                    {Object.keys(SECTION_TYPE_LABELS).map((sectionType) => {
                                        const existingCount = sections.filter(s => s.sectionType === sectionType).length;
                                        const isDuplicate = existingCount > 0;
                                        
                                        return (
                                            <button
                                                key={sectionType}
                                                onClick={() => addSection(sectionType)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    margin: '5px 0',
                                                    backgroundColor: isDuplicate ? '#fff3cd' : 'white',
                                                    border: isDuplicate ? '2px solid #ffc107' : '1px solid #dee2e6',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    fontSize: '0.95rem',
                                                    position: 'relative',
                                                }}
                                                title={isDuplicate ? `Already added ${existingCount} time(s)` : ''}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span>{SECTION_TYPE_LABELS[sectionType]}</span>
                                                    {isDuplicate && (
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            backgroundColor: '#ffc107',
                                                            color: '#856404',
                                                            padding: '2px 6px',
                                                            borderRadius: '10px',
                                                            fontWeight: '600',
                                                        }}>
                                                            {existingCount}x
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content - Section Builder */}
                    <div>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '30px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            minHeight: '500px',
                        }}>
                            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Page Sections</h2>

                            {/* Duplicate Warning Banner */}
                            {(() => {
                                const duplicates = sections.reduce((acc, section, index) => {
                                    const sameType = sections.filter(s => s.sectionType === section.sectionType);
                                    if (sameType.length > 1 && !acc.find(d => d.type === section.sectionType)) {
                                        acc.push({
                                            type: section.sectionType,
                                            count: sameType.length,
                                            indices: sections.map((s, i) => s.sectionType === section.sectionType ? i : -1).filter(i => i !== -1),
                                        });
                                    }
                                    return acc;
                                }, []);

                                if (duplicates.length > 0) {
                                    return (
                                        <div style={{
                                            backgroundColor: '#fff3cd',
                                            border: '2px solid #ffc107',
                                            borderRadius: '8px',
                                            padding: '15px',
                                            marginBottom: '20px',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                                                <strong style={{ color: '#856404' }}>Duplicate Sections Detected</strong>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#856404' }}>
                                                {duplicates.map((dup, i) => (
                                                    <div key={i} style={{ marginBottom: '5px' }}>
                                                        • <strong>{SECTION_TYPE_LABELS[dup.type]}</strong> appears {dup.count} times
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`Delete all duplicate "${SECTION_TYPE_LABELS[dup.type]}" sections except the first one?`)) {
                                                                    const indicesToRemove = dup.indices.slice(1); // Keep first, remove rest
                                                                    const newSections = sections.filter((_, idx) => !indicesToRemove.includes(idx));
                                                                    newSections.forEach((s, idx) => s.sectionOrder = idx);
                                                                    setSections(newSections);
                                                                }
                                                            }}
                                                            style={{
                                                                marginLeft: '10px',
                                                                padding: '4px 10px',
                                                                backgroundColor: '#dc3545',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem',
                                                            }}
                                                        >
                                                            Remove Duplicates
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            {sections.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '2px dashed #dee2e6',
                                }}>
                                    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
                                        No sections yet. Add your first section to get started!
                                    </p>
                                    <button
                                        onClick={() => setShowSectionPicker(true)}
                                        style={{
                                            padding: '12px 24px',
                                            backgroundColor: '#ff69b4',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                        }}
                                    >
                                        + Add Section
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    {sections.map((section, index) => {
                                        // Count how many sections of this type exist
                                        const sameTypeCount = sections.filter(s => s.sectionType === section.sectionType).length;
                                        const isDuplicate = sameTypeCount > 1;
                                        const duplicateIndex = sections.slice(0, index + 1).filter(s => s.sectionType === section.sectionType).length;
                                        
                                        return (
                                        <div
                                            key={index}
                                            style={{
                                                marginBottom: '15px',
                                                border: editingSection === index 
                                                    ? '3px solid #ff69b4' 
                                                    : isDuplicate 
                                                        ? '2px solid #ffc107' 
                                                        : '2px solid #dee2e6',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                backgroundColor: section.isVisible ? 'white' : '#f8f9fa',
                                            }}
                                        >
                                            <div style={{
                                                padding: '15px',
                                                backgroundColor: editingSection === index 
                                                    ? '#fff0f5' 
                                                    : isDuplicate 
                                                        ? '#fffbf0' 
                                                        : '#f8f9fa',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                                    <span style={{ fontSize: '1.2rem', cursor: 'grab' }}>⋮⋮</span>
                                                    <strong>{SECTION_TYPE_LABELS[section.sectionType]}</strong>
                                                    {isDuplicate && (
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            backgroundColor: '#ffc107',
                                                            color: '#856404',
                                                            padding: '2px 8px',
                                                            borderRadius: '12px',
                                                            fontWeight: 'bold',
                                                        }}>
                                                            #{duplicateIndex} of {sameTypeCount}
                                                        </span>
                                                    )}
                                                    {!section.isVisible && (
                                                        <span style={{
                                                            fontSize: '0.85rem',
                                                            color: '#666',
                                                            fontStyle: 'italic',
                                                        }}>
                                                            (Hidden)
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => moveSection(index, 'up')}
                                                        disabled={index === 0}
                                                        style={{
                                                            padding: '6px 10px',
                                                            backgroundColor: index === 0 ? '#e9ecef' : '#007bff',
                                                            color: index === 0 ? '#6c757d' : 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        onClick={() => moveSection(index, 'down')}
                                                        disabled={index === sections.length - 1}
                                                        style={{
                                                            padding: '6px 10px',
                                                            backgroundColor: index === sections.length - 1 ? '#e9ecef' : '#007bff',
                                                            color: index === sections.length - 1 ? '#6c757d' : 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: index === sections.length - 1 ? 'not-allowed' : 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        ↓
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingSection(editingSection === index ? null : index)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: editingSection === index ? '#ffc107' : '#007bff',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        {editingSection === index ? 'Close' : 'Edit'}
                                                    </button>
                                                    <button
                                                        onClick={() => toggleSectionVisibility(index)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: '#6c757d',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        {section.isVisible ? '👁️' : '👁️‍🗨️'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSection(index)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: '#dc3545',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                        title="Delete this section"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                            {editingSection === index && (
                                                <div style={{ padding: '20px', borderTop: '1px solid #dee2e6' }}>
                                                    {isDuplicate && (
                                                        <div style={{
                                                            padding: '10px',
                                                            backgroundColor: '#fff3cd',
                                                            border: '1px solid #ffc107',
                                                            borderRadius: '6px',
                                                            marginBottom: '15px',
                                                            fontSize: '0.9rem',
                                                            color: '#856404',
                                                        }}>
                                                            ⚠️ <strong>Duplicate Section:</strong> You have {sameTypeCount} "{SECTION_TYPE_LABELS[section.sectionType]}" sections. 
                                                            Make sure each has unique content or consider removing duplicates.
                                                        </div>
                                                    )}
                                                    <SectionEditor
                                                        sectionType={section.sectionType}
                                                        data={section.sectionData}
                                                        onChange={(newData) => updateSectionData(index, newData)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default AdminLandingPageBuilder;
