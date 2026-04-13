import React from 'react';
import { IconFileOff } from '@tabler/icons';
import { useTranslation } from 'react-i18next';

const DotEnvEmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className="empty-state">
      <IconFileOff size={48} strokeWidth={1.5} />
      <div className="title">{t('ENVIRONMENTS.DOT_ENV_EMPTY_STATE.NO_DOT_ENV_FILE')}</div>
      <div className="description">
        {t('ENVIRONMENTS.DOT_ENV_EMPTY_STATE.ADD_VARIABLE_TO_CREATE')}
      </div>
    </div>
  );
};

export default DotEnvEmptyState;
