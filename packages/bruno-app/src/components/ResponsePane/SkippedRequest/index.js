import React from 'react';
import { IconCircleOff } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import StyledWrapper from './StyledWrapper';

const SkippedRequest = () => {
  const { t } = useTranslation();
  return (
    <StyledWrapper>
      <div className="send-icon flex justify-center" style={{ fontSize: 200 }}>
        <IconCircleOff size={150} strokeWidth={1} />
      </div>
      <div className="flex mt-4 justify-center" style={{ fontSize: 25 }}>
        {t('RESPONSE_PANE.SKIPPED_REQUEST.REQUEST_SKIPPED')}
      </div>
    </StyledWrapper>
  );
};

export default SkippedRequest;
