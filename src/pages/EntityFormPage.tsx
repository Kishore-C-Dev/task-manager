import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormConfig, PageConfig } from '../types';
import { fetchOne, createItem, updateItem, fetchPageConfig, fetchFormConfig } from '../api/mockApi';
import DynamicForm from '../components/DynamicForm';

interface Props {
  entityKey: string;
}

const EntityFormPage: React.FC<Props> = ({ entityKey }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Record<string, any> | undefined>(undefined);
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [pageCfg, setPageCfg] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchFormConfig(entityKey), fetchPageConfig(entityKey)]).then(
      ([fCfg, pCfg]) => {
        setFormConfig(fCfg);
        setPageCfg(pCfg);
        if (id && pCfg) {
          fetchOne(pCfg.dataEndpoint, id).then((item) => {
            setInitialData(item);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }
    );
  }, [entityKey, id]);

  const handleSubmit = async (data: Record<string, any>) => {
    if (!pageCfg) return;
    if (id) {
      await updateItem(pageCfg.dataEndpoint, id, data);
    } else {
      await createItem(pageCfg.dataEndpoint, data);
    }
    navigate(`/${entityKey}`);
  };

  if (loading || !formConfig) return <p className="loading">Loading...</p>;

  return (
    <div className="form-page">
      <DynamicForm
        config={formConfig}
        entityKey={entityKey}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/${entityKey}`)}
      />
    </div>
  );
};

export default EntityFormPage;
