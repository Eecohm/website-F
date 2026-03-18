import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Building2, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import adminApi from '@/services/axios/adminApi';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import styles from './SubOrgs.module.css';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const SUB_TYPES = [
    { value: 'department', label: 'Department' },
    { value: 'campus', label: 'Campus' },
    { value: 'branch', label: 'Branch' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'other', label: 'Other' },
];

const INITIAL_FORM = {
    name: '',
    code: '',
    sub_type: 'department',
    description: '',
    is_active: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Convert a string to a URL-safe slug. */
function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const SubOrgForm = () => {
    const navigate = useNavigate();
    const { code } = useParams();
    const isEditMode = Boolean(code);

    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(isEditMode);   // fetch on edit
    const [saving, setSaving] = useState(false);
    const [fetchErr, setFetchErr] = useState(null);
    const [saveErr, setSaveErr] = useState(null);
    const [saved, setSaved] = useState(false);

    // ── Fetch existing record on edit ──────────────────────────────────────
    useEffect(() => {
        if (!isEditMode) return;

        (async () => {
            setLoading(true);
            setFetchErr(null);
            try {
                const { data } = await adminApi.get(`/org/sub-orgs/${code}/`);
                setForm({
                    name: data.name ?? '',
                    code: data.code ?? '',
                    sub_type: data.sub_type ?? 'department',
                    description: data.description ?? '',
                    is_active: data.is_active,
                });
            } catch (err) {
                setFetchErr(err.response?.data?.detail ?? 'Failed to load sub-organization.');
            } finally {
                setLoading(false);
            }
        })();
    }, [code, isEditMode]);

    // ── Field change handler ───────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newVal = type === 'checkbox' ? checked : value;

        setForm(prev => {
            const next = { ...prev, [name]: newVal };
            // Auto-slugify code from name (only in create mode, and only while user hasn't manually edited it)
            if (name === 'name' && !isEditMode) {
                next.code = slugify(value);
            }
            return next;
        });

        // Clear field error on change
        setErrors(prev => ({ ...prev, [name]: undefined }));
        setSaveErr(null);
        setSaved(false);
    };

    // ── Validation ─────────────────────────────────────────────────────────
    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required.';
        if (!form.code.trim()) errs.code = 'Code is required.';
        if (!/^[a-z0-9-]+$/.test(form.code)) errs.code = 'Code must be lowercase letters, digits, and hyphens only.';
        if (!form.sub_type) errs.sub_type = 'Type is required.';
        return errs;
    };

    // ── Submit ──────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setSaving(true);
        setSaveErr(null);
        setSaved(false);

        try {
            if (isEditMode) {
                await adminApi.patch(`/org/sub-orgs/${code}/`, form);
            } else {
                await adminApi.post('/org/sub-orgs/', form);
            }
            setSaved(true);
            // Redirect to list after short delay
            setTimeout(() => navigate('/app/admin/sub-orgs'), 800);
        } catch (err) {
            const data = err.response?.data;
            if (data && typeof data === 'object' && !data.detail) {
                // Field-level errors
                setErrors(data);
            } else {
                setSaveErr(data?.detail ?? 'An error occurred. Please try again.');
            }
        } finally {
            setSaving(false);
        }
    };

    // ── Loading state ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className={styles.formPage}>
                <div className={styles.stateContainer}>
                    <Spinner size="md" />
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
                        Loading…
                    </span>
                </div>
            </div>
        );
    }

    // ── Error fetching data ────────────────────────────────────────────────
    if (fetchErr) {
        return (
            <div className={styles.formPage}>
                <div className={styles.stateContainer}>
                    <div className={styles.stateIcon}><AlertTriangle size={22} color="var(--color-danger)" /></div>
                    <div className={styles.stateTitle}>Not Found</div>
                    <div className={styles.stateText}>{fetchErr}</div>
                    <Button variant="secondary" size="sm" onClick={() => navigate('/app/admin/sub-orgs')}>
                        <ArrowLeft size={14} /> Back to List
                    </Button>
                </div>
            </div>
        );
    }

    // ── Form render ────────────────────────────────────────────────────────
    return (
        <div className={styles.formPage}>
            {/* Back link */}
            <Link to="/app/admin/sub-orgs" className={styles.backLink}>
                <ArrowLeft size={14} />
                Back to Sub-Organizations
            </Link>

            {/* Page heading */}
            <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
                <div>
                    <h1 className={styles.pageTitle}>
                        {isEditMode ? 'Edit Sub-Organization' : 'Add Sub-Organization'}
                    </h1>
                    <p className={styles.pageSubtitle}>
                        {isEditMode
                            ? 'Update the details for this sub-organization.'
                            : 'Create a new department, campus, branch, or faculty.'
                        }
                    </p>
                </div>
            </div>

            {/* Form card */}
            <form onSubmit={handleSubmit}>
                <div className={styles.formCard}>
                    {/* Card header */}
                    <div className={styles.formCardHeader}>
                        <div className={styles.formCardIconWrap}>
                            <Building2 size={17} />
                        </div>
                        <div>
                            <div className={styles.formCardTitle}>
                                {isEditMode ? 'Edit Details' : 'Sub-Organization Details'}
                            </div>
                            <div className={styles.formCardSubtitle}>
                                All fields marked <span style={{ color: 'var(--color-danger)' }}>*</span> are required.
                            </div>
                        </div>
                    </div>

                    {/* Card body */}
                    <div className={styles.formCardBody}>
                        {/* Inline save error */}
                        {saveErr && (
                            <div className={`${styles.inlineAlert} ${styles.inlineAlertError}`}>
                                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                                {saveErr}
                            </div>
                        )}

                        {/* Success flash */}
                        {saved && (
                            <div className={`${styles.inlineAlert} ${styles.inlineAlertSuccess}`}>
                                <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                                {isEditMode ? 'Changes saved!' : 'Sub-organization created! Redirecting…'}
                            </div>
                        )}

                        {/* Name + Code */}
                        <div className={styles.formRow}>
                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Name <span className={styles.required}>*</span>
                                </label>
                                <input
                                    className={`${styles.input}${errors.name ? ' ' + styles.hasError : ''}`}
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Science Department"
                                    disabled={saving}
                                />
                                {errors.name && <div className={styles.fieldError}>{errors.name}</div>}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Code <span className={styles.required}>*</span>
                                </label>
                                <input
                                    className={`${styles.input}${errors.code ? ' ' + styles.hasError : ''}`}
                                    type="text"
                                    name="code"
                                    value={form.code}
                                    onChange={handleChange}
                                    placeholder="e.g. sci-dept"
                                    disabled={saving || isEditMode}  // code is immutable on edit
                                />
                                <div className={styles.hint}>
                                    {isEditMode
                                        ? 'Code cannot be changed after creation.'
                                        : 'Auto-generated from name. Lowercase, hyphens only. Unique per org.'
                                    }
                                </div>
                                {errors.code && <div className={styles.fieldError}>{errors.code}</div>}
                            </div>
                        </div>

                        {/* Type */}
                        <div className={styles.field}>
                            <label className={styles.label}>
                                Type <span className={styles.required}>*</span>
                            </label>
                            <select
                                className={styles.select}
                                name="sub_type"
                                value={form.sub_type}
                                onChange={handleChange}
                                disabled={saving}
                            >
                                {SUB_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                            {errors.sub_type && <div className={styles.fieldError}>{errors.sub_type}</div>}
                        </div>

                        {/* Description */}
                        <div className={styles.field}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Optional — a brief description of this sub-organization."
                                disabled={saving}
                                rows={3}
                            />
                        </div>

                        {/* Active toggle (edit mode only — new orgs default to active) */}
                        {isEditMode && (
                            <div className={styles.toggleRow}>
                                <div className={styles.toggleInfo}>
                                    <div className={styles.toggleLabel}>Active Status</div>
                                    <div className={styles.toggleSub}>
                                        Inactive sub-orgs are hidden from members but not deleted.
                                    </div>
                                </div>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={form.is_active}
                                        onChange={handleChange}
                                        disabled={saving}
                                    />
                                    <span className={styles.toggleSlider} />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Card footer */}
                    <div className={styles.formFooter}>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/app/admin/sub-orgs')}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={saving}
                        >
                            {saving
                                ? <Spinner size="xs" />
                                : isEditMode ? 'Save Changes' : 'Create Sub-Organization'
                            }
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SubOrgForm;
