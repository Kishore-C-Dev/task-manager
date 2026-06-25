import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageConfig, FilterConfig, EntityRecord } from '../types';
import { fetchList, deleteItem, fetchPageConfig, fetchFilterConfig } from '../api/mockApi';
import PageHeader from '../components/PageHeader';
import FilterWidget from '../components/FilterWidget';
import DynamicTable from '../components/DynamicTable';

interface Props {
  entityKey: string;
}

const EntityListPage: React.FC<Props> = ({ entityKey }) => {
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
  const [filterConfig, setFilterConfig] = useState<FilterConfig | null>(null);
  const [data, setData] = useState<EntityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchPageConfig(entityKey), fetchFilterConfig(entityKey)]).then(
      ([pCfg, fCfg]) => {
        setPageConfig(pCfg);
        setFilterConfig(fCfg);
      }
    );
  }, [entityKey]);

  const loadData = useCallback(
    (filters?: Record<string, string>) => {
      if (!pageConfig) return;
      setLoading(true);
      fetchList(pageConfig.dataEndpoint, filters).then((items) => {
        setData(items);
        setLoading(false);
      });
    },
    [pageConfig]
  );

  useEffect(() => {
    if (pageConfig) loadData();
  }, [pageConfig, loadData]);

  const handleAction = async (action: string, item: EntityRecord) => {
    if (!pageConfig) return;
    if (action === 'edit') {
      navigate(`/${entityKey}/edit/${item.id}`);
    } else if (action === 'delete') {
      await deleteItem(pageConfig.dataEndpoint, item.id);
      loadData();
    }
  };

  if (!pageConfig) return <p className="loading">Loading...</p>;

  return (
    <div className="list-page">
      <PageHeader
        title={pageConfig.title}
        actionLabel={pageConfig.createButtonLabel}
        onAction={() => navigate(`/${entityKey}/new`)}
      />
      {filterConfig && (
        <FilterWidget config={filterConfig} onApply={loadData} />
      )}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <DynamicTable config={pageConfig.table} data={data} onAction={handleAction} />
      )}
    </div>
  );
};

export default EntityListPage;
