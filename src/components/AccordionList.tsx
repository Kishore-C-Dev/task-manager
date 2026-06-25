import React, { useState } from 'react';
import { TableConfig, EntityRecord } from '../types';

interface AccordionItemProps {
  item: EntityRecord;
  config: TableConfig;
  onAction: (action: string, item: EntityRecord) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, config, onAction }) => {
  const [open, setOpen] = useState(false);
  const titleKey = config.mobileAccordion?.titleKey || config.columns[0]?.key || 'id';
  const subtitleKey = config.mobileAccordion?.subtitleKey;

  const handleAction = (action: string, confirm: string | undefined) => {
    if (confirm && !window.confirm(confirm)) return;
    onAction(action, item);
  };

  return (
    <div className={`accordion-item ${open ? 'accordion-open' : ''}`}>
      <button className="accordion-header" onClick={() => setOpen(!open)}>
        <div className="accordion-title-row">
          <span className="accordion-title">{item[titleKey] ?? ''}</span>
          {subtitleKey && <span className="accordion-subtitle">{item[subtitleKey] ?? ''}</span>}
        </div>
        <span className="accordion-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="accordion-body">
          {config.columns
            .filter((col) => col.key !== titleKey)
            .map((col) => (
              <div key={col.key} className="accordion-row">
                <span className="accordion-label">{col.header}</span>
                <span className="accordion-value">{item[col.key] ?? ''}</span>
              </div>
            ))}
          {config.actions.length > 0 && (
            <div className="accordion-actions">
              {config.actions.map((action) => (
                <button
                  key={action.key}
                  className={`btn btn-sm ${action.key === 'delete' ? 'btn-danger' : 'btn-link'}`}
                  onClick={() => handleAction(action.key, action.confirm)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface Props {
  config: TableConfig;
  data: EntityRecord[];
  onAction: (action: string, item: EntityRecord) => void;
}

const AccordionList: React.FC<Props> = ({ config, data, onAction }) => {
  return (
    <div className="accordion-container table-mobile">
      {data.map((item) => (
        <AccordionItem key={item.id} item={item} config={config} onAction={onAction} />
      ))}
    </div>
  );
};

export default AccordionList;
