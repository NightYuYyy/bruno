import React from 'react';
import { render, screen } from '@testing-library/react';
import '../../../i18n';
import CreateCollection from './index';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => selector({
    workspaces: {
      workspaces: [{ uid: 'workspace-1', type: 'default', pathname: 'C:/collections' }],
      activeWorkspaceUid: 'workspace-1'
    },
    app: {
      preferences: {
        general: {
          defaultLocation: 'C:/collections'
        }
      }
    }
  })
}));

jest.mock('components/Portal', () => ({ children }) => <div>{children}</div>);
jest.mock('components/Modal', () => ({ title, children }) => <div><div>{title}</div>{children}</div>);
jest.mock('components/PathDisplay/index', () => ({ baseName }) => <div>{baseName}</div>);
jest.mock('components/Help', () => ({ children }) => <div>{children}</div>);
jest.mock('components/Dropdown', () => ({ icon, children }) => <div>{icon}{children}</div>);
jest.mock('./StyledWrapper', () => ({ children }) => <div>{children}</div>);
jest.mock('ui/Button', () => ({ children, ...props }) => <button {...props}>{children}</button>);

describe('CreateCollection', () => {
  it('renders Chinese create collection labels', () => {
    render(<CreateCollection onClose={jest.fn()} />);

    expect(screen.getByText('创建 Collection')).toBeInTheDocument();
    expect(screen.getByText('名称')).toBeInTheDocument();
    expect(screen.getByText('位置')).toBeInTheDocument();
    expect(screen.getByText('浏览')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '创建' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
  });
});
