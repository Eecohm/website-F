import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '@/services/axios/adminApi';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import styles from './OrgProfileSetup.module.css';
import { Building2, Phone, Palette, Link as LinkIcon } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Identity & Contact', icon: Building2 },
    { id: 2, label: 'Branding & Socials', icon: Palette }
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

export default function OrgProfileSetup() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        short_name: '',
        school_type: '',
        established_year: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state_province: '',
        postal_code: '',
        country: 'Nepal',
        phone_primary: '',
        email_primary: '',
        website: '',
        primary_color: '#6366f1',
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        linkedin_url: '',
        youtube_url: '',
    });

    // File states for previews and upload
    const [files, setFiles] = useState({
        logo: null,
        favicon: null,
        cover_image: null,
    });

    const [previews, setPreviews] = useState({
        logo: null,
        favicon: null,
        cover_image: null,
    });

    useEffect(() => {
        fetchExistingData();
    }, []);

    const fetchExistingData = async () => {
        try {
            const res = await adminApi.get('/org/profile/me/');
            const data = res.data;

            // Update form data with existing values
            setFormData(prev => ({
                ...prev,
                ...data,
                // Ensure nulls from backend are empty strings for controlled inputs
                name: data.name || '',
                short_name: data.short_name || '',
                school_type: data.school_type || '',
                established_year: data.established_year || '',
                address_line_1: data.address_line_1 || '',
                address_line_2: data.address_line_2 || '',
                city: data.city || '',
                state_province: data.state_province || '',
                postal_code: data.postal_code || '',
                country: data.country || 'Nepal',
                phone_primary: data.phone_primary || '',
                email_primary: data.email_primary || '',
                website: data.website || '',
                primary_color: data.primary_color || '#6366f1',
                facebook_url: data.facebook_url || '',
                twitter_url: data.twitter_url || '',
                instagram_url: data.instagram_url || '',
                linkedin_url: data.linkedin_url || '',
                youtube_url: data.youtube_url || '',
            }));

            // Set existing image previews
            setPreviews({
                logo: data.logo || null,
                favicon: data.favicon || null,
                cover_image: data.cover_image || null,
            });

        } catch (err) {
            addToast({ type: 'error', message: 'Failed to pre-load organization data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [field]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const data = new FormData();

            // Append all text fields
            Object.keys(formData).forEach(key => {
                if (formData[key]) data.append(key, formData[key]);
            });

            // Append files only if they were changed
            if (files.logo) data.append('logo', files.logo);
            if (files.favicon) data.append('favicon', files.favicon);
            if (files.cover_image) data.append('cover_image', files.cover_image);

            await adminApi.patch('/org/profile/me/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            addToast({ type: 'success', message: 'Organization profile updated successfully!' });
            navigate('/app/admin/profile');
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to save organization profile.';
            addToast({ type: 'error', message: msg });
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
                    <h1 className={styles.title}>Initialize Your Organization</h1>
                    <p className={styles.subtitle}>Complete these 2 steps to set up your public profile and branding.</p>
                </header>

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
                            </div>
                            <TextInput
                                label="Short Name"
                                name="short_name"
                                value={formData.short_name}
                                onChange={handleInputChange}
                                placeholder="e.g. GHS"
                            />
                            <div className="formGroup">
                                <label className="label" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-0-5)', display: 'block' }}>School Type</label>
                                <select
                                    className={styles.select}
                                    name="school_type"
                                    value={formData.school_type}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Type...</option>
                                    {SCHOOL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                            <TextInput
                                label="Established Year"
                                name="established_year"
                                type="number"
                                value={formData.established_year}
                                onChange={handleInputChange}
                                placeholder="e.g. 1995"
                            />

                            <h3 className={`${styles.sectionTitle} ${styles.fullWidth}`} style={{ marginTop: 'var(--space-4)' }}>Contact & Location</h3>
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
                                label="Primary Phone"
                                name="phone_primary"
                                value={formData.phone_primary}
                                onChange={handleInputChange}
                                placeholder="+977-1-XXXXXX"
                            />
                            <TextInput
                                label="Contact Email"
                                name="email_primary"
                                type="email"
                                value={formData.email_primary}
                                onChange={handleInputChange}
                                placeholder="info@school.edu"
                            />
                            <div className={styles.fullWidth}>
                                <TextInput
                                    label="Official Website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="https://www.school.edu"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className={`${styles.stepFade} ${styles.formGrid}`}>
                            <h3 className={`${styles.sectionTitle} ${styles.fullWidth}`}>Branding Assets</h3>

                            <div className={styles.uploadGroup}>
                                <label className="label" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-0-5)', display: 'block' }}>Institutional Logo</label>
                                <div className={styles.fileInputWrapper}>
                                    {previews.logo && <img src={previews.logo} alt="Logo" className={styles.previewImage} />}
                                    <p className={styles.subtitle} style={{ color: 'var(--color-text-muted)' }}>{files.logo ? files.logo.name : 'Upload logo'}</p>
                                    <input type="file" className={styles.fileInput} onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" />
                                </div>
                            </div>

                            <div className={`${styles.uploadGroup} ${styles.twoThirds}`}>
                                <label className="label" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-0-5)', display: 'block' }}>Cover Banner</label>
                                <div className={styles.fileInputWrapper}>
                                    {previews.cover_image && <img src={previews.cover_image} alt="Cover" className={styles.previewCover} />}
                                    <p className={styles.subtitle} style={{ color: 'var(--text-muted)' }}>{files.cover_image ? files.cover_image.name : 'Upload banner'}</p>
                                    <input type="file" className={styles.fileInput} onChange={(e) => handleFileChange(e, 'cover_image')} accept="image/*" />
                                </div>
                            </div>

                            <div className={styles.fullWidth}>
                                <label className="label" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-1)', display: 'block' }}>Branding Primary Color</label>
                                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        name="primary_color"
                                        value={formData.primary_color}
                                        onChange={handleInputChange}
                                        style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                                    />
                                    <TextInput
                                        name="primary_color"
                                        value={formData.primary_color}
                                        onChange={handleInputChange}
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>

                            <h3 className={`${styles.sectionTitle} ${styles.fullWidth}`} style={{ marginTop: 'var(--space-4)' }}>Social Presence</h3>
                            <TextInput
                                label="Facebook URL"
                                name="facebook_url"
                                value={formData.facebook_url}
                                onChange={handleInputChange}
                                placeholder="https://facebook.com/your-school"
                            />
                            <TextInput
                                label="Twitter URL"
                                name="twitter_url"
                                value={formData.twitter_url}
                                onChange={handleInputChange}
                            />
                            <TextInput
                                label="Instagram URL"
                                name="instagram_url"
                                value={formData.instagram_url}
                                onChange={handleInputChange}
                            />
                            <TextInput
                                label="LinkedIn URL"
                                name="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={handleInputChange}
                            />
                            <TextInput
                                label="YouTube Channel"
                                name="youtube_url"
                                value={formData.youtube_url}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                </main>

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
                                Complete Setup
                            </Button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}
