import React from 'react';
import { IconPlus, IconDownload, IconSettings } from '@tabler/icons';
import ToolHint from 'components/ToolHint';
import ColorBadge from 'components/ColorBadge';
import { useTranslation } from 'react-i18next';

const EnvironmentListContent = ({
  environments,
  activeEnvironmentUid,
  description,
  onEnvironmentSelect,
  onSettingsClick,
  onCreateClick,
  onImportClick
}) => {
  const { t } = useTranslation();
  return (
    <div>
      {environments && environments.length > 0 ? (
        <>
          <div className="environment-list">
            <div className="dropdown-item no-environment" onClick={() => onEnvironmentSelect(null)}>
              <span>{t('ENVIRONMENTS.ENV_LIST_CONTENT.NO_ENVIRONMENT')}</span>
            </div>
            <ToolHint
              anchorSelect="[data-tooltip-content]"
              place="right"
              positionStrategy="fixed"
              tooltipStyle={{
                maxWidth: '200px',
                wordWrap: 'break-word'
              }}
              delayShow={1000}
            >
              <div>
                {environments.map((env) => (
                  <div
                    key={env.uid}
                    className={`dropdown-item ${env.uid === activeEnvironmentUid ? 'dropdown-item-active' : ''}`}
                    onClick={() => onEnvironmentSelect(env)}
                    data-tooltip-content={env.name}
                    data-tooltip-hidden={env.name?.length < 90}
                  >
                    <ColorBadge color={env.color} size={8} />
                    <span className="max-w-100% truncate no-wrap">{env.name}</span>
                  </div>
                ))}
              </div>
            </ToolHint>
            <div className="dropdown-item configure-button">
              <button onClick={onSettingsClick} id="configure-env" data-testid="configure-env">
                <IconSettings size={16} strokeWidth={1.5} />
                <span>{t('ENVIRONMENTS.ENV_LIST_CONTENT.CONFIGURE')}</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>{t('ENVIRONMENTS.ENV_LIST_CONTENT.READY_TO_GET_STARTED')}</h3>
          <p>{description}</p>
          <div className="space-y-2">
            <button onClick={onCreateClick} id="create-env">
              <IconPlus size={16} strokeWidth={1.5} />
              {t('ENVIRONMENTS.ENV_LIST_CONTENT.CREATE')}
            </button>
            <button onClick={onImportClick} id="import-env">
              <IconDownload size={16} strokeWidth={1.5} />
              {t('ENVIRONMENTS.ENV_LIST_CONTENT.IMPORT')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentListContent;
