import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    Building2, FileText, Globe, Save, Navigation, RefreshCw,
    AlertTriangle, ShieldAlert, CheckCircle2, Lock, Image as ImageIcon,
    Plus, Trash2, User, Crown, Edit2, X
} from 'lucide-react';
import adminApi from '@/services/axios/adminApi';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import TextInput from '@/components/ui/Input/TextInput';
import styles from './OrgProfile.module.css';

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const SCHOOL_TYPES = [
    { value: 'pre_primary', label: 'Pre-Primary' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'higher_sec', label: 'Higher Secondary' },
    { value: 'university', label: 'University' },
    { value: 'vocational', label: 'Vocational / Technical' },
    { value: 'other', label: 'Other' },
];

const ACCREDITATION_STATUSES = [
    { value: 'accredited', label: 'Fully Accredited' },
    { value: 'provisionally_accredited', label: 'Provisionally Accredited' },
    { value: 'not_applicable', label: 'Not Accredited' },
    { value: 'pending', label: 'Pending' },
    { value: 'expired', label: 'Expired' },
];

// Empty owner form template — matches OrgOwner model fields exactly
const EMPTY_OWNER_FORM = {
    full_legal_name: '',
    is_primary: false,
    pan_number: '',
    pan_document: null,
    national_id_number: '',
    national_id_document: null,
    driving_license_number: '',
    driving_license_document: null,
    passport_number: '',
    passport_document: null,
    ownership_document: null,
};

/**
 * Shallow dirty check — returns true if current differs from original.
 * File objects always count as dirty.
 */
const isDirtyCheck = (original, current) => {
    if (!original || !current) return false;
    for (const key in current) {
        if (current[key] instanceof File) return true;
        if (current[key] !== original[key] && (current[key] || original[key])) return true;
    }
    return false;
};

// ── REUSABLE UI COMPONENTS ───────────────────────────────────────────────────

const Toggle = ({ id, label, checked, onChange, disabled }) => (
    <label htmlFor={id} className={styles.toggleWrapper}>
        <input
            id={id}
            type="checkbox"
            className={styles.toggleInput}
            checked={!!checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
        />
        <span className={styles.toggleLabel}>{label}</span>
    </label>
);

const FileUpload = ({ label, currentFileUrl, onChange, accept = "image/*,.pdf" }) => (
    <div className={styles.inputGroup}>
        <span className={styles.label}>{label}</span>
        <div className={styles.fileUploadWrapper}>
            <div className={styles.fileInfo}>
                {currentFileUrl && typeof currentFileUrl === 'string' ? (
                    currentFileUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <img src={currentFileUrl} className={styles.filePreviewImg} alt="preview" />
                    ) : (
                        <FileText className={styles.fileIcon} size={20} />
                    )
                ) : (
                    <ImageIcon className={styles.fileIcon} size={20} />
                )}
                <span className={styles.fileName}>
                    {currentFileUrl instanceof File
                        ? currentFileUrl.name
                        : currentFileUrl
                            ? 'Existing File Uploaded'
                            : 'No file selected'}
                </span>
            </div>
            <div className={styles.fileAction}>
                <Button variant="secondary" size="sm" as="span">Replace</Button>
                <input
                    type="file"
                    accept={accept}
                    onChange={(e) => { if (e.target.files[0]) onChange(e.target.files[0]); }}
                    className={styles.hiddenFileInput}
                />
            </div>
        </div>
    </div>
);

// ── OWNER FORM — used for both create and edit ────────────────────────────────

