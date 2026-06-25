import React, { useState, useEffect, useCallback } from 'react';
import { FormConfig, FieldConfig, VisibleWhen } from '../types';
import { validateField, runSubmitValidations } from '../utils/validator';
import DynamicField from './DynamicField';

interface Props {
  config: FormConfig;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
}

const DynamicForm: React.FC<Props> = ({ config, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const allFields: FieldConfig[] = config.sections.flatMap((s) => s.fields);

  useEffect(() => {
    const defaults: Record<string, any> = {};
    config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type === 'multiselect') {
          defaults[field.name] = initialData?.[field.name] ?? [];
        } else {
          defaults[field.name] = initialData?.[field.name] ?? field.defaultValue ?? '';
        }
      });
    });
    setFormData(defaults);
  }, [config, initialData]);

  const isFieldVisible = useCallback((condition: VisibleWhen | undefined, data: Record<string, any>): boolean => {
    if (!condition) return true;
    const currentVal = String(data[condition.field] || '');
    const equalsArr = Array.isArray(condition.equals) ? condition.equals : [condition.equals];
    return equalsArr.includes(currentVal);
  }, []);

  const getVisibleFields = useCallback((): FieldConfig[] => {
    return allFields.filter((f) => isFieldVisible(f.visibleWhen, formData));
  }, [allFields, formData, isFieldVisible]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    const field = allFields.find((f) => f.name === name);
    if (field && isFieldVisible(field.visibleWhen, { ...formData, [name]: value })) {
      const err = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next[name] = err;
        else delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const visibleFields = getVisibleFields();

    const fieldErrors: Record<string, string> = {};
    visibleFields.forEach((field) => {
      const err = validateField(field, formData[field.name]);
      if (err) fieldErrors[field.name] = err;
    });

    const submitErrors = config.submitValidations
      ? runSubmitValidations(config.submitValidations, formData)
      : {};

    const allErrors = { ...fieldErrors, ...submitErrors };
    setErrors(allErrors);

    const allTouched: Record<string, boolean> = {};
    visibleFields.forEach((f) => (allTouched[f.name] = true));
    setTouched(allTouched);

    if (Object.keys(allErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dynamic-form" noValidate>
      <h2 className="form-title">{config.title}</h2>
      {config.sections.map((section, si) => {
        const visibleSectionFields = section.fields.filter((f) =>
          isFieldVisible(f.visibleWhen, formData)
        );
        if (visibleSectionFields.length === 0) return null;
        return (
          <fieldset key={si} className="form-section">
            <legend className="section-title">{section.title}</legend>
            <div className={`fields-grid fields-grid-${section.columns || 2}`}>
              {visibleSectionFields.map((field) => (
                <DynamicField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  error={touched[field.name] ? errors[field.name] : undefined}
                  onChange={handleChange}
                />
              ))}
            </div>
          </fieldset>
        );
      })}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{config.submitButton.label}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>{config.cancelButton.label}</button>
      </div>
    </form>
  );
};

export default DynamicForm;
