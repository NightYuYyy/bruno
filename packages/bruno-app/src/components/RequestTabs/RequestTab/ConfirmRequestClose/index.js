import React from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import Modal from 'components/Modal';
import Button from 'ui/Button';
import { useTranslation } from 'react-i18next';

const ConfirmRequestClose = ({ item, example, onCancel, onCloseWithoutSave, onSaveAndClose }) => {
  const { t } = useTranslation();
  const isExample = !!example;
  const itemName = isExample ? example.name : item.name;
  const itemType = isExample ? t('CONFIRM_REQUEST_CLOSE.ITEM_TYPE_EXAMPLE') : t('CONFIRM_REQUEST_CLOSE.ITEM_TYPE_REQUEST');

  return (
    <Modal
      size="md"
      title={t('CONFIRM_REQUEST_CLOSE.TITLE')}
      confirmText={t('CONFIRM_REQUEST_CLOSE.SAVE_AND_CLOSE')}
      cancelText={t('CONFIRM_REQUEST_CLOSE.CLOSE_WITHOUT_SAVING')}
      disableEscapeKey={true}
      disableCloseOnOutsideClick={true}
      closeModalFadeTimeout={150}
      handleCancel={onCancel}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      hideFooter={true}
    >
      <div className="flex items-center font-normal">
        <IconAlertTriangle size={32} strokeWidth={1.5} className="text-yellow-600" />
        <h1 className="ml-2 text-lg font-medium">{t('CONFIRM_REQUEST_CLOSE.HOLD_ON')}</h1>
      </div>
      <div className="font-normal mt-4">
        {t('CONFIRM_REQUEST_CLOSE.UNSAVED_CHANGES', { itemType })} <span className="font-medium">{itemName}</span>.
      </div>

      <div className="flex justify-between mt-6">
        <div>
          <Button color="danger" onClick={onCloseWithoutSave}>
            {t('CONFIRM_REQUEST_CLOSE.DONT_SAVE')}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" color="secondary" variant="ghost" onClick={onCancel}>
            {t('COMMON.CANCEL')}
          </Button>
          <Button onClick={onSaveAndClose}>{t('COMMON.SAVE')}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmRequestClose;
