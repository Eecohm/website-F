import "./StepFields.css";

const RELATION_OPTIONS = [
  { value: "father",          label: "Father" },
  { value: "mother",          label: "Mother" },
  { value: "sibling",         label: "Sibling" },
  { value: "uncle",           label: "Uncle" },
  { value: "aunt",            label: "Aunt" },
  { value: "grandparent",     label: "Grandparent" },
  { value: "legal_guardian",  label: "Legal Guardian" },
  { value: "other",           label: "Other" },
];

export default function StepStudent({ data, onChange, errors = {} }) {
  return (
    <div>
      <div style={{ marginBottom: "24px", fontSize: "14px", color: "var(--w-text-muted)" }}>
        📚 Tell us about your academic details and primary guardian.
      </div>

      <div className="sf-grid-2">
        <div className="sf-group">
          <label htmlFor="s-grade" className="sf-label">Grade / Class</label>
          <input
            id="s-grade"
            type="text"
            value={data.grade}
            onChange={(e) => onChange("grade", e.target.value)}
            placeholder="e.g. Grade 10, Class VIII"
            className={`sf-input${errors.grade ? " has-error" : ""}`}
          />
          {errors.grade && <p className="sf-error">{errors.grade}</p>}
        </div>

        <div className="sf-group">
          <label htmlFor="s-enroll" className="sf-label">Enrollment Number <span className="sf-optional">(optional)</span></label>
          <input
            id="s-enroll"
            type="text"
            value={data.enrollment_number}
            onChange={(e) => onChange("enrollment_number", e.target.value)}
            placeholder="e.g. 20241001"
            className="sf-input"
          />
        </div>
      </div>

      <div style={{ margin: "24px 0 16px", borderBottom: "1px solid var(--w-border)", paddingBottom: "8px", fontWeight: "600", color: "var(--w-text)" }}>
        <span>Guardian Information</span>
      </div>

      <div className="sf-group">
        <label htmlFor="s-gname" className="sf-label">Guardian Full Name</label>
        <input
          id="s-gname"
          type="text"
          value={data.guardian_name}
          onChange={(e) => onChange("guardian_name", e.target.value)}
          placeholder="e.g. Ram Prasad Sharma"
          className={`sf-input${errors.guardian_name ? " has-error" : ""}`}
        />
        {errors.guardian_name && <p className="sf-error">{errors.guardian_name}</p>}
      </div>

      <div className="sf-grid-2">
        <div className="sf-group">
          <label htmlFor="s-gphone" className="sf-label">Guardian Phone <span className="sf-optional">(optional)</span></label>
          <input
            id="s-gphone"
            type="tel"
            value={data.guardian_phone}
            onChange={(e) => onChange("guardian_phone", e.target.value)}
            placeholder="+977 98XXXXXXXX"
            className="sf-input"
          />
        </div>

        <div className="sf-group">
          <label htmlFor="s-grel" className="sf-label">Relation to Student</label>
          <div className="sf-select-wrap">
            <select
              id="s-grel"
              value={data.guardian_relation}
              onChange={(e) => onChange("guardian_relation", e.target.value)}
              className={`sf-select${errors.guardian_relation ? " has-error" : ""}`}
            >
              <option value="">— Select relation —</option>
              {RELATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {errors.guardian_relation && <p className="sf-error">{errors.guardian_relation}</p>}
        </div>
      </div>
    </div>
  );
}
