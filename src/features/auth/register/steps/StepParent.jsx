import "./StepFields.css";

const RELATION_OPTIONS = [
  { value: "father",         label: "Father" },
  { value: "mother",         label: "Mother" },
  { value: "legal_guardian", label: "Legal Guardian" },
  { value: "other",          label: "Other" },
];

export default function StepParent({ data, onChange, errors = {} }) {
  return (
    <div>
      <div style={{ marginBottom: "24px", fontSize: "14px", color: "var(--w-text-muted)" }}>
        🔗 If your child is already enrolled, you can link your account to them. This is optional — you can also do it later.
      </div>

      <div className="sf-group">
        <label htmlFor="p-student" className="sf-label">Linked Student Name or ID <span className="sf-optional">(optional)</span></label>
        <input
          id="p-student"
          type="text"
          value={data.linked_student_id}
          onChange={(e) => onChange("linked_student_id", e.target.value)}
          placeholder="Enter student name or enrollment number"
          className="sf-input"
        />
        <span style={{ display: "block", marginTop: "6px", fontSize: "12px", color: "var(--w-text-muted)" }}>
          The admin will verify and confirm the link during approval.
        </span>
      </div>

      <div className="sf-group">
        <label htmlFor="p-rel" className="sf-label">Your relation to the student <span className="sf-optional">(optional)</span></label>
        <div className="sf-select-wrap">
          <select
            id="p-rel"
            value={data.relation_to_student}
            onChange={(e) => onChange("relation_to_student", e.target.value)}
            className="sf-select"
          >
            <option value="">— Select relation —</option>
            {RELATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
