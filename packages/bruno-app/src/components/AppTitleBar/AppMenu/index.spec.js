import React from 'react';
import { render, screen } from '@testing-library/react';
import '../../../i18n';
import AppMenu from './index';

jest.mock('ui/MenuDropdown', () => ({ items, children }) => (
  <div>
    <div>{children}</div>
    {items.map((item) => (
      <div key={item.id}>
        <span>{item.label}</span>
        {item.submenu?.map((subItem) => subItem.type === 'divider'
          ? null
          : <span key={subItem.id}>{subItem.label}</span>)}
      </div>
    ))}
  </div>
));

jest.mock('ui/ActionIcon', () => ({ children, label }) => <button>{label}{children}</button>);
jest.mock('./StyledWrapper', () => ({ children }) => <div>{children}</div>);

describe('AppMenu', () => {
  beforeEach(() => {
    window.ipcRenderer = {
      invoke: jest.fn(),
      send: jest.fn()
    };
  });

  it('provides Chinese menu labels', () => {
    render(<AppMenu />);

    expect(screen.getByText('文件')).toBeInTheDocument();
    expect(screen.getByText('编辑')).toBeInTheDocument();
    expect(screen.getByText('查看')).toBeInTheDocument();
    expect(screen.getByText('帮助')).toBeInTheDocument();
    expect(screen.getByText('打开 Collection')).toBeInTheDocument();
    expect(screen.getByText('偏好设置')).toBeInTheDocument();
    expect(screen.getByText('退出')).toBeInTheDocument();
  });
});
