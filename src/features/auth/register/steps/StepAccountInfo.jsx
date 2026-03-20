import "./StepFields.css";

const FIELDS = [
  { key: "first_name", label: "First Name", type: "text", placeholder: "John", autoComplete: "given-name" },
  { key: "last_name",  label: "Last Name",  type: "text", placeholder: "Doe",  autoComplete: "family-name" },
  { key: "email",      label: "Email",      type: "email", placeholder: "you@example.com", autoComplete: "email" },
  { key: "phone_number", label: "Phone Number", type: "tel", placeholder: "+977 98XXXXXXXX", autoComplete: "tel", optional: true },
];

export default function StepAccountInfo({ data, onChange, errors = {} }) {
  return (
    <div>
      <div className="sf-grid-2">
        {["first_name", "last_name"].map((key) => {
          const f = FIELDS.find((f) => f.key === key);
          return (
            <div key={key} className="sf-group">
              <label htmlFor={`acc-${key}`} className="sf-label">{f.label}</label>
              <input
                id={`acc-${key}`}
                type={f.type}
                value={data[key]}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                className={`sf-input${errors[key] ? " has-error" : ""}`}
              />
              {errors[key] && <p className="sf-error">{errors[key]}</p>}
            </div>
          );
        })}
      </div>

      {["email", "phone_number"].map((key) => {
        const f = FIELDS.find((f) => f.key === key);
        return (
          <div key={key} className="sf-group">
            <label htmlFor={`acc-${key}`} className="sf-label">
              {f.label} {f.optional && <span className="sf-optional">(optional)</span>}
            </label>
            <input
              id={`acc-${key}`}
              type={f.type}
              value={data[key]}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
              className={`sf-input${errors[key] ? " has-error" : ""}`}
            />
            {errors[key] && <p className="sf-error">{errors[key]}</p>}
          </div>
        );
      })}

      <div className="sf-group">
        <label htmlFor="acc-password" className="sf-label">Password</label>
        <input
          id="acc-password"
          type="password"
          value={data.password}
          onChange={(e) => onChange("password", e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          className={`sf-input${errors.password ? " has-error" : ""}`}
        />
        {errors.password && <p className="sf-error">{errors.password}</p>}
      </div>

      <div className="sf-group">
        <label htmlFor="acc-confirm" className="sf-label">Confirm Password</label>
        <input
          id="acc-confirm"
          type="password"
          value={data.confirm_password}
          onChange={(e) => onChange("confirm_password", e.target.value)}
          placeholder="Repeat the password"
          autoComplete="new-password"
          className={`sf-input${errors.confirm_password ? " has-error" : ""}`}
        />
        {errors.confirm_password && <p className="sf-error">{errors.confirm_password}</p>}
      </div>
    </div>
  );
}
