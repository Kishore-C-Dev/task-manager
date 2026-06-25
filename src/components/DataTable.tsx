import React from 'react';
import { ColumnConfig, ActionConfig, EntityRecord } from '../types';

interface Props {
  columns: ColumnConfig[];
  actions: ActionConfig[];
  data: EntityRecord[];
  sortKey: string;
  sortDir: 'asc' | 'desc';
  onSort: (key: string) => void;
  onAction: (action: string, item: EntityRecord) => void;
}

const DataTable: React.FC<Props> = ({ columns, actions, data, sortKey, sortDir, onSort, onAction }) => {
  const handleAction = (action: string, confirm: string | undefined, item: EntityRecord) => {
    if (confirm && !window.confirm(confirm)) return;
    onAction(action, item);
  };

  return (
    <div className="table-container table-desktop">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable && onSort(col.key)}
                className={col.sortable ? 'sortable' : ''}
              >
                {col.header}
                {sortKey === col.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
            {actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.key}>{item[col.key] ?? ''}</td>
              ))}
              {actions.length > 0 && (
                <td className="action-cell">
                  {actions.map((action) => (
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
  );
};

export default DataTable;
