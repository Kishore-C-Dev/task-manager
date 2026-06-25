import React, { useEffect, useState } from 'react';
import { FieldConfig } from '../types';
import { fetchOptions } from '../api/mockApi';

interface Props {
  field: FieldConfig;
  value: any;
  error?: string;
  onChange: (name: string, value: any) => void;
}

const DynamicField: React.FC<Props> = ({ field, value, error, onChange }) => {
  const [options, setOptions] = useState(field.options || []);
  const [multiSelectValue, setMultiSelectValue] = useState('');

  useEffect(() => {
    if (field.optionsEndpoint) {
      fetchOptions(field.optionsEndpoint).then(setOptions);
    }
  }, [field.optionsEndpoint]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = field.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    onChange(field.name, val);
  };

  const selectedItems: string[] = Array.isArray(value) ? value : [];

  const handleAddMultiSelect = () => {
    if (multiSelectValue && !selectedItems.includes(multiSelectValue)) {
      onChange(field.name, [...selectedItems, multiSelectValue]);
      setMultiSelectValue('');
    }
  };

  const handleRemoveMultiSelect = (item: string) => {
    onChange(field.name, selectedItems.filter((v) => v !== item));
  };

  const inputId = `field-${field.name}`;

  const renderInput = () => {
    switch (field.type) {
      case 'multiselect':
        return (
          <div className="multiselect-container">
            <div className="multiselect-input-row">
              <select
                value={multiSelectValue}
                onChange={(e) => setMultiSelectValue(e.target.value)}
                disabled={field.disabled}
                className="field-input multiselect-dropdown"
              >
                <option value="">{field.placeholder || 'Select...'}</option>
                {options
                  .filter((opt) => !selectedItems.includes(opt.value))
                  .map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
              </select>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddMultiSelect}
                disabled={!multiSelectValue}
              >
                Add
              </button>
            </div>
            {selectedItems.length > 0 && (
              <div className="multiselect-tags">
                {selectedItems.map((item) => {
                  const opt = options.find((o) => o.value === item);
                  return (
                    <span key={item} className="tag">
                      {opt?.label || item}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleRemoveMultiSelect(item)}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
      case 'select':
        return (
          <select id={inputId} value={value || ''} onChange={handleChange} disabled={field.disabled} className="field-input">
            <option value="">{field.placeholder || `Select...`}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            id={inputId}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className="field-input"
            rows={4}
          />
        );
      case 'checkbox':
        return (
          <label className="checkbox-label">
            <input
              id={inputId}
              type="checkbox"
              checked={!!value}
              onChange={handleChange}
              disabled={field.disabled}
            />
            <span>{field.label}</span>
          </label>
        );
      case 'radio':
        return (
          <div className="radio-group">
            {options.map((opt) => (
              <label key={opt.value} className="radio-label">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={handleChange}
                  disabled={field.disabled}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            id={inputId}
            type={field.type}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className="field-input"
          />
        );
    }
  };

  return (
    <div className={`field-group ${error ? 'field-error' : ''}`}>
      {field.type !== 'checkbox' && (
        <label htmlFor={inputId} className="field-label">
          {field.label}
          {field.validations?.required?.value && <span className="required-mark"> *</span>}
        </label>
      )}
      {renderInput()}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default DynamicField;
