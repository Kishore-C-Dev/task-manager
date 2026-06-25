import { FieldConfig, SubmitValidation } from '../types';

export function validateField(field: FieldConfig, value: any): string | null {
  const v = field.validations;
  if (!v) return null;

  const strVal = value == null ? '' : String(value);

  if (v.required && v.required.value) {
    if (Array.isArray(value)) {
      if (value.length === 0) return v.required.message;
    } else if (strVal.trim() === '') {
      return v.required.message;
    }
  }

  if (Array.isArray(value)) {
    if (v.minItems && value.length < Number(v.minItems.value)) {
      return v.minItems.message;
    }
    return null;
  }

  if (strVal === '') return null;

  if (v.minLength && strVal.length < Number(v.minLength.value)) {
    return v.minLength.message;
  }

  if (v.maxLength && strVal.length > Number(v.maxLength.value)) {
    return v.maxLength.message;
  }

  if (v.pattern) {
    const regex = new RegExp(String(v.pattern.value));
    if (!regex.test(strVal)) {
      return v.pattern.message;
    }
  }

  if (v.min && Number(value) < Number(v.min.value)) {
    return v.min.message;
  }

  if (v.max && Number(value) > Number(v.max.value)) {
    return v.max.message;
  }

  return null;
}

export function runSubmitValidations(
  validations: SubmitValidation[],
  formData: Record<string, any>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const rule of validations) {
    if (rule.type === 'conditionalRequired') {
      const condField = String(formData[rule.if.field]);
      const equalsValues = Array.isArray(rule.if.equals) ? rule.if.equals : [rule.if.equals];
      if (equalsValues.includes(condField)) {
        const targetVal = formData[rule.then.field];
        const isEmpty = Array.isArray(targetVal)
          ? targetVal.length === 0
          : (!targetVal || String(targetVal).trim() === '');
        if (rule.then.required && isEmpty) {
          errors[rule.then.field] = rule.message;
        }
      }
    }

    if (rule.type === 'crossField') {
      const [fieldA, fieldB] = rule.fields;
      const valA = formData[fieldA];
      const valB = formData[fieldB];
      if (valA && valB) {
        if (rule.rule.includes('>=') && new Date(valB) < new Date(valA)) {
          errors[fieldB] = rule.message;
        }
      }
    }
  }

  return errors;
}
