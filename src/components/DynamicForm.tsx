import React, { useState, useEffect, useCallback } from 'react';
import { FormConfig, FormSection, FieldConfig, VisibleWhen } from '../types';
import { validateField, runSubmitValidations } from '../utils/validator';
import DynamicField from './DynamicField';
import FormAccordion from './FormAccordion';

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
  const [questionnaireSections, setQuestionnaireSections] = useState<FormSection[]>([]);

  const allFields: FieldConfig[] = config.sections.flatMap((s) => s.fields);
  const questionnaireFields: FieldConfig[] = questionnaireSections.flatMap((s) => s.fields);
  const combinedFields = [...allFields, ...questionnaireFields];

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

  const qConfig = config.questionnaire;
  const triggerValue = qConfig ? formData[qConfig.triggerField] : undefined;

  useEffect(() => {
    if (!qConfig) {
      setQuestionnaireSections([]);
      return;
    }
    if (!triggerValue) {
      setQuestionnaireSections([]);
      return;
    }
    const url = qConfig.endpoint.replace('{value}', triggerValue);
    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.sections) {
          setQuestionnaireSections(data.sections);
          setFormData((prev) => {
            const updated = { ...prev };
            data.sections.forEach((section: FormSection) => {
              section.fields.forEach((field: FieldConfig) => {
                if (!(field.name in updated)) {
                  updated[field.name] = field.type === 'multiselect' ? [] : (field.defaultValue ?? '');
                }
              });
            });
            return updated;
          });
        } else {
          setQuestionnaireSections([]);
        }
      });
  }, [qConfig, triggerValue]);

  const isFieldVisible = useCallback((condition: VisibleWhen | undefined, data: Record<string, any>): boolean => {
    if (!condition) return true;
    const currentVal = String(data[condition.field] || '');
    const equalsArr = Array.isArray(condition.equals) ? condition.equals : [condition.equals];
    return equalsArr.includes(currentVal);
  }, []);

  const getVisibleFields = useCallback((): FieldConfig[] => {
    return combinedFields.filter((f) => isFieldVisible(f.visibleWhen, formData));
  }, [combinedFields, formData, isFieldVisible]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    const field = combinedFields.find((f) => f.name === name);
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

        const chunks: { group?: string; fields: typeof visibleSectionFields }[] = [];
        visibleSectionFields.forEach((field) => {
          const lastChunk = chunks[chunks.length - 1];
          if (field.group) {
            if (lastChunk && lastChunk.group === field.group) {
              lastChunk.fields.push(field);
            } else {
              chunks.push({ group: field.group, fields: [field] });
            }
          } else {
            if (lastChunk && !lastChunk.group) {
              lastChunk.fields.push(field);
            } else {
              chunks.push({ fields: [field] });
            }
          }
        });

        const cols = section.columns || 2;

        return (
          <fieldset key={si} className="form-section">
            <legend className="section-title">{section.title}</legend>
            {chunks.map((chunk, ci) => (
              <div key={ci} className={`field-chunk ${chunk.group ? 'field-group-block' : ''}`}>
                {chunk.group && (
                  <div className="field-group-label">{chunk.group}</div>
                )}
                <div className={`fields-grid fields-grid-${cols}`}>
                  {chunk.fields.map((field) => (
                    <DynamicField
                      key={field.name}
                      field={field}
                      value={formData[field.name]}
                      error={touched[field.name] ? errors[field.name] : undefined}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        );
      })}

      {questionnaireSections.length > 0 && (
        <div className="questionnaire-section">
          <h3 className="questionnaire-title">{qConfig!.title}</h3>
          {questionnaireSections.map((section, si) => (
            <FormAccordion
              key={`q-${si}`}
              section={section}
              formData={formData}
              errors={errors}
              touched={touched}
              onChange={handleChange}
            />
          ))}
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{config.submitButton.label}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>{config.cancelButton.label}</button>
      </div>
    </form>
  );
};

export default DynamicForm;
