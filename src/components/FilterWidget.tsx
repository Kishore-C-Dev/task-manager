import React, { useEffect, useState } from 'react';
import { FilterConfig, FilterField } from '../types';
import { fetchOptions } from '../api/mockApi';

interface Props {
  config: FilterConfig;
  onApply: (filters: Record<string, string>) => void;
}

const FilterFieldInput: React.FC<{
  field: FilterField;
  value: string;
  onChange: (name: string, value: string) => void;
}> = ({ field, value, onChange }) => {
  const [options, setOptions] = useState(field.options || []);

  useEffect(() => {
    if (field.optionsEndpoint) {
      fetchOptions(field.optionsEndpoint).then(setOptions);
    }
  }, [field.optionsEndpoint]);

  if (field.type === 'select') {
    return (
      <div className="filter-field">
        <label className="filter-label">{field.label}</label>
        <select
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="filter-input"
        >
          <option value="">{field.placeholder || 'All'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="filter-field">
      <label className="filter-label">{field.label}</label>
      <input
        type={field.type}
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        className="filter-input"
      />
    </div>
  );
};

const FilterWidget: React.FC<Props> = ({ config, onApply }) => {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(values);
  };

  const handleReset = () => {
    setValues({});
    onApply({});
  };

  return (
    <div className="filter-widget">
      <div className="filter-fields">
        {config.filters.map((field) => (
          <FilterFieldInput
            key={field.name}
            field={field}
            value={values[field.name] || ''}
            onChange={handleChange}
          />
        ))}
      </div>
      <div className="filter-actions">
        <button className="btn btn-primary btn-sm" onClick={handleApply}>
          {config.applyButtonLabel}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={handleReset}>
          {config.resetButtonLabel}
        </button>
      </div>
    </div>
  );
};

export default FilterWidget;
