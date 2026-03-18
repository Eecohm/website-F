import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, MapPin, Phone, Mail, Globe, Calendar,
    Instagram, Facebook, Twitter, Linkedin, Youtube,
    Edit3, RefreshCw, AlertTriangle, Palette, ImageIcon,
    CheckCircle2, School,
} from 'lucide-react';
import adminApi from '@/services/axios/adminApi';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import styles from './OrgProfile.module.css';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const SCHOOL_TYPE_LABELS = {
    pre_primary: 'Pre-Primary',
    primary: 'Primary',
    secondary: 'Secondary',
    higher_sec: 'Higher Secondary',
    university: 'University',
    vocational: 'Vocational / Technical',
    other: 'Other',
};

/** Return initials (up to 2 chars) from a school name. */
function getInitials(name) {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}

function InfoRow({ icon: Icon, label, value, href }) {
    const empty = !value;
    return (
        <div className={styles.infoRow}>
            <span className={styles.infoIcon}>
                <Icon size={15} />
            </span>
            <div className={styles.infoContent}>
                <div className={styles.infoLabel}>{label}</div>
                {empty
                    ? <span className={styles.infoValueEmpty}>Not set</span>
                    : href
                        ? <a href={href} target="_blank" rel="noopener noreferrer" className={styles.infoValueLink}>{value}</a>
                        : <span className={styles.infoValue}>{value}</span>
                }
            </div>
        </div>
    );
}

