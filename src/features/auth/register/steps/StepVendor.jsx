import "./StepFields.css";

export default function StepVendor({ data, onChange, errors = {} }) {
  return (
    <div>
      <div className="sf-group">
        <label htmlFor="v-company" className="sf-label">Company / Business Name</label>
        <input
          id="v-company"
          type="text"
          value={data.company_name}
          onChange={(e) => onChange("company_name", e.target.value)}
          placeholder="e.g. Sunshine Supplies Pvt. Ltd."
          className={`sf-input${errors.company_name ? " has-error" : ""}`}
        />
        {errors.company_name && <p className="sf-error">{errors.company_name}</p>}
      </div>

      <div className="sf-group">
        <label htmlFor="v-service" className="sf-label">Service Type</label>
        <input
          id="v-service"
          type="text"
          value={data.service_type}
          onChange={(e) => onChange("service_type", e.target.value)}
          placeholder="e.g. Stationery, Lab Equipment"
          className={`sf-input${errors.service_type ? " has-error" : ""}`}
        />
        {errors.service_type && <p className="sf-error">{errors.service_type}</p>}
      </div>

      <div className="sf-group">
        <label htmlFor="v-tax" className="sf-label">Tax / PAN ID <span className="sf-optional">(optional)</span></label>
        <input
          id="v-tax"
          type="text"
          value={data.tax_id}
          onChange={(e) => onChange("tax_id", e.target.value)}
          placeholder="e.g. 123456789"
          className="sf-input"
        />
      </div>
    </div>
  );
}
