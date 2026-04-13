import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import toast from 'react-hot-toast';
import '../../../i18n';
import ImportWorkspace from './index';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({
    app: {
      preferences: {
        general: {
          defaultLocation: ''
        }
      }
    }
  })
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn()
  }
}));
jest.mock('components/Help', () => ({ children }) => <div>{children}</div>);
jest.mock('components/Modal', () => ({ title, children, confirmText, handleConfirm, handleCancel }) => (
  <div>
    <div>{title}</div>
    {children}
    <button onClick={handleConfirm}>{confirmText}</button>
    <button onClick={handleCancel}>关闭</button>
  </div>
));

describe('ImportWorkspace', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    toast.error.mockReset();
    toast.success.mockReset();
    window.ipcRenderer = {
      getFilePath: jest.fn()
    };
  });

  it('renders Chinese import workspace labels and helper text', () => {
    render(<ImportWorkspace onClose={jest.fn()} />);

    expect(screen.getByText('导入工作区')).toBeInTheDocument();
    expect(screen.getByText('工作区文件')).toBeInTheDocument();
    expect(screen.getByText('将工作区 zip 文件拖到这里，或')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '选择文件' })).toBeInTheDocument();
    expect(screen.getByText('支持导出的 Bruno 工作区 zip 文件')).toBeInTheDocument();
    expect(screen.getByText('解压位置')).toBeInTheDocument();
    expect(screen.getByText('选择要解压此工作区的位置。')).toBeInTheDocument();
  });

  it('shows a Chinese toast when selecting a non-zip file', () => {
    const { container } = render(<ImportWorkspace onClose={jest.fn()} />);
    const fileInput = container.querySelector('input[type="file"]');

    fireEvent.change(fileInput, {
      target: {
        files: [new File(['demo'], 'workspace.txt', { type: 'text/plain' })]
      }
    });

    expect(toast.error).toHaveBeenCalledWith('请选择有效的 zip 文件');
  });
});