function OwnerForm({ initial = EMPTY_OWNER_FORM, onSave, onCancel, saving }) {
    const [form, setForm] = useState({ ...initial });
    const [error, setError] = useState(null);

    function update(key, value) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        if (!form.full_legal_name.trim()) {
            setError('Full legal name is required.');
            return;
        }
        await onSave(form, setError);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.ownerForm}>
            <div className={styles.formGrid}>
                {/* Full legal name — required */}
                <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                    <label className={styles.label}>Full Legal Name *</label>
                    <input
                        className={styles.input}
                        value={form.full_legal_name}
                        onChange={e => update('full_legal_name', e.target.value)}
                        placeholder="Exactly as on official documents"
                        required
                    />
                </div>

                {/* Primary toggle */}
                <div className={styles.inputGroup}>
                    <span className={styles.label}>Primary Owner</span>
                    <Toggle
                        id="owner-primary"
                        label={form.is_primary ? 'Yes — primary legal owner' : 'No — additional owner'}
                        checked={form.is_primary}
                        onChange={val => update('is_primary', val)}
                    />
                </div>

                {/* PAN */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>PAN Number</label>
                    <input
                        className={styles.input}
                        value={form.pan_number}
                        onChange={e => update('pan_number', e.target.value)}
                        placeholder="PAN card number"
                    />
                </div>
                <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                    <FileUpload
                        label="PAN Card Document"
                        accept=".pdf,image/*"
                        currentFileUrl={form.pan_document}
                        onChange={file => update('pan_document', file)}
                    />
                </div>

                {/* National ID */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>National ID Number</label>
                    <input
                        className={styles.input}
                        value={form.national_id_number}
                        onChange={e => update('national_id_number', e.target.value)}
                        placeholder="National ID number"
                    />
                </div>
                <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                    <FileUpload
                        label="National ID Document"
                        accept=".pdf,image/*"
                        currentFileUrl={form.national_id_document}
                        onChange={file => update('national_id_document', file)}
                    />
                </div>

                {/* Driving License — optional */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Driving License Number <span className={styles.optionalTag}>(optional)</span></label>
                    <input
                        className={styles.input}
                        value={form.driving_license_number}
                        onChange={e => update('driving_license_number', e.target.value)}
                        placeholder="License number if available"
                    />
                </div>
                <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                    <FileUpload
                        label="Driving License Document (optional)"
                        accept=".pdf,image/*"
                        currentFileUrl={form.driving_license_document}
                        onChange={file => update('driving_license_document', file)}
                    />
                </div>

                {/* Passport — optional */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Passport Number <span className={styles.optionalTag}>(optional)</span></label>
                    <input
                        className={styles.input}
                        value={form.passport_number}
                        onChange={e => update('passport_number', e.target.value)}
                        placeholder="Passport number if available"
                    />
                </div>
                <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                    <FileUpload
                        label="Passport Document (optional)"
                        accept=".pdf,image/*"
                        currentFileUrl={form.passport_document}
                        onChange={file => update('passport_document', file)}
                    />
                </div>

                {/* Ownership document */}
                <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                    <FileUpload
                        label="Ownership Document (deed / board resolution / certificate)"
                        accept=".pdf,image/*"
                        currentFileUrl={form.ownership_document}
                        onChange={file => update('ownership_document', file)}
                    />
                </div>
            </div>

            {error && (
                <div className={styles.inlineError}>
                    <AlertTriangle size={16} /> {error}
                </div>
            )}

            <div className={styles.ownerFormActions}>
                <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
                    <X size={14} /> Cancel
                </Button>
                <Button type="submit" variant="primary" loading={saving}>
                    <Save size={14} /> Save Owner
                </Button>
            </div>
        </form>
    );
}

// ── OWNERS CARD ───────────────────────────────────────────────────────────────

function OwnersCard() {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);       // create form visible
    const [editingOwner, setEditingOwner] = useState(null); // owner object being edited
    const [deletingId, setDeletingId] = useState(null);    // id currently being deleted
    const { addToast } = useToast();

    // Fetch all owners for this org from the owners endpoint
    const fetchOwners = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await adminApi.get('/org/sys/owners/');
            setOwners(data);
        } catch (err) {
            addToast({ type: 'error', message: 'Failed to load owners.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOwners(); }, [fetchOwners]);

    // Build multipart FormData from owner form state
    function buildPayload(form) {
        const payload = new FormData();
        const textFields = [
            'full_legal_name', 'is_primary',
            'pan_number', 'national_id_number',
            'driving_license_number', 'passport_number',
        ];
        textFields.forEach(key => {
            // Convert boolean to string for FormData
            if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
                payload.append(key, String(form[key]));
            }
        });
        const fileFields = [
            'pan_document', 'national_id_document',
            'driving_license_document', 'passport_document',
            'ownership_document',
        ];
        fileFields.forEach(key => {
            // Only append if user selected a new file — never send the old URL string
            if (form[key] instanceof File) {
                payload.append(key, form[key]);
            }
        });
        return payload;
    }

    async function handleCreate(form, setError) {
        setSaving(true);
        try {
            await adminApi.post('/org/sys/owners/', buildPayload(form), {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            addToast({ type: 'success', message: 'Owner added successfully.' });
            setShowForm(false);
            fetchOwners();
        } catch (err) {
            const msg = err.response?.data?.detail
                || err.response?.data?.is_primary?.[0]
                || err.response?.data?.full_legal_name?.[0]
                || 'Failed to add owner.';
            setError(msg);
        } finally {
            setSaving(false);
        }
    }

    async function handleEdit(form, setError) {
        setSaving(true);
        try {
            await adminApi.patch(`/org/sys/owners/${editingOwner.id}/`, buildPayload(form), {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            addToast({ type: 'success', message: 'Owner updated successfully.' });
            setEditingOwner(null);
            fetchOwners();
        } catch (err) {
            const msg = err.response?.data?.detail
                || err.response?.data?.is_primary?.[0]
                || 'Failed to update owner.';
            setError(msg);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(owner) {
        if (owner.is_primary) {
            addToast({ type: 'error', message: 'Cannot delete the primary owner. Assign another owner as primary first.' });
            return;
        }
        if (!window.confirm(`Delete owner "${owner.full_legal_name}"? This cannot be undone.`)) return;
        setDeletingId(owner.id);
        try {
            await adminApi.delete(`/org/sys/owners/${owner.id}/`);
            addToast({ type: 'success', message: 'Owner deleted.' });
            fetchOwners();
        } catch (err) {
            addToast({ type: 'error', message: err.response?.data?.detail || 'Failed to delete owner.' });
        } finally {
            setDeletingId(null);
        }
    }

    // Fetch full detail (includes sensitive ID numbers) when editing
    async function openEdit(owner) {
        try {
            const { data } = await adminApi.get(`/org/sys/owners/${owner.id}/`);
            setEditingOwner(data);
            setShowForm(false); // close create form if open
        } catch {
            addToast({ type: 'error', message: 'Failed to load owner details.' });
        }
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitleGroup}>
                    <div className={`${styles.cardIcon} ${styles.iconGold}`}><User size={18} /></div>
                    <div>
                        <div className={styles.cardTitle}>Organization Owners</div>
                        <div className={styles.cardSubtitle}>
                            Legal owners and principals — for compliance purposes only
                        </div>
                    </div>
                </div>
                <div className={styles.cardActions}>
                    {/* Only show Add button when no form is open */}
                    {!showForm && !editingOwner && (
                        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
                            <Plus size={14} /> Add Owner
                        </Button>
                    )}
                </div>
            </div>

            {/* Create form — shown inline above the list */}
            {showForm && (
                <div className={styles.ownerFormContainer}>
                    <div className={styles.ownerFormHeader}>
                        <span className={styles.ownerFormTitle}>New Owner</span>
                    </div>
                    <OwnerForm
                        initial={EMPTY_OWNER_FORM}
                        onSave={handleCreate}
                        onCancel={() => setShowForm(false)}
                        saving={saving}
                    />
                </div>
            )}

            {/* Owners list */}
            <div className={styles.ownersList}>
                {loading && (
                    <div className={styles.stateContainer}>
                        <Spinner size="sm" />
                        <span>Loading owners...</span>
                    </div>
                )}

                {!loading && owners.length === 0 && !showForm && (
                    <div className={styles.stateContainer} style={{ padding: 'var(--space-6)' }}>
                        <User size={32} style={{ color: 'var(--color-text-muted)' }} />
                        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                            No owners added yet. Add the primary legal owner to get started.
                        </p>
                    </div>
                )}

                {!loading && owners.map(owner => (
                    <div key={owner.id}>
                        {/* Owner row */}
                        {editingOwner?.id !== owner.id && (
                            <div className={`${styles.ownerRow} ${owner.is_primary ? styles.ownerRowPrimary : ''}`}>
                                <div className={styles.ownerRowInfo}>
                                    <div className={styles.ownerName}>
                                        {owner.is_primary && (
                                            <Crown size={14} className={styles.primaryIcon} />
                                        )}
                                        {owner.full_legal_name}
                                        {owner.is_primary && (
                                            <span className={`${styles.badge} ${styles.badgeTeal}`}>Primary</span>
                                        )}
                                    </div>
                                    {owner.user_email && (
                                        <div className={styles.ownerMeta}>Platform user: {owner.user_email}</div>
                                    )}
                                </div>
                                <div className={styles.ownerRowActions}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEdit(owner)}
                                    >
                                        <Edit2 size={14} /> Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(owner)}
                                        disabled={deletingId === owner.id || owner.is_primary}
                                        loading={deletingId === owner.id}
                                        style={{ color: owner.is_primary ? 'var(--color-text-muted)' : 'var(--color-danger)' }}
                                    >
                                        <Trash2 size={14} /> Delete
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Edit form — inline below the row being edited */}
                        {editingOwner?.id === owner.id && (
                            <div className={styles.ownerFormContainer}>
                                <div className={styles.ownerFormHeader}>
                                    <span className={styles.ownerFormTitle}>
                                        Editing: {editingOwner.full_legal_name}
                                    </span>
                                </div>
                                <OwnerForm
                                    initial={editingOwner}
                                    onSave={handleEdit}
                                    onCancel={() => setEditingOwner(null)}
                                    saving={saving}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── 2. ORGANIZATION PROFILE CARD — unchanged from original ───────────────────

function OrganizationProfileCard({ profile }) {
    const [formData, setFormData] = useState({ ...profile });
    const [activeTab, setActiveTab] = useState('core');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    const isDirty = isDirtyCheck(profile, formData);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] instanceof File || formData[key] !== profile[key]) {
                    payload.append(key, formData[key] === null ? '' : formData[key]);
                }
            });
            const { data } = await adminApi.patch('/org/profile/me/', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Object.assign(profile, data);
            addToast({ message: 'Profile updated successfully.', type: 'success' });
            setFormData({ ...data });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.progressBarOuter}>
                <div className={styles.progressBarInner} style={{ width: `${profile?.completion_score || 0}%` }} />
            </div>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitleGroup}>
                    <div className={`${styles.cardIcon} ${styles.iconPurple}`}><Building2 size={18} /></div>
                    <div>
                        <div className={styles.cardTitle}>Organization Profile</div>
                        <div className={styles.cardSubtitle}>Public-facing details for portals and communications</div>
                    </div>
                </div>
                <div className={styles.cardActions}>
                    {isDirty && <span className={styles.dirtyDot}>Unsaved changes</span>}
                    <Button variant="primary" size="sm" onClick={handleSave} disabled={!isDirty || saving} loading={saving}>
                        <Save size={14} /> Save Profile
                    </Button>
                </div>
            </div>

            <div className={styles.tabsContainer}>
                <div className={styles.tabsList}>
                    {['core', 'branding', 'address', 'contact', 'social'].map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'core' && (
                        <div className={styles.formGrid}>
                            <TextInput id="pro-name" label="Organization Name" value={formData.name || ''} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                            <TextInput id="pro-short" label="Short Name" value={formData.short_name || ''} onChange={e => setFormData(p => ({ ...p, short_name: e.target.value }))} />
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>School Type</label>
                                <select className={styles.select} value={formData.school_type || ''} onChange={e => setFormData(p => ({ ...p, school_type: e.target.value }))}>
                                    <option value="">Select Type...</option>
                                    {SCHOOL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                            <TextInput id="pro-est" label="Established Year" type="number" value={formData.established_year || ''} onChange={e => setFormData(p => ({ ...p, established_year: e.target.value }))} />
                            <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                                <label className={styles.label}>Tagline</label>
                                <input className={styles.input} value={formData.tagline || ''} onChange={e => setFormData(p => ({ ...p, tagline: e.target.value }))} placeholder="Inspiring motto..." />
                            </div>
                            <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                                <label className={styles.label}>Description</label>
                                <textarea className={styles.textarea} value={formData.description || ''} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Detailed description of the organization..." />
                            </div>
                        </div>
                    )}
                    {activeTab === 'branding' && (
                        <div className={styles.formGrid}>
                            <FileUpload label="Logo" accept="image/*" currentFileUrl={formData.logo} onChange={file => setFormData(p => ({ ...p, logo: file }))} />
                            <FileUpload label="Favicon" accept="image/*" currentFileUrl={formData.favicon} onChange={file => setFormData(p => ({ ...p, favicon: file }))} />
                            <FileUpload label="Cover Image" accept="image/*" currentFileUrl={formData.cover_image} onChange={file => setFormData(p => ({ ...p, cover_image: file }))} />

                            {/* Primary color */}
                            <div className={styles.inputGroup}>
                                <span className={styles.label}>Primary Brand Color</span>
                                <div className={styles.colorPickerGroup}>
                                    <input type="color" className={styles.colorInput}
                                        value={formData.primary_color || '#000000'}
                                        onChange={e => setFormData(p => ({ ...p, primary_color: e.target.value }))} />
                                    <input type="text" className={`${styles.input} ${styles.colorTextInput}`}
                                        placeholder="#RRGGBB"
                                        value={formData.primary_color || ''}
                                        onChange={e => setFormData(p => ({ ...p, primary_color: e.target.value }))} />
                                </div>
                            </div>

                            {/* Secondary color — new */}
                            <div className={styles.inputGroup}>
                                <span className={styles.label}>Secondary Brand Color</span>
                                <div className={styles.colorPickerGroup}>
                                    <input type="color" className={styles.colorInput}
                                        value={formData.secondary_color || '#000000'}
                                        onChange={e => setFormData(p => ({ ...p, secondary_color: e.target.value }))} />
                                    <input type="text" className={`${styles.input} ${styles.colorTextInput}`}
                                        placeholder="#RRGGBB"
                                        value={formData.secondary_color || ''}
                                        onChange={e => setFormData(p => ({ ...p, secondary_color: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'address' && (
                        <div className={styles.formGrid}>
                            <TextInput id="addr-1" label="Address Line 1" value={formData.address_line_1 || ''} onChange={e => setFormData(p => ({ ...p, address_line_1: e.target.value }))} />
                            <TextInput id="addr-2" label="Address Line 2" value={formData.address_line_2 || ''} onChange={e => setFormData(p => ({ ...p, address_line_2: e.target.value }))} />
                            <TextInput id="addr-city" label="City" value={formData.city || ''} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} />
                            <TextInput id="addr-state" label="State / Province" value={formData.state_province || ''} onChange={e => setFormData(p => ({ ...p, state_province: e.target.value }))} />
                            <TextInput id="addr-post" label="Postal Code" value={formData.postal_code || ''} onChange={e => setFormData(p => ({ ...p, postal_code: e.target.value }))} />
                            <TextInput id="addr-country" label="Country" value={formData.country || ''} onChange={e => setFormData(p => ({ ...p, country: e.target.value }))} />
                        </div>
                    )}
                    {activeTab === 'contact' && (
                        <div className={styles.formGrid}>
                            <TextInput id="phone-1" label="Primary Phone" type="tel" value={formData.phone_primary || ''} onChange={e => setFormData(p => ({ ...p, phone_primary: e.target.value }))} />
                            <TextInput id="phone-2" label="Secondary Phone" type="tel" value={formData.phone_secondary || ''} onChange={e => setFormData(p => ({ ...p, phone_secondary: e.target.value }))} />
                            <TextInput id="email-1" label="Primary Email" type="email" value={formData.email_primary || ''} onChange={e => setFormData(p => ({ ...p, email_primary: e.target.value }))} />
                            <TextInput id="email-adm" label="Admissions Email" type="email" value={formData.email_admissions || ''} onChange={e => setFormData(p => ({ ...p, email_admissions: e.target.value }))} />
                            <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                                <TextInput id="website" label="Website URL" type="url" value={formData.website || ''} onChange={e => setFormData(p => ({ ...p, website: e.target.value }))} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'social' && (
                        <div className={styles.formGrid}>
                            <TextInput id="soc-fb" label="Facebook URL" value={formData.facebook_url || ''} onChange={e => setFormData(p => ({ ...p, facebook_url: e.target.value }))} />
                            <TextInput id="soc-tw" label="Twitter URL" value={formData.twitter_url || ''} onChange={e => setFormData(p => ({ ...p, twitter_url: e.target.value }))} />
                            <TextInput id="soc-ig" label="Instagram URL" value={formData.instagram_url || ''} onChange={e => setFormData(p => ({ ...p, instagram_url: e.target.value }))} />
                            <TextInput id="soc-in" label="LinkedIn URL" value={formData.linkedin_url || ''} onChange={e => setFormData(p => ({ ...p, linkedin_url: e.target.value }))} />
                            <TextInput id="soc-yt" label="YouTube URL" value={formData.youtube_url || ''} onChange={e => setFormData(p => ({ ...p, youtube_url: e.target.value }))} />
                        </div>
                    )}
                    {error && <div className={styles.inlineError}><AlertTriangle size={16} /> {error}</div>}
                </div>
            </div>
        </div>
    );
}

// ── 3. ORGANIZATION LEGAL CARD — owner tab removed, rest unchanged ────────────

function OrganizationLegalCard({ legal }) {
    const [formData, setFormData] = useState({ ...(legal || {}) });
    // Owner tab removed — owners now have their own card
    const [activeTab, setActiveTab] = useState('registration');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    const currentData = legal || {};
    const isDirty = isDirtyCheck(currentData, formData);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] instanceof File || formData[key] !== currentData[key]) {
                    payload.append(key, formData[key] === null ? '' : formData[key]);
                }
            });
            const { data } = await adminApi.patch('/org/legal/me/', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (legal) Object.assign(legal, data);
            addToast({ message: 'Legal data updated successfully.', type: 'success' });
            setFormData({ ...data });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update legal data.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.card}>
            <div className={`${styles.progressBarOuter} ${styles.legalProgressBar}`}>
                <div className={styles.progressBarInner} style={{ width: `${currentData.legal_completion_percent || 0}%` }} />
            </div>
            {currentData.is_registration_expired && (
                <div className={styles.dangerBanner}>
                    <ShieldAlert size={16} /> Registration has expired! Please update registration documents.
                </div>
            )}
            {currentData.is_accreditation_expired && (
                <div className={styles.warningBanner}>
                    <AlertTriangle size={16} /> Accreditation has expired. Please verify records.
                </div>
            )}
            <div className={styles.cardHeader}>
                <div className={styles.cardTitleGroup}>
                    <div className={`${styles.cardIcon} ${styles.iconNavy}`}><Lock size={18} /></div>
                    <div>
                        <div className={styles.cardTitle}>Organization Legal</div>
                        <div className={styles.cardSubtitle}>Private, sensitive compliance and regulatory data</div>
                    </div>
                </div>
                <div className={styles.cardActions}>
                    {isDirty && <span className={styles.dirtyDot}>Unsaved changes</span>}
                    <Button variant="primary" size="sm" onClick={handleSave} disabled={!isDirty || saving} loading={saving}>
                        <Save size={14} /> Save Legal Config
                    </Button>
                </div>
            </div>

            <div className={styles.tabsContainer}>
                <div className={styles.tabsList}>
                    {/* owner tab removed — now a separate card */}
                    {['registration', 'tax', 'accreditation', 'notes'].map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'registration' && (
                        <div className={styles.formGrid}>
                            <TextInput id="reg-num" label="Registration Number" value={formData.registration_number || ''} onChange={e => setFormData(p => ({ ...p, registration_number: e.target.value }))} />
                            <TextInput id="reg-date" label="Registration Date" type="date" value={formData.registration_date || ''} onChange={e => setFormData(p => ({ ...p, registration_date: e.target.value }))} />
                            <TextInput id="reg-with" label="Registered With" placeholder="e.g. Ministry of Education" value={formData.registered_with || ''} onChange={e => setFormData(p => ({ ...p, registered_with: e.target.value }))} />
                            <TextInput id="reg-exp" label="Registration Expiry" type="date" value={formData.registration_expiry || ''} onChange={e => setFormData(p => ({ ...p, registration_expiry: e.target.value }))} />
                            <div className={styles.formGridFull}>
                                <FileUpload label="Registration Document" accept=".pdf,image/*" currentFileUrl={formData.registration_document} onChange={file => setFormData(p => ({ ...p, registration_document: file }))} />
                                <div className={styles.helpText}>Secure document vault (PDF/Image). Visible only to platform compliance.</div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'tax' && (
                        <div className={styles.formGrid}>
                            <TextInput id="tax-id" label="Tax ID Number" value={formData.tax_id_number || ''} onChange={e => setFormData(p => ({ ...p, tax_id_number: e.target.value }))} />
                            <div className={styles.inputGroup}>
                                <span className={styles.label}>VAT Registration</span>
                                <Toggle id="vat-reg" label={formData.vat_registered ? 'Registered for VAT' : 'Not Registered'} checked={formData.vat_registered} onChange={val => setFormData(p => ({ ...p, vat_registered: val }))} />
                            </div>
                            {formData.vat_registered && (
                                <TextInput id="vat-num" label="VAT Number" value={formData.vat_number || ''} onChange={e => setFormData(p => ({ ...p, vat_number: e.target.value }))} />
                            )}
                        </div>
                    )}
                    {activeTab === 'accreditation' && (
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Accreditation Status</label>
                                <select className={styles.select} value={formData.accreditation_status || ''} onChange={e => setFormData(p => ({ ...p, accreditation_status: e.target.value }))}>
                                    <option value="">Select Status...</option>
                                    {ACCREDITATION_STATUSES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                            <TextInput id="acc-body" label="Accreditation Body" value={formData.accreditation_body || ''} onChange={e => setFormData(p => ({ ...p, accreditation_body: e.target.value }))} />
                            <TextInput id="acc-num" label="Accreditation Number" value={formData.accreditation_number || ''} onChange={e => setFormData(p => ({ ...p, accreditation_number: e.target.value }))} />
                            <TextInput id="acc-from" label="Valid From" type="date" value={formData.accreditation_valid_from || ''} onChange={e => setFormData(p => ({ ...p, accreditation_valid_from: e.target.value }))} />
                            <TextInput id="acc-to" label="Valid Until" type="date" value={formData.accreditation_valid_until || ''} onChange={e => setFormData(p => ({ ...p, accreditation_valid_until: e.target.value }))} />
                            <div className={styles.formGridFull}>
                                <FileUpload label="Accreditation Certificate" accept=".pdf,image/*" currentFileUrl={formData.accreditation_document} onChange={file => setFormData(p => ({ ...p, accreditation_document: file }))} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'notes' && (
                        <div className={`${styles.formGrid} ${styles.formGridFull}`}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Internal Legal Notes</label>
                                <textarea className={styles.textarea} value={formData.internal_notes || ''} onChange={e => setFormData(p => ({ ...p, internal_notes: e.target.value }))} placeholder="Private notes regarding jurisdiction, disputes, etc." />
                                <div className={styles.helpText}>Only visible to organization administrators and platform moderators.</div>
                            </div>
                        </div>
                    )}
                    {error && <div className={styles.inlineError}><AlertTriangle size={16} /> {error}</div>}
                </div>
            </div>
        </div>
    );
}

// ── 4. DOMAINS CARD — unchanged from original ─────────────────────────────────

function DomainsCard({ domains: initialDomains, onRefresh }) {
    const [domains, setDomains] = useState(initialDomains || []);
    const [newDomain, setNewDomain] = useState('');
    const [newNotes, setNewNotes] = useState('');
    const [newIsPrimary, setNewIsPrimary] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { addToast } = useToast();
    const [editNotesId, setEditNotesId] = useState(null);
    const [editNotesVal, setEditNotesVal] = useState('');

    const handleAddDomain = async (e) => {
        e.preventDefault();
        if (!newDomain) return;
        setSaving(true);
        setError(null);
        try {
            await adminApi.post('/org/domains/', { domain: newDomain, is_primary: newIsPrimary, notes: newNotes });
            addToast({ message: 'Domain added successfully.', type: 'success' });
            setNewDomain(''); setNewNotes(''); setNewIsPrimary(false);
            if (onRefresh) await onRefresh();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add domain.');
        } finally {
            setSaving(false);
        }
    };

    const handlePatchDomain = async (id, payload) => {
        setError(null);
        try {
            await adminApi.patch(`/org/domains/${id}/`, payload);
            addToast({ message: 'Domain updated.', type: 'success' });
            setEditNotesId(null);
            if (onRefresh) onRefresh();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update domain.');
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.warningBanner}>
                <Globe size={16} /> Domain verification is managed by the platform super admin.
            </div>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitleGroup}>
                    <div className={`${styles.cardIcon} ${styles.iconTeal}`}><Globe size={18} /></div>
                    <div>
                        <div className={styles.cardTitle}>Registered Domains</div>
                        <div className={styles.cardSubtitle}>Web addresses mapped to this organization tenant</div>
                    </div>
                </div>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Domain</th><th>Status / Primary</th><th>Verification</th><th>Notes</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {domains.map(d => (
                            <tr key={d.id || d.domain} className={d.is_primary ? styles.primaryRow : styles.tableRow}>
                                <td><strong>{d.domain}</strong></td>
                                <td>{d.is_primary && <span className={`${styles.badge} ${styles.badgeTeal}`}>Primary</span>}</td>
                                <td>
                                    {d.is_verified ? (
                                        <div>
                                            <span className={`${styles.badge} ${styles.badgeGreen}`}>Verified</span>
                                            <div className={styles.helpText}>{new Date(d.verified_at).toLocaleDateString()}</div>
                                        </div>
                                    ) : (
                                        <span className={`${styles.badge} ${styles.badgeGray}`}>Unverified</span>
                                    )}
                                </td>
                                <td>
                                    {editNotesId === d.id
                                        ? <input className={styles.input} value={editNotesVal} onChange={e => setEditNotesVal(e.target.value)} />
                                        : <span>{d.notes || <span className={styles.helpText}>No notes</span>}</span>}
                                </td>
                                <td>
                                    {editNotesId === d.id ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Button size="sm" onClick={() => handlePatchDomain(d.id, { notes: editNotesVal })}>Save</Button>
                                            <Button variant="ghost" size="sm" onClick={() => setEditNotesId(null)}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <Button variant="ghost" size="sm" onClick={() => { setEditNotesId(d.id); setEditNotesVal(d.notes || ''); }}>Edit Notes</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <form className={styles.addDomainForm} onSubmit={handleAddDomain}>
                <TextInput id="new-domain" label="Add New Domain" placeholder="e.g. students.school.edu" value={newDomain} onChange={e => setNewDomain(e.target.value)} />
                <div className={styles.toggleGroup}>
                    <Toggle id="new-prim" label="Set Primary" checked={newIsPrimary} onChange={setNewIsPrimary} />
                </div>
                <TextInput id="new-notes" label="Notes" placeholder="Optional details" value={newNotes} onChange={e => setNewNotes(e.target.value)} />
                <Button type="submit" variant="primary" disabled={!newDomain || saving}><Plus size={16} /> Add</Button>
            </form>
            {error && <div style={{ padding: '0 var(--space-4) var(--space-4)' }}><div className={styles.inlineError}><AlertTriangle size={16} /> {error}</div></div>}
        </div>
    );
}

// ── MAIN PAGE — card order: Profile → Legal → Owners → Domains ───────────────

export default function OrgProfile() {
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [legalData, setLegalData] = useState(null);
    const [domainsData, setDomainsData] = useState([]);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setPageError(null);
        try {
            const pProfile = adminApi.get('/org/profile/me/').catch(e => { throw e; });
            const pLegal = adminApi.get('/org/legal/me/').catch(() => ({ data: {} }));
            const pDomains = adminApi.get('/org/domains/').catch(() => ({ data: [] }));
            const [resProfile, resLegal, resDomains] = await Promise.all([pProfile, pLegal, pDomains]);
            setProfileData(resProfile.data);
            setLegalData(resLegal.data);
            setDomainsData(resDomains.data);
        } catch (err) {
            setPageError(err.response?.data?.detail || 'Failed to load organization data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAllData(); }, [fetchAllData]);

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Organization Profile</h1>
                    <p className={styles.pageSubtitle}>
                        View and manage your core tenant record, public branding, and legal compliance.
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="secondary" onClick={fetchAllData} disabled={loading}>
                        <RefreshCw size={15} /> Refresh Data
                    </Button>
                </div>
            </div>

            {loading && (
                <div className={styles.stateContainer}>
                    <Spinner size="lg" />
                    <div>Loading dashboard data...</div>
                </div>
            )}

            {!loading && pageError && (
                <div className={styles.stateContainer}>
                    <AlertTriangle size={32} style={{ color: 'var(--color-danger)' }} />
                    <h3 style={{ color: 'var(--color-text-primary)' }}>Initialization Failed</h3>
                    <div>{pageError}</div>
                    <Button onClick={fetchAllData} variant="primary">Retry Fetch</Button>
                </div>
            )}

            {!loading && !pageError && profileData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <OrganizationProfileCard profile={profileData} />
                    <OrganizationLegalCard legal={legalData} />
                    {/* OwnersCard fetches its own data independently via /org/sys/owners/ */}
                    <OwnersCard />
                    <DomainsCard domains={domainsData} onRefresh={fetchAllData} />
                </div>
            )}
        </div>
    );
}