import "./StepFields.css";

export default function StepStaff({ data, onChange, errors = {} }) {
  return (
    <div>
      <div className="sf-grid-2">
        <div className="sf-group">
          <label htmlFor="st-dept" className="sf-label">Department</label>
          <input
            id="st-dept"
            type="text"
            value={data.department}
            onChange={(e) => onChange("department", e.target.value)}
            placeholder="e.g. Administration, Finance"
            className={`sf-input${errors.department ? " has-error" : ""}`}
          />
          {errors.department && <p className="sf-error">{errors.department}</p>}
        </div>

        <div className="sf-group">
          <label htmlFor="st-desig" className="sf-label">Designation</label>
          <input
            id="st-desig"
            type="text"
            value={data.designation}
            onChange={(e) => onChange("designation", e.target.value)}
            placeholder="e.g. Accountant, Librarian"
            className={`sf-input${errors.designation ? " has-error" : ""}`}
          />
          {errors.designation && <p className="sf-error">{errors.designation}</p>}
        </div>
      </div>

      <div className="sf-group">
        <label htmlFor="st-join" className="sf-label">Expected Joining Date <span className="sf-optional">(optional)</span></label>
        <input
          id="st-join"
          type="date"
          value={data.joining_date}
          onChange={(e) => onChange("joining_date", e.target.value)}
          className="sf-input"
        />
      </div>
    </div>
  );
}
