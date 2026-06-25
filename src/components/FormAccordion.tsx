import React, { useState } from 'react';
import { FormSection } from '../types';
import DynamicField from './DynamicField';

interface Props {
  section: FormSection;
  formData: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (name: string, value: any) => void;
}

const FormAccordion: React.FC<Props> = ({ section, formData, errors, touched, onChange }) => {
  const [open, setOpen] = useState(false);

  const hasErrors = section.fields.some((f) => touched[f.name] && errors[f.name]);

  return (
    <div className={`form-accordion ${open ? 'form-accordion-open' : ''} ${hasErrors ? 'form-accordion-error' : ''}`}>
      <button type="button" className="form-accordion-header" onClick={() => setOpen(!open)}>
        <span className="form-accordion-title">
          {section.title}
          {hasErrors && <span className="required-mark"> !</span>}
        </span>
        <span className="accordion-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="form-accordion-body">
          <div className={`fields-grid fields-grid-${section.columns || 1}`}>
            {section.fields.map((field) => (
              <DynamicField
                key={field.name}
                field={field}
                value={formData[field.name]}
                error={touched[field.name] ? errors[field.name] : undefined}
                onChange={onChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAccordion;
