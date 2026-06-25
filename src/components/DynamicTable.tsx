import React, { useState } from 'react';
import { TableConfig, EntityRecord } from '../types';
import DataTable from './DataTable';
import AccordionList from './AccordionList';
import Pagination from './Pagination';

interface Props {
  config: TableConfig;
  data: EntityRecord[];
  onAction: (action: string, item: EntityRecord) => void;
}

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

  if (data.length === 0) {
    return <p className="empty-message">{config.emptyMessage}</p>;
  }

  return (
    <>
      <DataTable
        columns={config.columns}
        actions={config.actions}
        data={paged}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        onAction={onAction}
      />
      <AccordionList config={config} data={paged} onAction={onAction} />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
};

export default DynamicTable;
