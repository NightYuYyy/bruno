import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import toast from 'react-hot-toast';
import '../../../i18n';
import ModifyCookieModal from './index';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

jest.mock('providers/ReduxStore/slices/app', () => ({
  modifyCookie: (...args) => ({ type: 'modifyCookie', args }),
  addCookie: (...args) => ({ type: 'addCookie', args }),
  getParsedCookie: (value) => ({ type: 'getParsedCookie', value }),
  createCookieString: (...args) => ({ type: 'createCookieString', args })
}));

jest.mock('components/Modal/index', () => ({ title, customHeader, children, handleConfirm, handleCancel }) => (
  <div>
    {customHeader || <div>{title}</div>}
    {children}
    <button onClick={handleConfirm}>确认</button>
    <button onClick={handleCancel}>关闭</button>
  </div>
));

jest.mock('components/ToggleSwitch/index', () => ({ isOn, handleToggle, className }) => (
  <input className={className} type="checkbox" checked={isOn} onChange={handleToggle} aria-label="raw-toggle" />
));

jest.mock('react-tooltip', () => ({
  Tooltip: () => null
}));

jest.mock('./StyledWrapper', () => ({ children }) => <div>{children}</div>);

describe('ModifyCookieModal', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockDispatch.mockImplementation((action) => {
      if (action?.type === 'getParsedCookie') {
        return Promise.resolve(null);
      }
      if (action?.type === 'createCookieString') {
        return Promise.resolve('');
      }
      return Promise.resolve();
    });
    toast.error.mockReset();
    toast.success.mockReset();
  });

  it('renders Chinese cookie modal labels', () => {
    render(
      <ModifyCookieModal
        onClose={jest.fn()}
        domain="example.com"
        cookie={{ key: 'session', value: 'abc', domain: 'example.com', path: '/' }}
      />
    );

    expect(screen.getByText('修改 Cookie')).toBeInTheDocument();
    expect(screen.getByText('编辑原始文本')).toBeInTheDocument();
    expect(screen.getByText('域')).toBeInTheDocument();
    expect(screen.getByText('路径')).toBeInTheDocument();
    expect(screen.getByText('键')).toBeInTheDocument();
    expect(screen.getByText('值')).toBeInTheDocument();
  });

  it('shows a Chinese toast when the raw cookie string is invalid', async () => {
    render(<ModifyCookieModal onClose={jest.fn()} domain="example.com" />);

    await act(async () => {
      fireEvent.click(screen.getByLabelText('raw-toggle'));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '确认' }));
    });

    expect(toast.error).toHaveBeenCalledWith('请输入有效的 Cookie 字符串');
  });
});
