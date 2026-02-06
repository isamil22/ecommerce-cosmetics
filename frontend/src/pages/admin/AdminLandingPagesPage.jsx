import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import landingPageService from '../../api/landingPageService';
import Loader from '../../components/Loader';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Admin Landing Pages List Page
 * View, manage, and create landing pages
 */
const AdminLandingPagesPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [landingPages, setLandingPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadLandingPages();
        loadStats();
    }, [page, filterStatus]);

    const loadLandingPages = async () => {
        try {
            setLoading(true);
            let data;

            if (searchQuery) {
                data = await landingPageService.searchLandingPages(searchQuery, page, 10);
            } else if (filterStatus !== 'ALL') {
                data = await landingPageService.getLandingPagesByStatus(filterStatus, page, 10);
            } else {
                data = await landingPageService.getAllLandingPages(page, 10);
            }

            // Handle empty or null response
            const content = data?.content || [];
            const pages = data?.totalPages || 0;

            setLandingPages(content);
            setTotalPages(pages);
        } catch (error) {
            console.error('Error loading landing pages:', error);
            alert(`${t('landingPagesPage.messages.errorFetch')}: ${error.message}`);
            setLandingPages([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const data = await landingPageService.getSummaryStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
            setStats(null);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        loadLandingPages();
    };

    const handlePublish = async (id) => {
        if (!confirm(t('landingPagesPage.messages.publishConfirm'))) return;

        try {
            await landingPageService.publishLandingPage(id);
            alert(t('landingPagesPage.messages.publishedSuccess'));
            loadLandingPages();
        } catch (error) {
            console.error('Error publishing landing page:', error);
            alert(t('landingPagesPage.messages.errorAction'));
        }
    };

    const handleUnpublish = async (id) => {
        if (!confirm(t('landingPagesPage.messages.unpublishConfirm'))) return;

        try {
            await landingPageService.unpublishLandingPage(id);
            alert(t('landingPagesPage.messages.unpublishedSuccess'));
            loadLandingPages();
        } catch (error) {
            console.error('Error unpublishing landing page:', error);
            alert(t('landingPagesPage.messages.errorAction'));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t('landingPagesPage.messages.deleteConfirm'))) return;

        try {
            await landingPageService.deleteLandingPage(id);
            alert(t('landingPagesPage.messages.deletedSuccess'));
            loadLandingPages();
            loadStats();
        } catch (error) {
            console.error('Error deleting landing page:', error);
            alert(t('landingPagesPage.messages.errorAction'));
        }
    };

    const handleDuplicate = async (id) => {
        const newSlug = prompt(t('landingPagesPage.messages.duplicatePrompt'));
        if (!newSlug) return;

        try {
            const duplicated = await landingPageService.duplicateLandingPage(id, newSlug);
            alert(t('landingPagesPage.messages.duplicatedSuccess'));
            navigate(`/admin/landing-pages/${duplicated.id}/edit`);
        } catch (error) {
            console.error('Error duplicating landing page:', error);
            alert(error.response?.data?.message || t('landingPagesPage.messages.errorAction'));
        }
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            PUBLISHED: { bg: '#d4edda', color: '#155724' },
            DRAFT: { bg: '#fff3cd', color: '#856404' },
            ARCHIVED: { bg: '#f8d7da', color: '#721c24' },
        };

        const style = statusColors[status] || {};
        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: '600',
                backgroundColor: style.bg,
                color: style.color,
            }}>
                {status === 'PUBLISHED' ? t('landingPagesPage.status.published') : status === 'DRAFT' ? t('landingPagesPage.status.draft') : status === 'ARCHIVED' ? t('landingPagesPage.status.archived') : status}
            </span>
        );
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#333' }}>{t('landingPagesPage.title')}</h1>
                <Link
                    to="/admin/landing-pages/create"
                    style={{
                        backgroundColor: '#ff69b4',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: '600',
                    }}
                >
                    + {t('landingPagesPage.create')}
                </Link>
            </div>

            {/* Statistics */}
            {stats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px',
                }}>
                    <div style={{
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6',
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{stats.totalPages}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{t('landingPagesPage.stats.total')}</div>
                    </div>
                    <div style={{
                        padding: '20px',
                        backgroundColor: '#d4edda',
                        borderRadius: '8px',
                        border: '1px solid #c3e6cb',
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724' }}>{stats.publishedPages}</div>
                        <div style={{ fontSize: '0.9rem', color: '#155724' }}>{t('landingPagesPage.stats.active')}</div>
                    </div>
                    <div style={{
                        padding: '20px',
                        backgroundColor: '#fff3cd',
                        borderRadius: '8px',
                        border: '1px solid #ffeaa7',
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#856404' }}>{stats.draftPages}</div>
                        <div style={{ fontSize: '0.9rem', color: '#856404' }}>{t('landingPagesPage.tabs.drafts')}</div>
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '20px',
                flexWrap: 'wrap',
            }}>
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
                    style={{
                        padding: '10px 15px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                    }}
                >
                    <option value="ALL">{t('landingPagesPage.tabs.all')}</option>
                    <option value="PUBLISHED">{t('landingPagesPage.tabs.published')}</option>
                    <option value="DRAFT">{t('landingPagesPage.tabs.drafts')}</option>
                    <option value="ARCHIVED">{t('landingPagesPage.tabs.archived')}</option>
                </select>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1 }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('landingPagesPage.searchPlaceholder')}
                        style={{
                            flex: 1,
                            padding: '10px 15px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            fontSize: '1rem',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                        }}
                    >
                        {t('landingPagesPage.search')}
                    </button>
                </form>
            </div>

            {/* Landing Pages Table */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                    <Loader />
                </div>
            ) : landingPages.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '50px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                }}>
                    <h3>{t('landingPagesPage.emptyState')}</h3>
                    <p style={{ color: '#666', marginBottom: '20px' }}>{t('landingPagesPage.emptyDesc')}</p>
                    <Link
                        to="/admin/landing-pages/create"
                        style={{
                            backgroundColor: '#ff69b4',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            display: 'inline-block',
                        }}
                    >
                        + {t('landingPagesPage.create')}
                    </Link>
                </div>
            ) : (
                <>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>{t('landingPagesPage.table.title')}</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>{t('landingPagesPage.table.slug')}</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>{t('landingPagesPage.table.status')}</th>
                                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>{t('landingPagesPage.table.views')}</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>{t('landingPagesPage.table.createdOn')}</th>
                                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>{t('landingPagesPage.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {landingPages.map((lp) => (
                                    <tr key={lp.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: '600' }}>{lp.title}</div>
                                            {lp.productName && (
                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                    {t('landingPagesPage.productLabel')}: {lp.productName}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '15px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                            /{lp.slug}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            {getStatusBadge(lp.status)}
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>
                                            {lp.totalViews || 0}
                                        </td>
                                        <td style={{ padding: '15px', fontSize: '0.9rem', color: '#666' }}>
                                            {new Date(lp.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                                <Link
                                                    to={`/admin/landing-pages/${lp.id}/edit`}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#007bff',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        textDecoration: 'none',
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    {t('landingPagesPage.table.edit')}
                                                </Link>
                                                {lp.status === 'PUBLISHED' && (
                                                    <a
                                                        href={`/landing/${lp.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: '#28a745',
                                                            color: 'white',
                                                            borderRadius: '4px',
                                                            textDecoration: 'none',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        {t('landingPagesPage.table.view')}
                                                    </a>
                                                )}
                                                {lp.status === 'DRAFT' && (
                                                    <button
                                                        onClick={() => handlePublish(lp.id)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: '#28a745',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        {t('landingPagesPage.table.publish')}
                                                    </button>
                                                )}
                                                {lp.status === 'PUBLISHED' && (
                                                    <button
                                                        onClick={() => handleUnpublish(lp.id)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: '#ffc107',
                                                            color: '#000',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        {t('landingPagesPage.table.unpublish')}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDuplicate(lp.id)}
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
                                                    {t('landingPagesPage.table.duplicate')}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lp.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    {t('landingPagesPage.table.delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                            marginTop: '30px',
                        }}>
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: page === 0 ? '#e9ecef' : '#007bff',
                                    color: page === 0 ? '#6c757d' : 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {t('landingPagesPage.pagination.previous')}
                            </button>
                            <span style={{ padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
                                {t('landingPagesPage.pagination.pageOf').replace('{current}', page + 1).replace('{total}', totalPages)}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: page >= totalPages - 1 ? '#e9ecef' : '#007bff',
                                    color: page >= totalPages - 1 ? '#6c757d' : 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {t('landingPagesPage.pagination.next')}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminLandingPagesPage;
