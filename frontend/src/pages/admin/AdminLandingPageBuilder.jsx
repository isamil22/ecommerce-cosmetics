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

    // Refs for scrolling
    const previewSectionRefs = React.useRef({});

    // Auto-scroll to section when editing
    useEffect(() => {
        if (editingSection !== null && previewSectionRefs.current[editingSection]) {
            previewSectionRefs.current[editingSection].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [editingSection]);

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

    // ... keep existing functions ...

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <Loader />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            height: 'calc(100vh - 80px)', // Adjust based on header height
            overflow: 'hidden',
            margin: '-20px', // Counteract default page padding if necessary, or just use full width
            backgroundColor: '#f5f7f9'
        }}>
            {/* LEFT PANEL: Editor Controls (Settings & Builder) */}
            <div style={{
                width: '500px',
                minWidth: '500px',
                backgroundColor: 'white',
                borderRight: '1px solid #e1e4e8',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 10
            }}>
                {/* Editor Header */}
                <div style={{
                    padding: '15px 20px',
                    borderBottom: '1px solid #e1e4e8',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#2d3748' }}>
                        {isEditMode ? 'Edit Page' : 'New Page'}
                    </h1>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#fff',
                                color: '#007bff',
                                border: '1px solid #007bff',
                                borderRadius: '6px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                            }}
                        >
                            {saving ? '...' : 'Save Draft'}
                        </button>
                        <button
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                            }}
                        >
                            {saving ? '...' : 'Publish'}
                        </button>
                    </div>
                </div>

                {/* Scrollable Editor Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

                    {/* Page Settings Block */}
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '25px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1rem', color: '#4a5568' }}>⚙️ Page Settings</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>
                                Slug <button type="button" onClick={generateSlugFromTitle} style={{ fontSize: '0.75rem', padding: '2px 6px', marginLeft: '5px', cursor: 'pointer', background: '#e2e8f0', border: 'none', borderRadius: '4px' }}>Generate</button>
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', fontFamily: 'monospace' }}
                            />
                        </div>

                        {/* Collapsible Meta Settings could go here */}
                    </div>

                    {/* Section Builder */}
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🏗️ Sections</h3>
                        <button
                            onClick={() => setShowSectionPicker(!showSectionPicker)}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#ff69b4',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                            }}
                        >
                            + Add New
                        </button>
                    </div>

                    {showSectionPicker && (
                        <div style={{
                            marginBottom: '20px',
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: '#718096' }}>CLICK TO ADD:</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                {Object.keys(SECTION_TYPE_LABELS).map((sectionType) => (
                                    <button
                                        key={sectionType}
                                        onClick={() => addSection(sectionType)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '8px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '4px',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {SECTION_TYPE_LABELS[sectionType]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {sections.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '30px', color: '#a0aec0', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
                                No sections yet. Add one to start!
                            </div>
                        )}

                        {sections.map((section, index) => (
                            <div key={index} style={{
                                border: editingSection === index ? '2px solid #3182ce' : '1px solid #e2e8f0',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                overflow: 'hidden',
                                boxShadow: editingSection === index ? '0 4px 12px rgba(49,130,206,0.15)' : '0 1px 2px rgba(0,0,0,0.05)'
                            }}>
                                {/* Section Header */}
                                <div style={{
                                    padding: '10px 15px',
                                    backgroundColor: editingSection === index ? '#ebf8ff' : '#f7fafc',
                                    borderBottom: editingSection === index ? '1px solid #bee3f8' : '1px solid #edf2f7',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#2d3748' }}>
                                        {SECTION_TYPE_LABELS[section.sectionType]}
                                    </span>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={() => moveSection(index, 'up')} disabled={index === 0} style={{ padding: '4px 8px', border: '1px solid #cbd5e0', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>↑</button>
                                        <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} style={{ padding: '4px 8px', border: '1px solid #cbd5e0', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>↓</button>
                                        <button onClick={() => setEditingSection(editingSection === index ? null : index)} style={{ padding: '4px 8px', border: '1px solid #cbd5e0', background: editingSection === index ? '#3182ce' : 'white', color: editingSection === index ? 'white' : '#4a5568', borderRadius: '4px', cursor: 'pointer' }}>
                                            {editingSection === index ? 'Done' : 'Edit'}
                                        </button>
                                        <button onClick={() => deleteSection(index)} style={{ padding: '4px 8px', border: '1px solid #cbd5e0', background: 'white', color: '#e53e3e', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                                    </div>
                                </div>

                                {/* Edit Form */}
                                {editingSection === index && (
                                    <div style={{ padding: '15px' }}>
                                        <SectionEditor
                                            sectionType={section.sectionType}
                                            data={section.sectionData}
                                            onChange={(newData) => updateSectionData(index, newData)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Live Preview */}
            <div style={{
                flex: 1,
                backgroundColor: '#e2e8f0', // Canvas background
                overflowY: 'auto',
                display: 'flex',
                justifyContent: 'center',
                padding: '20px 40px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    width: '100%',
                    maxWidth: '1200px', // Simulate desktop max-width
                    minHeight: '100%',
                    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                    marginBottom: '40px'
                }}>
                    {/* Render Sections View Only */}
                    {sections
                        .map((section, index) => {
                            if (section.isVisible === false) return null;
                            const SectionComponent = SECTION_COMPONENTS[section.sectionType];
                            if (!SectionComponent) return null;

                            return (
                                <div
                                    key={index}
                                    ref={el => previewSectionRefs.current[index] = el}
                                    style={{ scrollMarginTop: '20px' }} // Adds a bit of breathing room when scrolling
                                >
                                    <SectionComponent
                                        data={section.sectionData}
                                        isEditing={true} // Keep editing visuals if any (e.g. placeholders)
                                    />
                                </div>
                            );
                        })}

                    {sections.length === 0 && (
                        <div style={{ padding: '100px', textAlign: 'center', color: '#718096' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Your Page Preview</h2>
                            <p>Add sections from the left panel to see them appear here instantly.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLandingPageBuilder;
