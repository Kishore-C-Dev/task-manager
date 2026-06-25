import React, { useState } from 'react';
import { TableConfig, EntityRecord } from '../types';

interface Props {
  config: TableConfig;
  data: EntityRecord[];
  onAction: (action: string, item: EntityRecord) => void;
}

const AccordionItem: React.FC<{
  item: EntityRecord;
  config: TableConfig;
  onAction: (action: string, item: EntityRecord) => void;
}> = ({ item, config, onAction }) => {
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

const DynamicTable: React.FC<Props> = ({ config, data, onAction }) => {
  const [sortKey, setSortKey] = useState<string>(config.defaultSortColumn || '');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(config.defaultSortDirection || 'asc');
  const [page, setPage] = useState(0);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  let sorted = [...data];
  if (sortKey) {
    sorted.sort((a, b) => {
      const va = a[sortKey] ?? '';
      const vb = b[sortKey] ?? '';
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / config.pageSize));
  const paged = sorted.slice(page * config.pageSize, (page + 1) * config.pageSize);

  const handleAction = (action: string, confirm: string | undefined, item: EntityRecord) => {
    if (confirm && !window.confirm(confirm)) return;
    onAction(action, item);
  };

  if (data.length === 0) {
    return <p className="empty-message">{config.emptyMessage}</p>;
  }

  return (
    <>
      <div className="table-container table-desktop">
        <table className="data-table">
          <thead>
            <tr>
              {config.columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={col.sortable ? 'sortable' : ''}
                >
                  {col.header}
                  {sortKey === col.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
              {config.actions.length > 0 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paged.map((item) => (
              <tr key={item.id}>
                {config.columns.map((col) => (
                  <td key={col.key}>{item[col.key] ?? ''}</td>
                ))}
                {config.actions.length > 0 && (
                  <td className="action-cell">
                    {config.actions.map((action) => (
                      <button
                        key={action.key}
                        className={`btn btn-sm ${action.key === 'delete' ? 'btn-danger' : 'btn-link'}`}
                        onClick={() => handleAction(action.key, action.confirm, item)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="accordion-container table-mobile">
        {paged.map((item) => (
          <AccordionItem key={item.id} item={item} config={config} onAction={onAction} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn btn-sm">Prev</button>
          <span>{page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="btn btn-sm">Next</button>
        </div>
      )}
    </>
  );
};

export default DynamicTable;
