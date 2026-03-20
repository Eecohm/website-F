/**
 * RegisterPage.jsx
 * ----------------
 * Step 0: Org slug lookup + role selector card.
 * Once a role is chosen → renders WizardShell.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRoles } from "./hooks/useRoles";
import WizardShell from "./WizardShell";
import styles from "./Wizard.module.css";

const ROLE_ICONS = {
  teacher: "🎓",
  student: "📚",
  staff:   "🏢",
  parent:  "👨‍👩‍👧",
  vendor:  "🛒",
  admin:   "⚙️",
  owner:   "👑",
};

export default function RegisterPage() {
  const [orgSlug, setOrgSlug]           = useState("");
  const [selectedRole, setSelectedRole] = useState(null); // full role object or null
  const [wizardActive, setWizardActive] = useState(false);

  const { roles, status, error } = useRoles(orgSlug);

  const orgStatusIcon =
    status === "loading" ? "⟳" :
    status === "ok"      ? "✓" :
    status === "error"   ? "✗" : null;

  const slugBorderColor =
    status === "error" ? "var(--error)" :
    status === "ok"    ? "#22c55e"      : "var(--border)";

  function handleRoleSelect(role) {
    setSelectedRole(role);
  }

  function handleContinue() {
    if (selectedRole && status === "ok") setWizardActive(true);
  }

  if (wizardActive && selectedRole) {
    return (
      <div className={styles.wizardContainer}>
        <div className={styles.wizardHeader}>
          <h1 className={styles.wizardTitle}>Create Your Account</h1>
          <p className={styles.wizardSubtitle}>
            Joining as <strong>{selectedRole.name}</strong> · {orgSlug}
          </p>
        </div>
        <WizardShell
          selectedRole={selectedRole}
          orgSlug={orgSlug}
          roleName={selectedRole.name}
          onBack={() => setWizardActive(false)}
        />
      </div>
    );
  }

  return (
    <div className={styles.wizardContainer}>
      <div className={styles.wizardHeader}>
        <h1 className={styles.wizardTitle}>Join Your Organization</h1>
        <p className={styles.wizardSubtitle}>Enter your organization's slug and select your role to begin registration.</p>
      </div>

      <div className={styles.roleSelectorWrap}>
        {/* Org Slug */}
        <div className={styles.fieldGroup} style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="rs-slug" className={styles.label}>Organization Slug</label>
          <div className={styles.orgInputWrap}>
            <input
              id="rs-slug"
              type="text"
              value={orgSlug}
              onChange={(e) => { setOrgSlug(e.target.value); setSelectedRole(null); }}
              placeholder="e.g. sunshine-school"
              autoComplete="off"
              style={{
                width: "100%", padding: "0.75rem 2.5rem 0.75rem 1rem",
                borderRadius: "0.5rem",
                border: `1px solid ${status === "error" ? "var(--error)" : slugBorderColor}`,
                backgroundColor: "var(--bg)",
                color: "var(--text-primary)",
                fontSize: "1rem", outline: "none", boxSizing: "border-box",
              }}
            />
            {orgStatusIcon && (
              <span
                className={styles.orgStatusIcon}
                style={{ color: status === "ok" ? "#22c55e" : status === "error" ? "var(--error)" : "var(--text-secondary)" }}
              >
                {orgStatusIcon}
              </span>
            )}
          </div>
          {status === "error" && (
            <span style={{ color: "var(--error)", fontSize: "0.8rem" }}>{error}</span>
          )}
          {status === "ok" && (
            <span style={{ color: "#22c55e", fontSize: "0.8rem" }}>
              Organization found — {roles.length} role{roles.length !== 1 ? "s" : ""} available
            </span>
          )}
        </div>

        {/* Role grid */}
        {status === "ok" && roles.length > 0 && (
          <>
            <label className={styles.label} style={{ marginBottom: "0.5rem", display: "block" }}>
              Select your role
            </label>
            <div className={styles.roleGrid}>
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`${styles.roleCard} ${selectedRole?.id === role.id ? styles.roleCardActive : ""}`}
                >
                  <span className={styles.roleIcon}>{ROLE_ICONS[role.role_type] || "👤"}</span>
                  <span className={styles.roleName}>{role.name}</span>
                  <span className={styles.roleType}>{role.role_type}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Action row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
          <Link to="/login" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "underline" }}>
            Already have an account?
          </Link>
          <button
            type="button"
            className={styles.btnNext}
            disabled={!selectedRole || status !== "ok"}
            onClick={handleContinue}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
