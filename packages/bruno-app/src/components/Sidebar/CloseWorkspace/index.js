import React from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { IconFolder } from '@tabler/icons';
import { closeWorkspaceAction } from 'providers/ReduxStore/slices/workspaces/actions';

const CloseWorkspace = ({ workspaceUid, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { workspaces } = useSelector((state) => state.workspaces);
  const workspace = workspaces.find((w) => w.uid === workspaceUid);

  const onConfirm = async () => {
    try {
      if (!workspace) {
        toast.error(t('CLOSE_WORKSPACE.WORKSPACE_NOT_FOUND'));
        onClose();
        return;
      }
      if (workspace.type === 'default') {
        toast.error(t('CLOSE_WORKSPACE.CANNOT_CLOSE_DEFAULT'));
        onClose();
        return;
      }

      await dispatch(closeWorkspaceAction(workspace.uid));
      toast.success(t('CLOSE_WORKSPACE.WORKSPACE_CLOSED'));
      onClose();
    } catch (error) {
      console.error('Error closing workspace:', error);
      toast.error(t('CLOSE_WORKSPACE.CLOSE_ERROR'));
    }
  };

  return (
    <Modal
      size="sm"
      title={t('CLOSE_WORKSPACE.TITLE')}
      confirmText={t('COMMON.CLOSE')}
      handleConfirm={onConfirm}
      handleCancel={onClose}
    >
      <div className="flex items-center">
        <IconFolder size={18} strokeWidth={1.5} />
        <span className="ml-2 mr-4 font-semibold">{workspace?.name}</span>
      </div>
      {workspace?.pathname && (
        <div className="break-words text-xs mt-1">{workspace.pathname}</div>
      )}
      <div className="mt-4">
        {t('CLOSE_WORKSPACE.CONFIRM_MESSAGE', { name: workspace?.name })}
      </div>
      <div className="mt-4">
        {t('CLOSE_WORKSPACE.INFO_MESSAGE')}
      </div>
    </Modal>
  );
};

export default CloseWorkspace;
