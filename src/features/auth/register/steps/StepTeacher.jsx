import "./StepFields.css";

export default function StepTeacher({ data, onChange, errors = {} }) {
  return (
    <div>
      <div className="sf-group">
        <label htmlFor="t-spec" className="sf-label">Subject Specialization</label>
        <input
          id="t-spec"
          type="text"
          value={data.specialization}
          onChange={(e) => onChange("specialization", e.target.value)}
          placeholder="e.g. Mathematics, Physics"
          className={`sf-input${errors.specialization ? " has-error" : ""}`}
        />
        {errors.specialization && <p className="sf-error">{errors.specialization}</p>}
      </div>

      <div className="sf-group">
        <label htmlFor="t-qual" className="sf-label">Highest Qualification</label>
        <input
          id="t-qual"
          type="text"
          value={data.qualification}
          onChange={(e) => onChange("qualification", e.target.value)}
          placeholder="e.g. M.Ed, B.Sc"
          className={`sf-input${errors.qualification ? " has-error" : ""}`}
        />
        {errors.qualification && <p className="sf-error">{errors.qualification}</p>}
      </div>

      <div className="sf-group">
        <label htmlFor="t-join" className="sf-label">Expected Joining Date <span className="sf-optional">(optional)</span></label>
        <input
          id="t-join"
          type="date"
          value={data.joining_date}
          onChange={(e) => onChange("joining_date", e.target.value)}
          className="sf-input"
        />
      </div>
    </div>
  );
}
