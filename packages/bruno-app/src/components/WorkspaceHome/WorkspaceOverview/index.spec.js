import React from 'react';
import { render, screen } from '@testing-library/react';
import '../../../i18n';
import WorkspaceOverview from './index';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => selector({
    globalEnvironments: {
      globalEnvironments: [{ uid: 'env-1' }, { uid: 'env-2' }]
    },
    app: {
      sidebarCollapsed: false,
      isCreatingCollection: false
    }
  })
}));

jest.mock('components/Sidebar/ImportCollection', () => () => <div>Import Collection Modal</div>);
jest.mock('components/Sidebar/ImportCollectionLocation', () => () => <div>Import Collection Location Modal</div>);
jest.mock('components/Sidebar/BulkImportCollectionLocation', () => () => <div>Bulk Import Modal</div>);
jest.mock('components/Sidebar/CloneGitRespository', () => () => <div>Clone Git Modal</div>);
jest.mock('../WorkspaceDocs', () => () => <div>Workspace Docs</div>);
jest.mock('./CollectionsList', () => () => <div>Collections List</div>);
jest.mock('./StyledWrapper', () => ({ children }) => <div>{children}</div>);
jest.mock('ui/Button', () => ({ children, ...props }) => <button {...props}>{children}</button>);

describe('WorkspaceOverview', () => {
  it('renders Chinese workspace overview actions and labels', () => {
    render(
      <WorkspaceOverview
        workspace={{
          pathname: 'C:/workspace',
          collections: [{ uid: 'collection-1' }, { uid: 'collection-2' }]
        }}
      />
    );

    expect(screen.getByText('快捷操作')).toBeInTheDocument();
    expect(screen.getAllByText('Collections')).toHaveLength(2);
    expect(screen.getByText('环境')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '创建 Collection' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '打开 Collection' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '导入 Collection' })).toBeInTheDocument();
  });
});