const SOCIAL_CONFIG = [
    { key: 'facebook_url', label: 'Facebook', Icon: Facebook },
    { key: 'twitter_url', label: 'Twitter', Icon: Twitter },
    { key: 'instagram_url', label: 'Instagram', Icon: Instagram },
    { key: 'linkedin_url', label: 'LinkedIn', Icon: Linkedin },
    { key: 'youtube_url', label: 'YouTube', Icon: Youtube },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-sections
// ─────────────────────────────────────────────────────────────────────────────

function BannerCard({ profile }) {
    const completion = profile.completion_score ?? 0;
    return (
        <div className={styles.bannerCard}>
            <div className={styles.logoWrapper}>
                <div className={styles.logoCircle}>
                    {profile.logo
                        ? <img src={profile.logo} alt="logo" className={styles.logoImg} />
                        : <span className={styles.logoPlaceholder}>{getInitials(profile.name)}</span>
                    }
                </div>
            </div>

            <div className={styles.bannerInfo}>
                <div className={styles.bannerName}>{profile.name || 'Unnamed Organisation'}</div>
                {profile.tagline && (
                    <div className={styles.bannerTagline}>"{profile.tagline}"</div>
                )}
                <div className={styles.bannerBadges}>
                    {profile.school_type && (
                        <span className={`${styles.badge} ${styles.badgePrimary}`}>
                            <School size={11} />
                            {SCHOOL_TYPE_LABELS[profile.school_type] ?? profile.school_type}
                        </span>
                    )}
                    {profile.established_year && (
                        <span className={`${styles.badge} ${styles.badgePrimary}`}>
                            Est. {profile.established_year}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.completionBar}>
                <span className={styles.completionLabel}>Profile completion</span>
                <div className={styles.completionTrack}>
                    <div className={styles.completionFill} style={{ width: `${completion}%` }} />
                </div>
                <span className={styles.completionScore}>{completion}%</span>
            </div>
        </div>
    );
}

function IdentityCard({ profile }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={`${styles.cardIcon} ${styles.iconPurple}`}><Building2 size={15} /></span>
                <span className={styles.cardTitle}>Identity</span>
            </div>
            <div className={styles.cardBody}>
                <InfoRow icon={Building2} label="Full Name" value={profile.name} />
                <InfoRow icon={Building2} label="Short Name" value={profile.short_name} />
                <InfoRow icon={School} label="School Type" value={SCHOOL_TYPE_LABELS[profile.school_type]} />
                <InfoRow icon={Calendar} label="Est. Year" value={profile.established_year?.toString()} />
                {profile.description && (
                    <div className={styles.infoRow}>
                        <span className={styles.infoIcon}><Building2 size={15} /></span>
                        <div className={styles.infoContent}>
                            <div className={styles.infoLabel}>About</div>
                            <span className={styles.infoValue}>{profile.description}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ContactCard({ profile }) {
    const address = profile.full_address;
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={`${styles.cardIcon} ${styles.iconNavy}`}><Phone size={15} /></span>
                <span className={styles.cardTitle}>Contact Details</span>
            </div>
            <div className={styles.cardBody}>
                {address && <InfoRow icon={MapPin} label="Address" value={address} />}
                <InfoRow icon={Phone} label="Primary Phone" value={profile.phone_primary} />
                <InfoRow icon={Phone} label="Secondary Phone" value={profile.phone_secondary} />
                <InfoRow icon={Mail} label="Contact Email" value={profile.email_primary} href={profile.email_primary ? `mailto:${profile.email_primary}` : null} />
                <InfoRow icon={Mail} label="Admissions Email" value={profile.email_admissions} href={profile.email_admissions ? `mailto:${profile.email_admissions}` : null} />
                <InfoRow icon={Globe} label="Website" value={profile.website} href={profile.website} />
            </div>
        </div>
    );
}

function BrandingCard({ profile }) {
    const hasPrimary = !!profile.primary_color;
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={`${styles.cardIcon} ${styles.iconTeal}`}><Palette size={15} /></span>
                <span className={styles.cardTitle}>Branding</span>
            </div>
            <div className={styles.brandingRow}>
                {/* Logo */}
                <div className={styles.brandAsset}>
                    {profile.logo
                        ? <img src={profile.logo} className={styles.brandAssetImg} alt="Logo" />
                        : <div className={styles.brandAssetEmpty}><ImageIcon size={18} /></div>
                    }
                    <span className={styles.brandAssetLabel}>Logo</span>
                </div>

                {/* Favicon */}
                <div className={styles.brandAsset}>
                    {profile.favicon
                        ? <img src={profile.favicon} className={styles.brandAssetImg} alt="Favicon" />
                        : <div className={styles.brandAssetEmpty}><ImageIcon size={18} /></div>
                    }
                    <span className={styles.brandAssetLabel}>Favicon</span>
                </div>

                {/* Cover */}
                <div className={styles.brandAsset}>
                    {profile.cover_image
                        ? <img src={profile.cover_image} className={styles.brandAssetImg} alt="Cover" />
                        : <div className={styles.brandAssetEmpty}><ImageIcon size={18} /></div>
                    }
                    <span className={styles.brandAssetLabel}>Cover</span>
                </div>

                {/* Primary colour */}
                <div className={styles.brandAsset}>
                    {hasPrimary
                        ? <div className={styles.colorSwatch} style={{ background: profile.primary_color }} title={profile.primary_color} />
                        : <div className={styles.colorSwatchEmpty}><Palette size={18} /></div>
                    }
                    <span className={styles.brandAssetLabel}>Brand Colour</span>
                </div>
            </div>
        </div>
    );
}

function SocialCard({ profile }) {
    const activeSocials = SOCIAL_CONFIG.filter(s => profile[s.key]);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={`${styles.cardIcon} ${styles.iconGold}`}><Globe size={15} /></span>
                <span className={styles.cardTitle}>Social Media</span>
            </div>
            {activeSocials.length > 0
                ? (
                    <div className={styles.socialGrid}>
                        {activeSocials.map(({ key, label, Icon }) => (
                            <a
                                key={key}
                                href={profile[key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                            >
                                <Icon size={13} />
                                {label}
                            </a>
                        ))}
                    </div>
                )
                : <p className={styles.noSocial}>No social media links added yet.</p>
            }
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading state
// ─────────────────────────────────────────────────────────────────────────────

function LoadingState() {
    return (
        <div className={styles.stateContainer}>
            <Spinner size="md" />
            <span className={styles.stateText}>Loading organisation profile…</span>
        </div>
    );
}

function ErrorState({ message, onRetry }) {
    return (
        <div className={styles.stateContainer}>
            <div className={styles.stateIcon}><AlertTriangle size={22} color="var(--color-danger)" /></div>
            <div className={styles.stateTitle}>Failed to load profile</div>
            <div className={styles.stateText}>{message}</div>
            <Button variant="secondary" size="sm" onClick={onRetry}>
                <RefreshCw size={14} /> Retry
            </Button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const OrgProfile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await adminApi.get('/org/profile/me/');
            setProfile(data);
        } catch (err) {
            const msg = err.response?.data?.detail ?? 'An unexpected error occurred.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleEdit = () => navigate('/app/admin/profile/setup');

    return (
        <div className={styles.page}>
            {/* ── Header ───────────────────────────────────────── */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Organisation Profile</h1>
                    <p className={styles.pageSubtitle}>
                        View and manage your school's public identity and contact information.
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchProfile}
                        disabled={loading}
                        title="Refresh profile"
                    >
                        <RefreshCw size={15} />
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleEdit}
                        disabled={loading}
                    >
                        <Edit3 size={15} />
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* ── Content ──────────────────────────────────────── */}
            {loading && <LoadingState />}

            {!loading && error && (
                <ErrorState message={error} onRetry={fetchProfile} />
            )}

            {!loading && !error && profile && (
                <>
                    <BannerCard profile={profile} />

                    <div className={styles.grid}>
                        <IdentityCard profile={profile} />
                        <ContactCard profile={profile} />
                        <BrandingCard profile={profile} />
                        <SocialCard profile={profile} />
                    </div>
                </>
            )}
        </div>
    );
};

export default OrgProfile;

