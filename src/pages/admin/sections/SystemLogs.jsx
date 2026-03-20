import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Download, Search, FilterX, ChevronDown, ChevronRight,
    Info, AlertTriangle, AlertCircle, Clock, ShieldAlert
} from 'lucide-react';
import adminApi from '@/services/axios/adminApi';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/AdminLayout/PageContainer';
import styles from './SystemLogs.module.css';

// ── CONSTANTS & HELPERS ──────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Auth', 'User & Membership', 'Org Changes', 'System'];
const SEVERITIES = ['All', 'Info', 'Warning', 'Critical'];

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const maskIp = (ip) => {
    if (!ip) return 'N/A';
    const parts = ip.split('.');
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
    return `${ip.substring(0, 4)}***`; // Basic fallback for IPv6
};

const getRelativeTime = (dateStr) => {
    const ds = new Date(dateStr);
    const diffInSeconds = Math.floor((new Date() - ds) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function SystemLogs() {
    // ── STATE ──
    const [logs, setLogs] = useState([]);
    const [actors, setActors] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState(''); // Immediate input value
    const [filters, setFilters] = useState({
        search: '',
        category: 'All',
        actor_id: 'All',
        date_from: (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; })(),
        date_to: new Date().toISOString().split('T')[0],
        severity: 'All'
    });

    const [pagination, setPagination] = useState({ page: 1, page_size: 25 });
    
    // UI State
    const [expandedRow, setExpandedRow] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

    // ── DEBOUNCE SEARCH ──
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.search !== searchTerm) {
                setFilters(f => ({ ...f, search: searchTerm }));
                setPagination(p => ({ ...p, page: 1 }));
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm, filters.search]);

    // ── FETCH ACTORS (Once on mount) ──
    useEffect(() => {
        adminApi.get('/sys/logs/actors/')
            .then(res => setActors(res.data))
            .catch(() => {}); // Optional context, ignore if fails
    }, []);

    // ── API FETCH LOGS ──
    const fetchLogs = useCallback(async (isPolling = false) => {
        if (!isPolling) setLoading(true);
        setError(null);
        try {
            const params = {
                page: pagination.page,
                page_size: pagination.page_size,
                ...(filters.search && { search: filters.search }),
                ...(filters.category !== 'All' && { category: filters.category }),
                ...(filters.actor_id !== 'All' && { actor_id: filters.actor_id }),
                ...(filters.severity !== 'All' && { severity: filters.severity }),
                date_from: filters.date_from,
                date_to: filters.date_to,
            };

            const { data } = await adminApi.get('/sys/logs/', { params });
            // Structure expected: { results: [], count: 143 } (DRF Paginated)
            setLogs(data.results || data || []);
            setTotalCount(data.count || (data.results || data || []).length);
            setLastUpdated(new Date());
            setSecondsSinceUpdate(0);
        } catch (err) {
            setError("Failed to fetch activity logs.");
            // Reset logs on hard fail if not polling
            if (!isPolling) setLogs([]);
        } finally {
            if (!isPolling) setLoading(false);
        }
    }, [filters, pagination]);

    // Re-fetch when dependencies change
    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // ── AUTO REFRESH TICKER ──
    useEffect(() => {
        if (!autoRefresh) return;
        const pollInterval = setInterval(() => {
            fetchLogs(true);
        }, 30000); // 30s
        return () => clearInterval(pollInterval);
    }, [autoRefresh, fetchLogs]);

    // Update the "Last updated X seconds ago" counter
    useEffect(() => {
        const secInterval = setInterval(() => {
            setSecondsSinceUpdate(Math.floor((new Date() - lastUpdated) / 1000));
        }, 1000);
        return () => clearInterval(secInterval);
    }, [lastUpdated]);

    // ── HANDLERS ──
    const handleClearFilters = () => {
        setSearchTerm('');
        setFilters({
            search: '', category: 'All', actor_id: 'All', severity: 'All',
            date_from: (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; })(),
            date_to: new Date().toISOString().split('T')[0],
        });
        setPagination({ page: 1, page_size: 25 });
    };

    const handleExport = async () => {
        try {
            const params = {
                ...(filters.search && { search: filters.search }),
                ...(filters.category !== 'All' && { category: filters.category }),
                ...(filters.actor_id !== 'All' && { actor_id: filters.actor_id }),
                ...(filters.severity !== 'All' && { severity: filters.severity }),
                date_from: filters.date_from,
                date_to: filters.date_to,
            };
            const response = await adminApi.get('/sys/logs/export/', { params, responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'activity_logs.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Failed to export logs.");
        }
    };

    const getSeverityIcon = (sev) => {
        switch(sev?.toLowerCase()) {
            case 'info': return <Info size={16} className={styles.sevInfo} title="Info" />;
            case 'warning': return <AlertTriangle size={16} className={styles.sevWarn} title="Warning" />;
            case 'critical': return <ShieldAlert size={16} className={styles.sevCrit} title="Critical" />;
            default: return <Info size={16} className={styles.sevInfo} />;
        }
    };

    // ── RENDER ──
    return (
        <PageContainer>
            <div className={styles.page}>
                
                {/* ── HEADER ── */}
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Activity Logs</h1>
                        <p className={styles.subtitle}>All activity scoped to your organization</p>
                    </div>
                    <Button variant="secondary" onClick={handleExport} disabled={logs.length === 0}>
                        <Download size={16} /> Export CSV
                    </Button>
                </header>

                {/* ── ERROR BANNER ── */}
                {error && (
                    <div className={styles.errorBanner}>
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}><AlertCircle size={18} /> {error}</div>
                        <Button variant="secondary" size="sm" onClick={() => fetchLogs()}>Retry</Button>
                    </div>
                )}

                {/* ── FILTER BAR ── */}
                <div className={styles.filterBar}>
                    <div className={styles.filterGrid}>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Search</label>
                            <div className={styles.searchWrapper}>
                                <Search size={14} className={styles.searchIcon} />
                                <input 
                                    type="text" 
                                    className={`${styles.input} ${styles.searchInput}`} 
                                    placeholder="Actor, email, action..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Category</label>
                            <select className={styles.select} value={filters.category} onChange={(e) => { setFilters(f => ({...f, category: e.target.value})); setPagination(p => ({...p, page:1})) }}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Actor</label>
                            <select className={styles.select} value={filters.actor_id} onChange={(e) => { setFilters(f => ({...f, actor_id: e.target.value})); setPagination(p => ({...p, page:1})) }}>
                                <option value="All">All Users</option>
                                {actors.map(a => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Date From</label>
                            <input type="date" className={styles.input} value={filters.date_from} onChange={(e) => { setFilters(f => ({...f, date_from: e.target.value})); setPagination(p => ({...p, page:1})) }} />
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Date To</label>
                            <input type="date" className={styles.input} value={filters.date_to} onChange={(e) => { setFilters(f => ({...f, date_to: e.target.value})); setPagination(p => ({...p, page:1})) }} />
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Severity</label>
                            <select className={styles.select} value={filters.severity} onChange={(e) => { setFilters(f => ({...f, severity: e.target.value})); setPagination(p => ({...p, page:1})) }}>
                                {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className={styles.filterFooter}>
                        <div className={styles.autoRefreshToggle}>
                            <label style={{display:'flex', alignItems:'center', gap:'8px', cursor:'pointer'}}>
                                <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} style={{display:'none'}} />
                                <div className={styles.switch}></div>
                                <span>Auto-refresh (30s)</span>
                            </label>
                            {autoRefresh && (
                                <span className={styles.lastUpdated}>
                                    <Clock size={12} style={{display:'inline', verticalAlign:'sub'}} /> Last updated {secondsSinceUpdate}s ago
                                </span>
                            )}
                        </div>
                        <button className={styles.clearFilters} onClick={handleClearFilters}>
                            <FilterX size={14} style={{display:'inline', verticalAlign:'sub', marginRight:'4px'}} /> 
                            Clear filters
                        </button>
                    </div>
                </div>

                {/* ── MAIN CONTENT (TABLE / EMPTY / SKELETON) ── */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{width: '32px'}}></th>
                                    <th>Timestamp</th>
                                    <th>Actor</th>
                                    <th>Category</th>
                                    <th>Action</th>
                                    <th style={{textAlign: 'center'}}>Severity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && logs.length === 0 ? (
                                    /* SKELETON LOADER */
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan="6" style={{padding: 'var(--space-4)'}}>
                                                <div className={styles.skeletonRow}></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : logs.length === 0 ? (
                                    /* EMPTY STATE */
                                    <tr>
                                        <td colSpan="6" className={styles.emptyStateCell}>
                                            <div className={styles.emptyState}>
                                                <AlertCircle size={48} style={{opacity: 0.2, marginBottom: 'var(--space-3)'}} />
                                                <p style={{fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)'}}>No logs found</p>
                                                <p>No activity matched the selected filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    /* ACTUAL LOG ROWS */
                                    logs.map(log => {
                                        const isExpanded = expandedRow === log.id;
                                        return (
                                            <React.Fragment key={log.id}>
                                                <tr className={`${styles.row} ${isExpanded ? styles.rowExpanded : ''}`} onClick={() => setExpandedRow(isExpanded ? null : log.id)}>
                                                    <td>
                                                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                    </td>
                                                    <td className={styles.timestamp} title={getRelativeTime(log.timestamp)}>
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </td>
                                                    <td>
                                                        <div className={styles.actorCell}>
                                                            <div className={styles.avatar}>{getInitials(log.actor_name)}</div>
                                                            <div className={styles.actorInfo}>
                                                                <span className={styles.actorName}>{log.actor_name || 'System Auto'}</span>
                                                                <span className={styles.actorEmail}>{log.actor_email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`${styles.badge} ${styles.badgeCategory}`}>
                                                            {log.category}
                                                        </span>
                                                    </td>
                                                    <td>{log.action}</td>
                                                    <td style={{textAlign: 'center'}}>
                                                        {getSeverityIcon(log.severity)}
                                                    </td>
                                                </tr>
                                                
                                                {/* EXPANDED DETAILS */}
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan="6" className={styles.expandedCell}>
                                                            <div className={styles.detailsContent}>
                                                                <div className={styles.detailSection}>
                                                                    <div className={styles.detailTitle}>Context Attributes</div>
                                                                    <div className={styles.detailRow}>
                                                                        <span className={styles.detailKey}>Full Description</span>
                                                                        <span>{log.description || log.action}</span>
                                                                    </div>
                                                                    <div className={styles.detailRow}>
                                                                        <span className={styles.detailKey}>IP Address</span>
                                                                        <span className={styles.detailVal}>{log.ip_address || 'Unknown'}</span>
                                                                    </div>
                                                                    <div className={styles.detailRow}>
                                                                        <span className={styles.detailKey}>User Agent</span>
                                                                        <span className={styles.detailVal} title={log.user_agent}>
                                                                            {(log.user_agent || '').substring(0, 40)}{(log.user_agent?.length > 40 ? '...' : '') || 'Unknown'}
                                                                        </span>
                                                                    </div>
                                                                    <div className={styles.detailRow}>
                                                                        <span className={styles.detailKey}>Session ID</span>
                                                                        <span className={styles.detailVal}>{log.session_id ? `...${log.session_id.substring(log.session_id.length - 8)}` : 'N/A'}</span>
                                                                    </div>
                                                                </div>

                                                                {log.changed_fields && Object.keys(log.changed_fields).length > 0 && (
                                                                    <div className={styles.detailSection}>
                                                                        <div className={styles.detailTitle}>Data Mutations</div>
                                                                        {Object.entries(log.changed_fields).map(([field, changes]) => (
                                                                            <div key={field} className={styles.detailRow}>
                                                                                <span className={styles.detailKey} style={{textTransform:'capitalize'}}>{field.replace(/_/g, ' ')}</span>
                                                                                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                                                                    <span className={styles.detailVal}>{String(changes.old_value || 'None')}</span>
                                                                                    <span style={{color:'var(--color-border)'}}>→</span>
                                                                                    <span className={styles.detailVal} style={{background:'var(--teal-50)', color:'var(--teal-700)'}}>{String(changes.new_value || 'None')}</span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── PAGINATION ── */}
                    {logs.length > 0 && (
                        <div className={styles.pagination}>
                            <div className={styles.pageInfo}>
                                Showing {((pagination.page - 1) * pagination.page_size) + 1}–{Math.min(pagination.page * pagination.page_size, totalCount)} of {totalCount} entries
                            </div>
                            <div className={styles.pageControls}>
                                <select 
                                    className={styles.pageSizeSelect}
                                    value={pagination.page_size} 
                                    onChange={e => { setPagination({ page: 1, page_size: parseInt(e.target.value) }); }}
                                >
                                    <option value={25}>25 rows</option>
                                    <option value={50}>50 rows</option>
                                    <option value={100}>100 rows</option>
                                </select>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    disabled={pagination.page === 1}
                                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                >
                                    Prev
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    disabled={pagination.page * pagination.page_size >= totalCount}
                                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
