import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import landingPageService from '../../api/landingPageService';
import Loader from '../../components/Loader';

/**
 * Admin Landing Pages List Page
 * View, manage, and create landing pages
 */
const AdminLandingPagesPage = () => {
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
            alert(`Failed to load landing pages: ${error.message}`);
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
        if (!confirm('Are you sure you want to publish this landing page?')) return;
        
        try {
            await landingPageService.publishLandingPage(id);
            alert('Landing page published successfully!');
            loadLandingPages();
        } catch (error) {
            console.error('Error publishing landing page:', error);
            alert('Failed to publish landing page');
        }
    };

    const handleUnpublish = async (id) => {
        if (!confirm('Are you sure you want to unpublish this landing page?')) return;
        
        try {
            await landingPageService.unpublishLandingPage(id);
            alert('Landing page unpublished successfully!');
            loadLandingPages();
        } catch (error) {
            console.error('Error unpublishing landing page:', error);
            alert('Failed to unpublish landing page');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this landing page? This action cannot be undone.')) return;
        
        try {
            await landingPageService.deleteLandingPage(id);
            alert('Landing page deleted successfully!');
            loadLandingPages();
            loadStats();
        } catch (error) {
            console.error('Error deleting landing page:', error);
            alert('Failed to delete landing page');
        }
    };

    const handleDuplicate = async (id) => {
        const newSlug = prompt('Enter a slug for the duplicated page (e.g., product-landing-copy):');
        if (!newSlug) return;
        
        try {
            const duplicated = await landingPageService.duplicateLandingPage(id, newSlug);
            alert('Landing page duplicated successfully!');
            navigate(`/admin/landing-pages/${duplicated.id}/edit`);
        } catch (error) {
            console.error('Error duplicating landing page:', error);
            alert(error.response?.data?.message || 'Failed to duplicate landing page');
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
                {status}
            </span>
        );
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#333' }}>Landing Pages</h1>
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
                    + Create Landing Page
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
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Pages</div>
                        </div>
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#d4edda',
                            borderRadius: '8px',
                            border: '1px solid #c3e6cb',
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724' }}>{stats.publishedPages}</div>
                            <div style={{ fontSize: '0.9rem', color: '#155724' }}>Published</div>
                        </div>
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#fff3cd',
                            borderRadius: '8px',
                            border: '1px solid #ffeaa7',
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#856404' }}>{stats.draftPages}</div>
                            <div style={{ fontSize: '0.9rem', color: '#856404' }}>Drafts</div>
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
                        <option value="ALL">All Status</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>

                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1 }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title..."
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
                            Search
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
                        <h3>No landing pages found</h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Create your first landing page to get started!</p>
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
                            + Create Landing Page
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
                                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Title</th>
                                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Slug</th>
                                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                                        <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Views</th>
                                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Created</th>
                                        <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {landingPages.map((lp) => (
                                        <tr key={lp.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ fontWeight: '600' }}>{lp.title}</div>
                                                {lp.productName && (
                                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                        Product: {lp.productName}
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
                                                        Edit
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
                                                            View
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
                                                            Publish
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
                                                            Unpublish
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
                                                        Duplicate
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
                                                        Delete
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
                                    Previous
                                </button>
                                <span style={{ padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
                                    Page {page + 1} of {totalPages}
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
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
        </div>
    );
};

export default AdminLandingPagesPage;

