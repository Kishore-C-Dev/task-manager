import React from 'react';

interface Props {
  title: string;
  actionLabel: string;
  onAction: () => void;
}

const PageHeader: React.FC<Props> = ({ title, actionLabel, onAction }) => {
  return (
    <div className="page-header">
      <h2 className="page-title">{title}</h2>
      <button className="btn btn-primary" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );
};

export default PageHeader;
