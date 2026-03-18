import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '@/services/axios/adminApi';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import styles from './OrgProfileSetup.module.css';
import { Building2, Palette } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Identity & Contact', icon: Building2 },
    { id: 2, label: 'Branding & Socials', icon: Palette },
];

const SCHOOL_TYPES = [
    { value: 'pre_primary', label: 'Pre-Primary' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'higher_sec', label: 'Higher Secondary' },
    { value: 'university', label: 'University' },
    { value: 'vocational', label: 'Vocational / Technical' },
    { value: 'other', label: 'Other' },
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep1(f) {
    const errors = {};
    if (!f.name.trim()) errors.name = 'School name is required.';
    if (f.established_year) {
        const yr = parseInt(f.established_year, 10);
        if (isNaN(yr) || yr < 1800 || yr > new Date().getFullYear()) {
            errors.established_year = `Must be a valid year between 1800 and ${new Date().getFullYear()}.`;
        }
    }
    if (f.email_primary && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email_primary))
        errors.email_primary = 'Enter a valid email address.';
    if (f.email_admissions && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email_admissions))
        errors.email_admissions = 'Enter a valid email address.';
    if (f.website && !/^https?:\/\/.+/.test(f.website))
        errors.website = 'Must start with http:// or https://';
    return errors;
}

function validateStep2(f) {
    const errors = {};
    if (f.primary_color && !/^#[0-9A-Fa-f]{6}$/.test(f.primary_color))
        errors.primary_color = 'Must be a valid hex colour, e.g. #6366f1';
    const urlFields = ['facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url', 'youtube_url'];
    urlFields.forEach(key => {
        if (f[key] && !/^https?:\/\/.+/.test(f[key]))
            errors[key] = 'Must start with http:// or https://';
    });
    return errors;
}

// ─── Shared label style constant ─────────────────────────────────────────────
const labelStyle = {
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-sm)',
    fontWeight: 'var(--weight-medium)',
    marginBottom: 'var(--space-0-5)',
    display: 'block',
};

