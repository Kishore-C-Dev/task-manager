export interface ValidationRule {
  value: boolean | number | string;
  message: string;
}

export interface CustomValidation {
  validatorName: string;
  message: string;
}

export interface FieldValidations {
  required?: ValidationRule;
  minLength?: ValidationRule;
  maxLength?: ValidationRule;
  pattern?: ValidationRule;
  min?: ValidationRule;
  max?: ValidationRule;
  minItems?: ValidationRule;
  custom?: CustomValidation;
}

export interface VisibleWhen {
  field: string;
  equals: string | string[];
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox' | 'radio' | 'email' | 'tel' | 'multiselect';
  placeholder?: string;
  options?: { label: string; value: string }[];
  optionsEndpoint?: string;
  defaultValue?: string | number | boolean;
  validations?: FieldValidations;
  disabled?: boolean;
  visibleWhen?: VisibleWhen;
  fullWidth?: boolean;
}

export interface FormSection {
  title: string;
  columns?: 1 | 2 | 3;
  fields: FieldConfig[];
}

export interface ConditionalRequired {
  type: 'conditionalRequired';
  if: { field: string; equals: string | string[] };
  then: { field: string; required: boolean };
  message: string;
}

export interface CrossFieldValidation {
  type: 'crossField';
  fields: string[];
  rule: string;
  message: string;
}

export type SubmitValidation = ConditionalRequired | CrossFieldValidation;

export interface ButtonConfig {
  label: string;
}

export interface QuestionnaireConfig {
  triggerField: string;
  endpoint: string;
  title: string;
}

export interface FormConfig {
  title: string;
  sections: FormSection[];
  questionnaire?: QuestionnaireConfig;
  submitValidations?: SubmitValidation[];
  submitButton: ButtonConfig;
  cancelButton: ButtonConfig;
}

export interface ColumnConfig {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'number';
}

export interface ActionConfig {
  key: string;
  label: string;
  confirm?: string;
}

export interface TableConfig {
  columns: ColumnConfig[];
  actions: ActionConfig[];
  emptyMessage: string;
  pageSize: number;
  defaultSortColumn?: string;
  defaultSortDirection?: 'asc' | 'desc';
  mobileAccordion: {
    titleKey: string;
    subtitleKey?: string;
  };
}

export interface FilterField {
  name: string;
  label: string;
  type: 'select' | 'text' | 'date';
  placeholder?: string;
  optionsEndpoint?: string;
  options?: { label: string; value: string }[];
}

export interface FilterConfig {
  filters: FilterField[];
  applyButtonLabel: string;
  resetButtonLabel: string;
}

export interface PageConfig {
  title: string;
  createButtonLabel: string;
  table: TableConfig;
  dataEndpoint: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface AppConfig {
  app: {
    title: string;
    navigation: NavItem[];
  };
  pages: Record<string, Record<string, never>>;
}

export type EntityRecord = Record<string, any> & { id: string };
