import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import landingPageService from '../../api/landingPageService';
import { SECTION_TYPE_LABELS, DEFAULT_SECTION_DATA, SECTION_COMPONENTS } from '../../components/landingPage/sections/SectionRegistry';
import SectionEditor from '../../components/landingPage/sections/SectionEditor';
import Loader from '../../components/Loader';
import { getAllProducts } from '../../api/apiService';
import { useLanguage } from '../../contexts/LanguageContext';

// ... (Drag and Drop Imports remain the same - no changes needed here, assuming they are effectively lines 9-27 in original)

// Drag and Drop Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Sortable Section Item Wrapper
 */
const SortableSectionItem = ({ id, section, index, editingSection, setEditingSection, moveSection, deleteSection, updateSectionData, dragging }) => {
    const { t } = useLanguage();
    // ... (SortableSectionItem content remains exactly the same)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '15px',
        position: 'relative',
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div style={{
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Drag Handle */}
                        <div
                            {...attributes}
                            {...listeners}
                            style={{
                                cursor: 'grab',
                                color: '#a0aec0',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            title={t('landingPageBuilder.sections.dragToReorder')}
                        >
                            :::
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#2d3748' }}>
                            {SECTION_TYPE_LABELS[section.sectionType]}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '5px' }}>
                        {/* Fallback arrows for accessibility or preference */}
                        <button onClick={() => moveSection(index, 'up')} disabled={index === 0} style={{ padding: '4px 8px', border: '1px solid #cbd5e0', background: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>↑</button>
                        <button onClick={() => moveSection(index, 'down')} disabled={false} style={{ padding: '4px 8px', border: '1px solid #cbd5e0', background: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>↓</button>

                        <button onClick={() => setEditingSection(editingSection === index ? null : index)} style={{ padding: '4px 8px', border: '1px solid #cbd5e0', background: editingSection === index ? '#3182ce' : 'white', color: editingSection === index ? 'white' : '#4a5568', borderRadius: '4px', cursor: 'pointer' }}>
                            {editingSection === index ? t('landingPageBuilder.sections.done') : t('landingPageBuilder.sections.edit')}
                        </button>
                        <button onClick={() => deleteSection(index)} style={{ padding: '4px 8px', border: '1px solid #cbd5e0', background: 'white', color: '#e53e3e', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                    </div>
                </div>

                {/* Edit Form */}
                {editingSection === index && !isDragging && (
                    <div style={{ padding: '15px' }}>
                        <SectionEditor
                            sectionType={section.sectionType}
                            data={section.sectionData}
                            onChange={(newData) => updateSectionData(index, newData)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};


/**
 * Admin Landing Page Builder
 * Create and edit landing pages with drag-and-drop section builder
 */
const AdminLandingPageBuilder = () => {
    const { t } = useLanguage();
    const { id } = useParams();
    const navigate = useNavigate();
    // Get sidebar context to determine layout width
    const { isSidebarOpen } = useOutletContext() || { isSidebarOpen: false }; // Fallback safety
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
    const [products, setProducts] = useState([]);
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
    const [activeDragId, setActiveDragId] = useState(null);

    // Dnd Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require slight movement to start drag (prevents accidental drags on clicks)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
        fetchProducts();
    }, [id]);

    const fetchProducts = async () => {
        try {
            const response = await getAllProducts({ size: 1000 });
            let productList = [];
            if (response.data && response.data.content) {
                productList = response.data.content;
            } else if (response.data && Array.isArray(response.data)) {
                productList = response.data;
            }
            setProducts(productList);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

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

            // Ensure every section has a unique ID for DnD
            const loadedSections = (data.sections || []).map(s => ({
                ...s,
                _id: s._id || `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }));

            setSections(loadedSections);
            setSettings(data.settings || settings);
        } catch (error) {
            console.error('Error loading landing page:', error);
            alert(t('landingPageBuilder.messages.loadError'));
            navigate('/admin/landing-pages');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (publish = false) => {
        // Validation
        if (!title.trim()) {
            alert(t('landingPageBuilder.messages.enterTitle'));
            return;
        }
        if (!slug.trim()) {
            alert(t('landingPageBuilder.messages.enterSlug'));
            return;
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            alert(t('landingPageBuilder.messages.slugFormat'));
            return;
        }

        // Clean up _id before save
        const sectionsToSave = sections.map((s, idx) => ({
            ...s,
            sectionOrder: idx,
        }));

        const landingPageData = {
            title,
            slug,
            metaTitle,
            metaDescription,
            status: publish ? 'PUBLISHED' : status,
            productId: productId || null,
            sections: sectionsToSave,
            settings,
        };

        try {
            setSaving(true);
            if (isEditMode) {
                await landingPageService.updateLandingPage(id, landingPageData);
                alert(t('landingPageBuilder.messages.saveSuccess'));
            } else {
                await landingPageService.createLandingPage(landingPageData);
                alert(t('landingPageBuilder.messages.createSuccess'));
                navigate('/admin/landing-pages');
            }
        } catch (error) {
            console.error('[LandingPageBuilder] Error saving landing page:', error);
            alert(error.response?.data?.message || t('landingPageBuilder.messages.saveError'));
        } finally {
            setSaving(false);
        }
    };

    const addSection = (sectionType) => {
        const duplicateCount = sections.filter(s => s.sectionType === sectionType).length;
        if (duplicateCount > 0) {
            const confirmAdd = window.confirm(
                t('landingPageBuilder.messages.duplicateSection', { count: duplicateCount, type: SECTION_TYPE_LABELS[sectionType] })
            );
            if (!confirmAdd) return;
        }

        const newSection = {
            _id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            sectionType,
            sectionOrder: sections.length,
            sectionData: DEFAULT_SECTION_DATA[sectionType] || {},
            isVisible: true,
        };
        setSections([...sections, newSection]);
        setShowSectionPicker(false);
        setEditingSection(sections.length);
    };

    const deleteSection = (index) => {
        if (!confirm(t('landingPageBuilder.messages.deleteSectionConfirm'))) return;
        const updatedSections = sections.filter((_, i) => i !== index);
        updatedSections.forEach((section, idx) => { section.sectionOrder = idx; });
        setSections(updatedSections);
        setEditingSection(null);
    };

    const moveSection = (index, direction) => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const updatedSections = [...sections];
        const temp = updatedSections[index];
        updatedSections[index] = updatedSections[newIndex];
        updatedSections[newIndex] = temp;
        updatedSections.forEach((section, idx) => { section.sectionOrder = idx; });
        setSections(updatedSections);
    };

    const updateSectionData = (index, newData) => {
        const updatedSections = [...sections];
        updatedSections[index].sectionData = newData;
        setSections(updatedSections);
    };

    const generateSlugFromTitle = () => {
        const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        setSlug(generatedSlug);
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (event) => {
        setActiveDragId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex((item) => item._id === active.id);
                const newIndex = items.findIndex((item) => item._id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                return newItems.map((item, index) => ({ ...item, sectionOrder: index }));
            });
        }
        setActiveDragId(null);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <Loader />
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: isSidebarOpen ? '256px' : '0', // Adjust for sidebar width (w-64 = 256px)
            zIndex: 90, // Above Header (usually 50), Below Sidebar (100)
            display: 'flex',
            backgroundColor: '#f5f7f9',
            transition: 'left 0.3s ease-in-out',
            overflow: 'hidden' // Force no scroll on this container
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
                    padding: isSidebarOpen ? '15px 20px' : '15px 20px 15px 60px',
                    borderBottom: '1px solid #e1e4e8',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    transition: 'padding 0.3s ease-in-out'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button
                                onClick={() => navigate('/admin/landing-pages')}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    color: '#4a5568',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    transition: 'all 0.2s',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#edf2f7';
                                    e.currentTarget.style.borderColor = '#cbd5e0';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                                title={t('landingPageBuilder.header.back')}
                            >
                                <FiArrowLeft size={16} />
                                {t('landingPageBuilder.header.back')}
                            </button>
                            <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#2d3748' }}>
                                {isEditMode ? t('landingPageBuilder.header.editTitle') : t('landingPageBuilder.header.newTitle')}
                            </h1>
                        </div>
                    </div>
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
                            {saving ? t('landingPageBuilder.header.saving') : t('landingPageBuilder.header.saveDraft')}
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
                            {saving ? '...' : t('landingPageBuilder.header.publish')}
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
                        <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1rem', color: '#4a5568' }}>⚙️ {t('landingPageBuilder.settings.title')}</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>{t('landingPageBuilder.settings.pageTitle')}</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>
                                {t('landingPageBuilder.settings.slug')} <button type="button" onClick={generateSlugFromTitle} style={{ fontSize: '0.75rem', padding: '2px 6px', marginLeft: '5px', cursor: 'pointer', background: '#e2e8f0', border: 'none', borderRadius: '4px' }}>{t('landingPageBuilder.settings.generate')}</button>
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', fontFamily: 'monospace' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>{t('landingPageBuilder.settings.mainProduct')}</label>
                            <select
                                value={productId || ''}
                                onChange={(e) => setProductId(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                            >

                                {products.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            <small style={{ color: '#666', fontSize: '0.8rem' }}>
                                {t('landingPageBuilder.settings.mainProductHelp')}
                            </small>
                        </div>
                    </div>

                    {/* Section Builder */}
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🏗️ {t('landingPageBuilder.sections.title')}</h3>
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
                            + {t('landingPageBuilder.sections.addNew')}
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
                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: '#718096' }}>{t('landingPageBuilder.sections.clickToAdd')}</div>
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
                                {t('landingPageBuilder.sections.noSections')}
                            </div>
                        )}

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sections.map(s => s._id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {sections.map((section, index) => (
                                    <SortableSectionItem
                                        key={section._id}
                                        id={section._id}
                                        section={section}
                                        index={index}
                                        editingSection={editingSection}
                                        setEditingSection={setEditingSection}
                                        moveSection={moveSection}
                                        deleteSection={deleteSection}
                                        updateSectionData={updateSectionData}
                                    />
                                ))}
                            </SortableContext>

                            {/* Drag Overlay (Optional but nice for visual feedback) */}
                            {/* For simplicity, we stick to in-place dragging first. 
                                Adding Overlay requires portal and rendering specific duplicate item. */}
                        </DndContext>
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
                                    key={section._id || index}
                                    ref={el => previewSectionRefs.current[index] = el}
                                    style={{ scrollMarginTop: '20px' }} // Adds a bit of breathing room when scrolling
                                >
                                    <SectionComponent
                                        data={section.sectionData}
                                        productId={productId}
                                        isEditing={true} // Keep editing visuals if any (e.g. placeholders)
                                    />
                                </div>
                            );
                        })}

                    {sections.length === 0 && (
                        <div style={{ padding: '100px', textAlign: 'center', color: '#718096' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{t('landingPageBuilder.preview.title')}</h2>
                            <p>{t('landingPageBuilder.preview.subtitle')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLandingPageBuilder;
