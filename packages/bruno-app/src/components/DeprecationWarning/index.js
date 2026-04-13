import React from 'react';
import { useTranslation } from 'react-i18next';
import IconAlertTriangleFilled from '../Icons/IconAlertTriangleFilled';
import StyledWrapper from './StyledWrapper';

const DeprecationWarning = ({ featureName, learnMoreUrl }) => {
  const { t } = useTranslation();
  return (
    <StyledWrapper>
      <div className="deprecation-warning">
        <IconAlertTriangleFilled className="warning-icon" size={16} />
        <span className="warning-text">
          {t('DEPRECATION_WARNING.WILL_BE_REMOVED', { featureName })} <strong>v3.0.0</strong>. {t('DEPRECATION_WARNING.DEPRECATED_DESC')}{' '}
          <a href={learnMoreUrl} target="_blank" rel="noreferrer">{t('DEPRECATION_WARNING.THIS_POST')}</a> {t('DEPRECATION_WARNING.OR_CONTACT_US')}{' '}
          <a href="mailto:support@usebruno.com">support@usebruno.com</a> {t('DEPRECATION_WARNING.WITH_QUESTIONS')}
        </span>
      </div>
    </StyledWrapper>
  );
};

export default DeprecationWarning;