// ─── FieldError helper ────────────────────────────────────────────────────────
function FieldError({ msg }) {
    if (!msg) return null;
    return <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{msg}</p>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrgProfileSetup() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    // ── TEXT form state (no image URLs here — images only live in `files`) ────
    const [formData, setFormData] = useState({
        name: '',
        short_name: '',
        tagline: '',
        description: '',
        school_type: '',
        established_year: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state_province: '',
        postal_code: '',
        country: 'Nepal',
        phone_primary: '',
        phone_secondary: '',
        email_primary: '',
        email_admissions: '',
        website: '',
        primary_color: '#6366f1',
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        linkedin_url: '',
        youtube_url: '',
    });

    // ── File objects (only set when user picks a new file) ────────────────────
    const [files, setFiles] = useState({ logo: null, cover_image: null });

    // ── Preview URLs (may be existing URL from API OR local blob URL) ─────────
    const [previews, setPreviews] = useState({ logo: null, cover_image: null });

    useEffect(() => {
        fetchExistingData();
    }, []);

    const fetchExistingData = async () => {
        try {
            const res = await adminApi.get('/org/profile/me/');
            const d = res.data;

            // Populate text fields only — never put image URLs into formData
            setFormData({
                name: d.name || '',
                short_name: d.short_name || '',
                tagline: d.tagline || '',
                description: d.description || '',
                school_type: d.school_type || '',
                established_year: d.established_year || '',
                address_line_1: d.address_line_1 || '',
                address_line_2: d.address_line_2 || '',
                city: d.city || '',
                state_province: d.state_province || '',
                postal_code: d.postal_code || '',
                country: d.country || 'Nepal',
                phone_primary: d.phone_primary || '',
                phone_secondary: d.phone_secondary || '',
                email_primary: d.email_primary || '',
                email_admissions: d.email_admissions || '',
                website: d.website || '',
                primary_color: d.primary_color || '#6366f1',
                facebook_url: d.facebook_url || '',
                twitter_url: d.twitter_url || '',
                instagram_url: d.instagram_url || '',
                linkedin_url: d.linkedin_url || '',
                youtube_url: d.youtube_url || '',
            });

            // Show existing images as previews (these are display-only strings)
            setPreviews({
                logo: d.logo || null,
                cover_image: d.cover_image || null,
            });
        } catch {
            addToast({ type: 'error', message: 'Failed to pre-load organization data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for the field being edited
        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        setFiles(prev => ({ ...prev, [field]: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviews(prev => ({ ...prev, [field]: reader.result }));
        reader.readAsDataURL(file);
    };

    const nextStep = () => {
        const errors = validateStep1(formData);
        if (Object.keys(errors).length) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});
        setCurrentStep(2);
    };

    const prevStep = () => {
        setFieldErrors({});
        setCurrentStep(1);
    };

    const handleSubmit = async () => {
        const errors = validateStep2(formData);
        if (Object.keys(errors).length) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});
        setSubmitting(true);

        try {
            // Build multipart FormData — text fields first
            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                // Only append non-empty values
                if (value !== '' && value !== null && value !== undefined) {
                    payload.append(key, value);
                }
            });

            // Append file objects ONLY if the user picked a new file
            // (never append the preview URL strings)
            if (files.logo instanceof File) payload.append('logo', files.logo);
            if (files.cover_image instanceof File) payload.append('cover_image', files.cover_image);

            // Do NOT pass a custom Content-Type header — let axios set it
            // automatically so the multipart boundary is included correctly.
            await adminApi.patch('/org/profile/me/', payload);

            addToast({ type: 'success', message: 'Organization profile updated successfully!' });
            navigate('/app/admin/profile');
        } catch (err) {
            // Surface field-level errors returned by the backend
            if (err.response?.data && typeof err.response.data === 'object') {
                const backendErrors = err.response.data;
                // Convert array messages to strings
                const mapped = {};
                Object.entries(backendErrors).forEach(([k, v]) => {
                    mapped[k] = Array.isArray(v) ? v.join(' ') : String(v);
                });
                setFieldErrors(mapped);
                addToast({ type: 'error', message: 'Please correct the errors below.' });
            } else {
                addToast({ type: 'error', message: 'Failed to save organization profile.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-20)' }}>
                <Spinner size="lg" variant="primary" />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.wizardCard}>
                <header className={styles.wizardHeader}>
                    <h1 className={styles.title}>Edit Organisation Profile</h1>
                    <p className={styles.subtitle}>Update your school's public identity and contact information.</p>
                </header>

                {/* ── Step indicator ─────────────────────────────────── */}
                <nav className={styles.progressContainer}>
                    <div className={styles.progressLine} />
                    <div className={styles.progressFill} style={{ width: `${((currentStep - 1) / 1) * 100}%` }} />
                    {STEPS.map(step => (
                        <div
                            key={step.id}
                            className={`${styles.stepNode} ${currentStep === step.id ? styles.stepActive : ''} ${currentStep > step.id ? styles.stepCompleted : ''}`}
                        >
                            <div className={styles.stepCircle}>
                                {currentStep > step.id ? '✓' : <step.icon size={18} />}
                            </div>
                            <span className={styles.stepLabel}>{step.label}</span>
                        </div>
                    ))}
                </nav>

                {/* ── Step 1 — Identity & Contact ────────────────────── */}
                <main className={styles.formContent}>
                    {currentStep === 1 && (
                        <div className={`${styles.stepFade} ${styles.formGrid}`}>
                            <h3 className={`${styles.sectionTitle} ${styles.fullWidth}`}>Core Identity</h3>

                            <div className={styles.twoThirds}>
                                <TextInput
                                    label="Official School Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Greenwood High School"
                                    required
                                />
                                <FieldError msg={fieldErrors.name} />
                            </div>

                            <TextInput
                                label="Short Name"
                                name="short_name"
                                value={formData.short_name}
                                onChange={handleInputChange}
                                placeholder="e.g. GHS"
                            />

                            <div>
                                <label style={labelStyle}>School Type</label>
                                <select
                                    className={styles.select}
                                    name="school_type"
                                    value={formData.school_type}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Type...</option>
                                    {SCHOOL_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <TextInput
                                    label="Established Year"
                                    name="established_year"
                                    type="number"
                                    value={formData.established_year}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 1995"
                                />
                                <FieldError msg={fieldErrors.established_year} />
                            </div>

                            <div className={styles.fullWidth}>
                                <TextInput
                                    label="Tagline / Motto"
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Excellence in Education"
                                />
                            </div>

                            <div className={styles.fullWidth}>
                                <label style={labelStyle}>About / Description</label>
                                <textarea
                                    className={styles.textarea}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="A brief description of the institution..."
                                    rows={3}
                                />
                            </div>

                            <h3 className={`${styles.sectionTitle} ${styles.fullWidth}`} style={{ marginTop: 'var(--space-4)' }}>
                                Contact &amp; Location
                            </h3>

                            <div className={styles.twoThirds}>
                                <TextInput
                                    label="Address Line 1"
                                    name="address_line_1"
                                    value={formData.address_line_1}
                                    onChange={handleInputChange}
                                    placeholder="Street address or P.O. Box"
                                />
                            </div>

                            <TextInput
                                label="Address Line 2"
                                name="address_line_2"
                                value={formData.address_line_2}
                                onChange={handleInputChange}
                                placeholder="Ward, locality, etc."
                            />

                            <TextInput
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                            />

                            <TextInput
                                label="State / Province"
                                name="state_province"
                                value={formData.state_province}
                                onChange={handleInputChange}
                            />

                            <TextInput
                                label="Postal Code"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                placeholder="e.g. 44600"
                            />

                            <TextInput
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                placeholder="e.g. Nepal"
                            />

                            <div>
                                <TextInput
                                    label="Primary Phone"
                                    name="phone_primary"
                                    value={formData.phone_primary}
                                    onChange={handleInputChange}
                                    placeholder="+977-1-XXXXXX"
                                />
                            </div>

                            <TextInput
                                label="Secondary Phone"
                                name="phone_secondary"
                                value={formData.phone_secondary}
                                onChange={handleInputChange}
                                placeholder="+977-1-XXXXXX"
                            />

                            <div>
                                <TextInput
                                    label="Contact Email"
                                    name="email_primary"
                                    type="email"
                                    value={formData.email_primary}
                                    onChange={handleInputChange}
                                    placeholder="info@school.edu"
                                />
                                <FieldError msg={fieldErrors.email_primary} />
                            </div>

                            <div>
                                <TextInput
                                    label="Admissions Email"
                                    name="email_admissions"
                                    type="email"
                                    value={formData.email_admissions}
                                    onChange={handleInputChange}
                                    placeholder="admissions@school.edu"
                                />
                                <FieldError msg={fieldErrors.email_admissions} />
                            </div>

                            <div className={styles.fullWidth}>
                                <TextInput
                                    label="Official Website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="https://www.school.edu"
                                />
                                <FieldError msg={fieldErrors.website} />
                            </div>
                        </div>
                    )}

                    {/* ── Step 2 — Branding & Socials ────────────────────── */}
                    {currentStep === 2 && (
                        <div className={`${styles.stepFade} ${styles.formGrid}`}>
                            <h3 className={`${styles.sectionTitle} ${styles.fullWidth}`}>Branding Assets</h3>

                            {/* Logo */}
                            <div className={styles.uploadGroup}>
                                <label style={labelStyle}>Institutional Logo</label>
                                <div className={styles.fileInputWrapper}>
                                    {previews.logo && (
                                        <img src={previews.logo} alt="Logo" className={styles.previewImage} />
                                    )}
                                    <p className={styles.uploadHint}>
                                        {files.logo ? files.logo.name : 'Click to upload logo'}
                                    </p>
                                    <input
                                        type="file"
                                        className={styles.fileInput}
                                        onChange={e => handleFileChange(e, 'logo')}
                                        accept="image/*"
                                    />
                                </div>
                                <FieldError msg={fieldErrors.logo} />
                            </div>

                            {/* Cover image */}
                            <div className={`${styles.uploadGroup} ${styles.twoThirds}`}>
                                <label style={labelStyle}>Cover Banner</label>
                                <div className={styles.fileInputWrapper}>
                                    {previews.cover_image && (
                                        <img src={previews.cover_image} alt="Cover" className={styles.previewCover} />
                                    )}
                                    <p className={styles.uploadHint}>
                                        {files.cover_image ? files.cover_image.name : 'Click to upload banner'}
                                    </p>
                                    <input
                                        type="file"
                                        className={styles.fileInput}
                                        onChange={e => handleFileChange(e, 'cover_image')}
                                        accept="image/*"
                                    />
                                </div>
                                <FieldError msg={fieldErrors.cover_image} />
                            </div>

                            {/* Primary colour */}
                            <div className={styles.fullWidth}>
                                <label style={labelStyle}>Branding Primary Colour</label>
                                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        name="primary_color"
                                        value={formData.primary_color}
                                        onChange={handleInputChange}
                                        style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <TextInput
                                            name="primary_color"
                                            value={formData.primary_color}
                                            onChange={handleInputChange}
                                            placeholder="#000000"
                                        />
                                        <FieldError msg={fieldErrors.primary_color} />
                                    </div>
                                </div>
                            </div>

                            <h3 className={`${styles.sectionTitle} ${styles.fullWidth}`} style={{ marginTop: 'var(--space-4)' }}>
                                Social Presence
                            </h3>

                            {[
                                { name: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/your-school' },
                                { name: 'twitter_url', label: 'Twitter / X URL', placeholder: 'https://twitter.com/your-school' },
                                { name: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/your-school' },
                                { name: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/school/your-school' },
                                { name: 'youtube_url', label: 'YouTube Channel', placeholder: 'https://youtube.com/@your-school' },
                            ].map(({ name, label, placeholder }) => (
                                <div key={name}>
                                    <TextInput
                                        label={label}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleInputChange}
                                        placeholder={placeholder}
                                    />
                                    <FieldError msg={fieldErrors[name]} />
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* ── Footer ─────────────────────────────────────────── */}
                <footer className={styles.wizardFooter}>
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1 || submitting}
                    >
                        Previous
                    </Button>

                    <div className={styles.btnGroup}>
                        {currentStep < 2 ? (
                            <Button variant="primary" onClick={nextStep}>
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                loading={submitting}
                            >
                                Save Changes
                            </Button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}
