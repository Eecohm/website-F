import "./StepFields.css";

export default function StepAddress({ data, onChange, errors = {} }) {
  return (
    <div>
      <div className="sf-group">
        <label htmlFor="addr-line1" className="sf-label">Address Line 1 <span className="sf-optional">(optional)</span></label>
        <input
          id="addr-line1"
          type="text"
          value={data.address_line_1}
          onChange={(e) => onChange("address_line_1", e.target.value)}
          placeholder="House / Flat no., Street"
          className={`sf-input${errors.address_line_1 ? " has-error" : ""}`}
        />
        {errors.address_line_1 && <p className="sf-error">{errors.address_line_1}</p>}
      </div>

      <div className="sf-group">
        <label htmlFor="addr-line2" className="sf-label">Address Line 2 <span className="sf-optional">(optional)</span></label>
        <input
          id="addr-line2"
          type="text"
          value={data.address_line_2}
          onChange={(e) => onChange("address_line_2", e.target.value)}
          placeholder="Landmark, ward, etc."
          className="sf-input"
        />
      </div>

      <div className="sf-grid-2">
        <div className="sf-group">
          <label htmlFor="addr-city" className="sf-label">City <span className="sf-optional">(optional)</span></label>
          <input
            id="addr-city"
            type="text"
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="Kathmandu"
            className="sf-input"
          />
        </div>
        <div className="sf-group">
          <label htmlFor="addr-state" className="sf-label">State / Province <span className="sf-optional">(optional)</span></label>
          <input
            id="addr-state"
            type="text"
            value={data.state_or_province}
            onChange={(e) => onChange("state_or_province", e.target.value)}
            placeholder="Bagmati"
            className="sf-input"
          />
        </div>
      </div>

      <div className="sf-grid-2">
        <div className="sf-group">
          <label htmlFor="addr-postal" className="sf-label">Postal Code <span className="sf-optional">(optional)</span></label>
          <input
            id="addr-postal"
            type="text"
            value={data.postal_code}
            onChange={(e) => onChange("postal_code", e.target.value)}
            placeholder="44600"
            className="sf-input"
          />
        </div>
        <div className="sf-group">
          <label htmlFor="addr-country" className="sf-label">Country <span className="sf-optional">(optional)</span></label>
          <input
            id="addr-country"
            type="text"
            value={data.country}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Nepal"
            className="sf-input"
          />
        </div>
      </div>
    </div>
  );
}
