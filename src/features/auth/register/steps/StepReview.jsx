/**
 * StepReview.jsx
 * Final step: summary of all collected data + edit links + submit
 */
import styles from "../Wizard.module.css";

const LABELS = {
  // Account
  first_name: "First Name", last_name: "Last Name", email: "Email",
  phone_number: "Phone", password: "Password",
  // Personal
  date_of_birth: "Date of Birth", gender: "Gender",
  blood_group: "Blood Group", nationality: "Nationality", religion: "Religion",
  // Address
  address_line_1: "Address Line 1", address_line_2: "Address Line 2",
  city: "City", state_or_province: "State / Province",
  postal_code: "Postal Code", country: "Country",
};

function ReviewSection({ title, fields, data, stepIndex, onEdit }) {
  const filled = fields.filter((k) => data[k] && data[k] !== "prefer_not_to_say");
  if (filled.length === 0) return null;
  return (
    <div className={styles.reviewSection}>
      <div className={styles.reviewHeader}>
        <span className={styles.reviewTitle}>{title}</span>
        <button type="button" className={styles.editBtn} onClick={() => onEdit(stepIndex)}>
          Edit
        </button>
      </div>
      <dl className={styles.reviewGrid}>
        {filled.map((k) => (
          <div key={k} className={styles.reviewRow}>
            <dt className={styles.reviewLabel}>{LABELS[k] || k}</dt>
            <dd className={styles.reviewValue}>
              {k === "password" ? "••••••••" : data[k]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ReviewRoleSection({ roleType, formData, stepIndex, onEdit }) {
  if (!roleType || ["admin", "owner"].includes(roleType)) return null;

  const section = formData[roleType] || {};
  const filled = Object.entries(section).filter(([, v]) => v);
  if (filled.length === 0) return null;

  const titles = {
    teacher: "Teacher Details", student: "Student Details",
    staff: "Staff Details", parent: "Parent Info", vendor: "Vendor Details"
  };

  return (
    <div className={styles.reviewSection}>
      <div className={styles.reviewHeader}>
        <span className={styles.reviewTitle}>{titles[roleType] || "Role Details"}</span>
        <button type="button" className={styles.editBtn} onClick={() => onEdit(stepIndex)}>Edit</button>
      </div>
      <dl className={styles.reviewGrid}>
        {filled.map(([k, v]) => (
          <div key={k} className={styles.reviewRow}>
            <dt className={styles.reviewLabel}>{k.replace(/_/g, " ")}</dt>
            <dd className={styles.reviewValue}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function StepReview({ formData, roleName, roleStepIndex, onEdit }) {
  return (
    <div className={styles.stepBody}>
      <div className={styles.reviewIntro}>
        Please review your information before submitting. Click <strong>Edit</strong> on any section to go back and change it.
      </div>

      <div className={styles.roleTag}>
        Role: <strong>{roleName}</strong>
      </div>

      <ReviewSection
        title="Account Info" stepIndex={1}
        fields={["first_name", "last_name", "email", "phone_number", "password"]}
        data={formData} onEdit={onEdit}
      />
      <ReviewSection
        title="Personal Info" stepIndex={2}
        fields={["date_of_birth", "gender", "blood_group", "nationality", "religion"]}
        data={formData} onEdit={onEdit}
      />
      <ReviewSection
        title="Address" stepIndex={3}
        fields={["address_line_1", "address_line_2", "city", "state_or_province", "postal_code", "country"]}
        data={formData} onEdit={onEdit}
      />
      <ReviewRoleSection
        roleType={formData.role_type}
        formData={formData}
        stepIndex={roleStepIndex}
        onEdit={onEdit}
      />
    </div>
  );
}
