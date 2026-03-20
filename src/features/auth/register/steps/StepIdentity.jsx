import React, { useRef, useState, useEffect } from 'react';
import './StepFields.css';

const DOC_TYPES = [
  { value: "national_id", label: "National ID / Citizenship / NID" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "birth_certificate", label: "Birth Certificate" },
  { value: "other", label: "Other Document" },
];

export default function StepIdentity({ data, onChange, errors, existingDocs }) {
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const handlePhotoChange = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5MB');
      return;
    }
    onChange(field, file);
  };

  const hasExisting = existingDocs && existingDocs.length > 0;

  return (
    <div>
      {hasExisting && (
        <div style={{ background: '#f0fdf4', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bbf7d0', fontSize: '14px' }}>
          <strong>Note:</strong> You have already submitted {existingDocs.length} identity document(s). Uploading new documents here will add to your file. Leave blank if you do not wish to add more.
        </div>
      )}

      <div className="sf-grid-2">
        <div className="sf-group">
          <label htmlFor="id-type" className="sf-label">Document Type {!hasExisting && <span style={{color:'red'}}>*</span>}</label>
          <div className="sf-select-wrap">
            <select
              id="id-type"
              value={data.document_type || 'national_id'}
              onChange={(e) => onChange("document_type", e.target.value)}
              className={`sf-select${errors?.document_type ? ' has-error' : ''}`}
            >
              {DOC_TYPES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {errors?.document_type && <p className="sf-error">{errors.document_type}</p>}
        </div>

        <div className="sf-group">
          <label htmlFor="id-number" className="sf-label">Document Number {!hasExisting && <span style={{color:'red'}}>*</span>}</label>
          <input
            id="id-number"
            type="text"
            value={data.document_number || ''}
            onChange={(e) => onChange("document_number", e.target.value)}
            placeholder="e.g. 12-34-56"
            className={`sf-input${errors?.document_number ? ' has-error' : ''}`}
          />
          {errors?.document_number && <p className="sf-error">{errors.document_number}</p>}
        </div>
      </div>

      <div className="sf-group" style={{ marginBottom: '16px' }}>
        <label className="sf-label">Front Image {!hasExisting && <span style={{color:'red'}}>*</span>}</label>
        <div style={{ padding: '20px', border: '2px dashed var(--border)', borderRadius: '8px', textAlign: 'center', background: '#fafafa' }}>
           {data.front_image ? (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
               <img src={URL.createObjectURL(data.front_image)} alt="Front" style={{ height: '140px', objectFit: 'contain', borderRadius: '4px' }} />
               <button type="button" onClick={() => frontRef.current?.click()} style={{ fontSize: '12px', padding: '4px 12px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Change Front Image</button>
             </div>
           ) : (
             <div>
               <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)' }}>Upload a readable photo of the front of your document</p>
               <button type="button" onClick={() => frontRef.current?.click()} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Choose File</button>
             </div>
           )}
           <input ref={frontRef} type="file" accept="image/*" onChange={(e) => handlePhotoChange("front_image", e)} style={{ display: 'none' }} />
        </div>
        {errors?.front_image && <p className="sf-error">{errors.front_image}</p>}
      </div>

      <div className="sf-group">
        <label className="sf-label">Back Image <span className="sf-optional">(optional)</span></label>
        <div style={{ padding: '20px', border: '2px dashed var(--border)', borderRadius: '8px', textAlign: 'center', background: '#fafafa' }}>
           {data.back_image ? (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
               <img src={URL.createObjectURL(data.back_image)} alt="Back" style={{ height: '140px', objectFit: 'contain', borderRadius: '4px' }} />
               <button type="button" onClick={() => backRef.current?.click()} style={{ fontSize: '12px', padding: '4px 12px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Change Back Image</button>
             </div>
           ) : (
             <div>
               <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)' }}>Upload a readable photo of the back of your document</p>
               <button type="button" onClick={() => backRef.current?.click()} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Choose File</button>
             </div>
           )}
           <input ref={backRef} type="file" accept="image/*" onChange={(e) => handlePhotoChange("back_image", e)} style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  );
}
