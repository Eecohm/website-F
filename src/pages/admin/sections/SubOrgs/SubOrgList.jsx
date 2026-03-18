import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, Plus, Edit3, PowerOff, RefreshCw,
    AlertTriangle, Users, Layers, CheckCircle,
    RotateCcw,
} from 'lucide-react';
import adminApi from '@/services/axios/adminApi';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import styles from './SubOrgs.module.css';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_LABELS = {
    department: 'Department',
    campus: 'Campus',
    branch: 'Branch',
    faculty: 'Faculty',
    other: 'Other',
};

const TYPE_AVATAR_CLASS = {
    department: styles.nameAvatarDept,
    campus: styles.nameAvatarCampus,
    branch: styles.nameAvatarBranch,
    faculty: styles.nameAvatarFaculty,
    other: styles.nameAvatarOther,
};

const TYPE_BADGE_CLASS = {
    department: styles.typeDept,
    campus: styles.typeCampus,
    branch: styles.typeBranch,
    faculty: styles.typeFaculty,
    other: styles.typeOther,
};

function getInitials(name) {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatsBanner({ subOrgs }) {
    const total = subOrgs.length;
    const active = subOrgs.filter(s => s.is_active).length;
    const inactive = total - active;

    return (
        <div className={styles.statsBanner}>
            <div className={styles.statCard}>
                <div className={`${styles.statIconWrap} ${styles.iconBlue}`}>
                    <Layers size={18} />
                </div>
                <div className={styles.statInfo}>
                    <div className={styles.statValue}>{total}</div>
                    <div className={styles.statLabel}>Total Sub-Orgs</div>
                </div>
            </div>
            <div className={styles.statCard}>
                <div className={`${styles.statIconWrap} ${styles.iconGreen}`}>
                    <CheckCircle size={18} />
                </div>
                <div className={styles.statInfo}>
                    <div className={styles.statValue}>{active}</div>
                    <div className={styles.statLabel}>Active</div>
                </div>
            </div>
            <div className={styles.statCard}>
                <div className={`${styles.statIconWrap} ${styles.iconAmber}`}>
                    <Users size={18} />
                </div>
                <div className={styles.statInfo}>
                    <div className={styles.statValue}>{inactive}</div>
                    <div className={styles.statLabel}>Inactive</div>
                </div>
            </div>
        </div>
    );
}

function SubOrgRow({ subOrg, onToggle }) {
    const [toggling, setToggling] = useState(false);

    const navigate = useNavigate();

    const handleToggle = async () => {
        setToggling(true);
        await onToggle(subOrg);
        setToggling(false);
    };

    return (
        <tr className={styles.tr}>
            {/* Name + code */}
            <td className={styles.td}>
                <div className={styles.nameCell}>
                    <div className={`${styles.nameAvatar} ${TYPE_AVATAR_CLASS[subOrg.sub_type] ?? styles.nameAvatarOther}`}>
                        {getInitials(subOrg.name)}
                    </div>
                    <div>
                        <div className={styles.nameMain}>{subOrg.name}</div>
                        <div className={styles.nameSub}>{subOrg.code}</div>
                    </div>
                </div>
            </td>

            {/* Type */}
            <td className={styles.td}>
                <span className={`${styles.typeBadge} ${TYPE_BADGE_CLASS[subOrg.sub_type] ?? styles.typeOther}`}>
                    {TYPE_LABELS[subOrg.sub_type] ?? subOrg.sub_type}
                </span>
            </td>

            {/* Members */}
            <td className={styles.td}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Users size={13} style={{ color: 'var(--color-text-muted)' }} />
                    {subOrg.member_count ?? 0}
                </span>
            </td>

            {/* Status */}
            <td className={styles.td}>
                <span className={`${styles.statusBadge} ${subOrg.is_active ? styles.statusActive : styles.statusInactive}`}>
                    <span className={styles.statusDot} />
                    {subOrg.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>

            {/* Actions */}
            <td className={styles.td}>
                <div className={styles.actions}>
                    <button
                        className={styles.actionBtn}
                        onClick={() => navigate(`/app/admin/sub-orgs/${subOrg.code}`)}
                        title="Edit"
                    >
                        <Edit3 size={13} /> Edit
                    </button>
                    <button
                        className={`${styles.actionBtn} ${subOrg.is_active ? styles.actionBtnDanger : styles.actionBtnRestore}`}
                        onClick={handleToggle}
                        disabled={toggling}
                        title={subOrg.is_active ? 'Deactivate' : 'Restore'}
                    >
                        {toggling
                            ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
                            : subOrg.is_active
                                ? <><PowerOff size={13} /> Deactivate</>
                                : <><RotateCcw size={13} /> Restore</>
                        }
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const SubOrgList = () => {
    const navigate = useNavigate();

    const [subOrgs, setSubOrgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInactive, setShowInactive] = useState(false);

    const fetchSubOrgs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = showInactive ? '?include_inactive=true' : '';
            const { data } = await adminApi.get(`/org/sub-orgs/${params}`);
            setSubOrgs(data);
        } catch (err) {
            setError(err.response?.data?.detail ?? 'Failed to load sub-organizations.');
        } finally {
            setLoading(false);
        }
    }, [showInactive]);

    useEffect(() => { fetchSubOrgs(); }, [fetchSubOrgs]);

    const handleToggle = async (subOrg) => {
        try {
            if (subOrg.is_active) {
                // Deactivate (soft-delete)
                await adminApi.delete(`/org/sub-orgs/${subOrg.code}/`);
            } else {
                // Restore
                await adminApi.patch(`/org/sub-orgs/${subOrg.code}/`, { is_active: true });
            }
            await fetchSubOrgs();
        } catch (err) {
            console.error('Toggle failed:', err);
        }
    };

    return (
        <div className={styles.page}>
            {/* ── Header ─────────────────────────────────────────── */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Sub-Organizations</h1>
                    <p className={styles.pageSubtitle}>
                        Manage departments, campuses, branches, and faculties within your organization.
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchSubOrgs}
                        disabled={loading}
                        title="Refresh"
                    >
                        <RefreshCw size={15} />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowInactive(v => !v)}
                    >
                        {showInactive ? 'Hide Inactive' : 'Show Inactive'}
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/app/admin/sub-orgs/new')}
                    >
                        <Plus size={15} /> Add Sub-Organization
                    </Button>
                </div>
            </div>

            {/* ── Loading ─────────────────────────────────────────── */}
            {loading && (
                <div className={styles.stateContainer}>
                    <Spinner size="md" />
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
                        Loading sub-organizations…
                    </span>
                </div>
            )}

            {/* ── Error ───────────────────────────────────────────── */}
            {!loading && error && (
                <div className={styles.stateContainer}>
                    <div className={styles.stateIcon}><AlertTriangle size={22} color="var(--color-danger)" /></div>
                    <div className={styles.stateTitle}>Failed to load</div>
                    <div className={styles.stateText}>{error}</div>
                    <Button variant="secondary" size="sm" onClick={fetchSubOrgs}>
                        <RefreshCw size={14} /> Retry
                    </Button>
                </div>
            )}

            {/* ── Content ─────────────────────────────────────────── */}
            {!loading && !error && (
                <>
                    <StatsBanner subOrgs={subOrgs} />

                    <div className={styles.tableCard}>
                        <div className={styles.tableHeader}>
                            <div className={styles.tableTitle}>
                                <Building2 size={16} />
                                All Sub-Organizations
                                <span className={styles.tableMeta}>{subOrgs.length}</span>
                            </div>
                        </div>

                        {subOrgs.length === 0 ? (
                            <div className={styles.stateContainer}>
                                <div className={styles.stateIcon}><Layers size={22} /></div>
                                <div className={styles.stateTitle}>No sub-organizations yet</div>
                                <div className={styles.stateText}>
                                    Create departments, campuses, or branches to scope members and data.
                                </div>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate('/app/admin/sub-orgs/new')}
                                >
                                    <Plus size={14} /> Add your first sub-org
                                </Button>
                            </div>
                        ) : (
                            <div className={styles.tableBody}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th className={styles.th}>Name / Code</th>
                                            <th className={styles.th}>Type</th>
                                            <th className={styles.th}>Members</th>
                                            <th className={styles.th}>Status</th>
                                            <th className={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subOrgs.map(s => (
                                            <SubOrgRow
                                                key={s.id}
                                                subOrg={s}
                                                onToggle={handleToggle}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SubOrgList;
