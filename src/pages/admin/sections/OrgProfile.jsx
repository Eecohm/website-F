import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    Building2, FileText, Globe, Save, Navigation, RefreshCw,
    AlertTriangle, ShieldAlert, CheckCircle2, Lock, Image as ImageIcon, Plus
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
    { value: 'fully_accredited', label: 'Fully Accredited' },
    { value: 'provisionally_accredited', label: 'Provisionally Accredited' },
    { value: 'not_accredited', label: 'Not Accredited' },
    { value: 'pending', label: 'Pending' },
];

const ID_TYPES = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID' },
    { value: 'driving_license', label: 'Driving License' },
];

/**
 * Checks if two objects differ (shallow check for strings/booleans).
 * For files, it checks if it's a File object instead of a string (URL).
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

const FileUpload = ({ label, currentFileUrl, onChange, accept = "image/*,.pdf" }) => {
    return (
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
                        {currentFileUrl instanceof File ? currentFileUrl.name : (currentFileUrl ? "Existing File Uploaded" : "No file selected")}
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
}

// ── 1. ORGANIZATION CARD ─────────────────────────────────────────────────────

function OrganizationCard({ org }) {
    const [formData, setFormData] = useState({ is_active: org?.is_active, deactivation_reason: org?.deactivation_reason || '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    const isDirty = formData.is_active !== org?.is_active || formData.deactivation_reason !== (org?.deactivation_reason || '');

    const handleSave = async () => {
        if (formData.is_active === false && org.is_active === true) {
            if (!window.confirm("Deactivating this org will block all user logins. Confirm?")) return;
        }
        setSaving(true);
        setError(null);
        try {
            await adminApi.patch('/org/me/', formData); // Assumed endpoint
            addToast({ message: "Organization status updated.", type: "success" });
            // Ideally we'd bubble the update up, but we just reset dirty state loosely for now
            org.is_active = formData.is_active;
            org.deactivation_reason = formData.deactivation_reason;
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update organization.");
        } finally {
            setSaving(false);
        }
    };

    if (!org) return null;

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitleGroup}>
                    <div className={`${styles.cardIcon} ${styles.iconRed}`}><ShieldAlert size={18} /></div>
                    <div>
                        <div className={styles.cardTitle}>Tenant Status</div>
                        <div className={styles.cardSubtitle}>Core organization record ({org.slug})</div>
                    </div>
                </div>
                <div className={styles.cardActions}>
                    {isDirty && <span className={styles.dirtyDot}>Unsaved</span>}
                    <Button variant="primary" size="sm" onClick={handleSave} disabled={!isDirty || saving} loading={saving}>
                        <Save size={14} /> Save Status
                    </Button>
                </div>
            </div>
            
            <div className={styles.cardBody} style={{ padding: 'var(--space-4)' }}>
                <div className={styles.formGrid}>
                   <div className={styles.inputGroup}>
                        <span className={styles.label}>Tenant Status</span>
                        <Toggle 
                            id="org-active"
                            label={formData.is_active ? "Active" : "Deactivated"}
                            checked={formData.is_active}
                            onChange={(val) => setFormData(p => ({ ...p, is_active: val }))}
                        />
                   </div>
                   <div className={styles.inputGroup}>
                       <TextInput 
                            id="org-deact-reason"
                            label="Deactivation Reason"
                            value={formData.deactivation_reason}
                            onChange={(e) => setFormData(p => ({ ...p, deactivation_reason: e.target.value }))}
                            placeholder="e.g. Non-payment, Compliance violations"
                            disabled={formData.is_active}
                       />
                       <div className={styles.helpText}>Required if status is deactivated.</div>
                   </div>
                </div>
                {org.deactivated_at && !formData.is_active && (
                    <div className={styles.helpText} style={{marginTop: 'var(--space-2)'}}>
                        Deactivated on: {new Date(org.deactivated_at).toLocaleString()}
                    </div>
                )}
                {error && <div className={styles.inlineError}><AlertTriangle size={16} /> {error}</div>}
            </div>
        </div>
    );
}

// ── 2. ORGANIZATION PROFILE CARD ─────────────────────────────────────────────

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
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Object.assign(profile, data); 
            addToast({ message: "Profile updated successfully.", type: "success" });
            // Re-sync form so objects match exactly avoiding endless dirty
            setFormData({ ...data }); 
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update profile.");
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
                        <button key={tab} className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab(tab)}>
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
                            
                            <div className={styles.inputGroup}>
                                <span className={styles.label}>Primary Brand Color</span>
                                <div className={styles.colorPickerGroup}>
                                    <input type="color" className={styles.colorInput} value={formData.primary_color || '#000000'} onChange={e => setFormData(p => ({ ...p, primary_color: e.target.value }))} />
                                    <input type="text" className={`${styles.input} ${styles.colorTextInput}`} placeholder="#RRGGBB" value={formData.primary_color || ''} onChange={e => setFormData(p => ({ ...p, primary_color: e.target.value }))} />
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

// ── 3. ORGANIZATION LEGAL CARD ───────────────────────────────────────────────

function OrganizationLegalCard({ legal }) {
    const [formData, setFormData] = useState({ ...(legal || {}) });
    const [activeTab, setActiveTab] = useState('owner');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    // Default object if legal model hasn't been created yet on backend
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
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (legal) Object.assign(legal, data);
            addToast({ message: "Legal data updated successfully.", type: "success" });
            setFormData({ ...data }); 
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update legal data. Endpoints may be pending.");
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
                    {['owner', 'registration', 'tax', 'accreditation', 'notes'].map(tab => (
                        <button key={tab} className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'owner' && (
                        <div className={styles.formGrid}>
                            <TextInput id="leg-own-name" label="Owner Full Name" value={formData.owner_full_name || ''} onChange={e => setFormData(p => ({ ...p, owner_full_name: e.target.value }))} />
                            <TextInput id="leg-own-title" label="Owner Title" value={formData.owner_title || ''} onChange={e => setFormData(p => ({ ...p, owner_title: e.target.value }))} />
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Owner ID Type</label>
                                <select className={styles.select} value={formData.owner_id_type || ''} onChange={e => setFormData(p => ({ ...p, owner_id_type: e.target.value }))}>
                                    <option value="">Select ID Type...</option>
                                    {ID_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <TextInput id="leg-own-num" label="Owner ID Number" value={formData.owner_id_number || ''} onChange={e => setFormData(p => ({ ...p, owner_id_number: e.target.value }))} />
                                <div className={styles.helpText}>Encrypted at rest. Do not expose in public UI.</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'registration' && (
                        <div className={styles.formGrid}>
                            <TextInput id="reg-num" label="Registration Number" value={formData.registration_number || ''} onChange={e => setFormData(p => ({ ...p, registration_number: e.target.value }))} />
                            <TextInput id="reg-date" label="Registration Date" type="date" value={formData.registration_date || ''} onChange={e => setFormData(p => ({ ...p, registration_date: e.target.value }))} />
                            <TextInput id="reg-with" label="Registered With" placeholder="e.g. Ministry of Education" value={formData.registered_with || ''} onChange={e => setFormData(p => ({ ...p, registered_with: e.target.value }))} />
                            <TextInput id="reg-exp" label="Registration Expiry" type="date" value={formData.registration_expiry || ''} onChange={e => setFormData(p => ({ ...p, registration_expiry: e.target.value }))} />
                            <div className={`${styles.formGridFull}`}>
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
                                <Toggle id="vat-reg" label={formData.vat_registered ? "Registered for VAT" : "Not Registered"} checked={formData.vat_registered} onChange={val => setFormData(p => ({ ...p, vat_registered: val }))} />
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
                            
                            <div className={`${styles.formGridFull}`}>
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

// ── 4. DOMAINS CARD ──────────────────────────────────────────────────────────

function DomainsCard({ domains: initialDomains, onRefresh }) {
    const [domains, setDomains] = useState(initialDomains || []);
    const [newDomain, setNewDomain] = useState('');
    const [newNotes, setNewNotes] = useState('');
    const [newIsPrimary, setNewIsPrimary] = useState(false);
    
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    // To handle inline edits
    const [editNotesId, setEditNotesId] = useState(null);
    const [editNotesVal, setEditNotesVal] = useState('');

    const handleAddDomain = async (e) => {
        e.preventDefault();
        if (!newDomain) return;
        setSaving(true);
        setError(null);
        try {
            await adminApi.post('/org/domains/', {
                domain: newDomain,
                is_primary: newIsPrimary,
                notes: newNotes
            });
            addToast({ message: "Domain added successfully.", type: "success" });
            setNewDomain(''); setNewNotes(''); setNewIsPrimary(false);
            if (onRefresh) await onRefresh();
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to add domain.");
        } finally {
            setSaving(false);
        }
    };

    const handlePatchDomain = async (id, payload) => {
        setError(null);
        try {
            await adminApi.patch(`/org/domains/${id}/`, payload);
            addToast({ message: "Domain updated.", type: "success" });
            setEditNotesId(null);
            if (onRefresh) onRefresh();
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update domain.");
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
                            <th>Domain</th>
                            <th>Status / Primary</th>
                            <th>Verification</th>
                            <th>Notes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {domains.map(d => (
                            <tr key={d.id || d.domain} className={d.is_primary ? styles.primaryRow : styles.tableRow}>
                                <td><strong>{d.domain}</strong></td>
                                <td>
                                    {d.is_primary && <span className={`${styles.badge} ${styles.badgeTeal}`}>Primary</span>}
                                </td>
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
                                    {editNotesId === d.id ? (
                                        <input className={styles.input} value={editNotesVal} onChange={e => setEditNotesVal(e.target.value)} />
                                    ) : (
                                        <span>{d.notes || <span className={styles.helpText}>No notes</span>}</span>
                                    )}
                                </td>
                                <td>
                                    {editNotesId === d.id ? (
                                        <div style={{display:'flex', gap:'8px'}}>
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
                <TextInput 
                    id="new-domain" 
                    label="Add New Domain" 
                    placeholder="e.g. students.school.edu" 
                    value={newDomain} 
                    onChange={e => setNewDomain(e.target.value)} 
                />
                <div className={styles.toggleGroup}>
                    <Toggle id="new-prim" label="Set Primary" checked={newIsPrimary} onChange={setNewIsPrimary} />
                </div>
                <TextInput 
                    id="new-notes" 
                    label="Notes" 
                    placeholder="Optional details" 
                    value={newNotes} 
                    onChange={e => setNewNotes(e.target.value)} 
                />
                <Button type="submit" variant="primary" disabled={!newDomain || saving}>
                    <Plus size={16} /> Add 
                </Button>
            </form>
            {error && <div style={{padding:'0 var(--space-4) var(--space-4)'}}><div className={styles.inlineError}><AlertTriangle size={16} /> {error}</div></div>}
        </div>
    );
}

// ── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────

export default function OrgProfile() {
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    
    const [orgData, setOrgData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [legalData, setLegalData] = useState(null);
    const [domainsData, setDomainsData] = useState([]);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setPageError(null);
        try {
            // Fetch models in parallel. 
            // If backend throws 404 for domains or legal during early dev, we catch individually.
            const pOrg     = adminApi.get('/org/me/').catch(e => ({ data: {} })); 
            const pProfile = adminApi.get('/org/profile/me/').catch(e => { throw e }); // Core Profile must exist
            const pLegal   = adminApi.get('/org/legal/me/').catch(e => ({ data: {} })); // Might be missing
            const pDomains = adminApi.get('/org/domains/').catch(e => ({ data: [] })); // Might be missing

            const [resOrg, resProfile, resLegal, resDomains] = await Promise.all([pOrg, pProfile, pLegal, pDomains]);
            
            setOrgData(resOrg.data);
            setProfileData(resProfile.data);
            setLegalData(resLegal.data);
            setDomainsData(resDomains.data);
        } catch (err) {
            setPageError(err.response?.data?.detail || "Failed to load organization data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

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
                    <h3 style={{color: 'var(--color-text-primary)'}}>Initialization Failed</h3>
                    <div>{pageError}</div>
                    <Button onClick={fetchAllData} variant="primary">Retry Fetch</Button>
                </div>
            )}

            {!loading && !pageError && profileData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <OrganizationCard org={orgData} />
                    <OrganizationProfileCard profile={profileData} />
                    <OrganizationLegalCard legal={legalData} />
                    <DomainsCard domains={domainsData} onRefresh={fetchAllData} />
                </div>
            )}
        </div>
    );
}
