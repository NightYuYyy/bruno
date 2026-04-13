import React from 'react';
import { render, screen } from '@testing-library/react';
import '../../../i18n';
import NewFolder from './index';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn()
}));

jest.mock('components/Portal', () => ({ children }) => <div>{children}</div>);
jest.mock('components/Modal', () => ({ title, children }) => <div><div>{title}</div>{children}</div>);
jest.mock('components/PathDisplay/index', () => ({ baseName }) => <div>{baseName}</div>);
jest.mock('components/Help', () => ({ children }) => <div>{children}</div>);
jest.mock('components/Dropdown', () => ({ icon, children }) => <div>{icon}{children}</div>);
jest.mock('./StyledWrapper', () => ({ children }) => <div>{children}</div>);
jest.mock('ui/Button', () => ({ children, ...props }) => <button {...props}>{children}</button>);

describe('NewFolder', () => {
  it('renders Chinese new folder modal labels', () => {
    render(<NewFolder collectionUid="collection-1" onClose={jest.fn()} />);

    expect(screen.getByText('新建文件夹')).toBeInTheDocument();
    expect(screen.getByText('文件夹名称')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '创建' })).toBeInTheDocument();
    expect(screen.getByText('选项')).toBeInTheDocument();
  });
});
