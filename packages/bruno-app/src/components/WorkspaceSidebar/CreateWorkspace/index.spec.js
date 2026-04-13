import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '../../../i18n';
import CreateWorkspace from './index';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({
    workspaces: {
      workspaces: []
    },
    app: {
      preferences: {
        general: {
          defaultLocation: ''
        }
      }
    }
  })
}));

jest.mock('components/Modal', () => ({ title, description, children, confirmText, handleConfirm, handleCancel }) => (
  <div>
    <div>{title}</div>
    <div>{description}</div>
    {children}
    <button onClick={handleConfirm}>{confirmText}</button>
    <button onClick={handleCancel}>关闭</button>
  </div>
));

jest.mock('components/Help', () => ({ children }) => <div>{children}</div>);
jest.mock('components/PathDisplay/index', () => ({ baseName }) => <div>{baseName}</div>);

describe('CreateWorkspace', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
  });

  it('renders Chinese workspace creation labels and folder help text', async () => {
    render(<CreateWorkspace onClose={jest.fn()} />);

    expect(screen.getAllByText('创建工作区')).toHaveLength(2);
    expect(screen.getByText('为新工作区命名，并选择保存位置以开始使用。')).toBeInTheDocument();
    expect(screen.getByText('名称')).toBeInTheDocument();
    expect(screen.getByText('浏览')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getAllByRole('textbox')[0], {
        target: { value: '演示工作区' }
      });
    });

    expect(screen.getByText('文件夹名称')).toBeInTheDocument();
    expect(screen.getByText('用于存储工作区的文件夹名称。')).toBeInTheDocument();
    expect(screen.getByText('你可以使用与工作区名称不同的文件夹名，或选择更符合文件系统规则的名称。')).toBeInTheDocument();
  });

  it('shows Chinese validation messages when submitting an empty form', async () => {
    render(<CreateWorkspace onClose={jest.fn()} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '创建工作区' }));
    });

    expect(await screen.findByText('工作区名称不能为空')).toBeInTheDocument();
    expect(await screen.findByText('位置不能为空')).toBeInTheDocument();
  });
});
