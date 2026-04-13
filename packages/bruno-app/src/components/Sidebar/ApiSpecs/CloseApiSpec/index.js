import React from 'react';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { useDispatch } from 'react-redux';
import { IconFileCode } from '@tabler/icons';
import { closeApiSpecFile } from 'providers/ReduxStore/slices/apiSpec';
import { useTranslation } from 'react-i18next';

const CloseApiSpec = ({ onClose, apiSpec }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onConfirm = () => {
    dispatch(closeApiSpecFile({ uid: apiSpec.uid }))
      .then(() => {
        toast.success(t('SIDEBAR.API_SPECS.API_SPEC_CLOSED'));
        onClose();
      })
      .catch(() => toast.error(t('SIDEBAR.API_SPECS.CLOSE_API_SPEC_ERROR')));
  };

  return (
    <Modal size="sm" title={t('SIDEBAR.API_SPECS.CLOSE_API_SPEC_TITLE')} confirmText={t('COMMON.CLOSE')} handleConfirm={onConfirm} handleCancel={onClose}>
      <div className="flex items-center">
        <IconFileCode size={18} strokeWidth={1.5} />
        <span className="ml-2 mr-4 font-semibold">{apiSpec.name}</span>
      </div>
      <div className="break-words text-xs mt-1">{apiSpec.pathname}</div>
      <div className="mt-4">
        {t('SIDEBAR.API_SPECS.CLOSE_API_SPEC_CONFIRM')} <span className="font-semibold">{apiSpec.name}</span>?
      </div>
      <div className="mt-4">
        {t('SIDEBAR.API_SPECS.CLOSE_API_SPEC_INFO')}
      </div>
    </Modal>
  );
};

export default CloseApiSpec;
