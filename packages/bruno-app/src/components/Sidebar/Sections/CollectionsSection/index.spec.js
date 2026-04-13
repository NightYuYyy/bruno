import React from 'react';
import { render, screen } from '@testing-library/react';
import '../../../../i18n';
import CollectionsSection from './index';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => selector({
    app: {
      showSidebarSearch: false,
      isCreatingCollection: false,
      preferences: {
        onboarding: {
          hasSeenWelcomeModal: true
        }
      }
    },
    workspaces: {
      workspaces: [{ uid: 'workspace-1', pathname: 'C:/workspace', collections: [] }],
      activeWorkspaceUid: 'workspace-1'
    },
    collections: {
      collections: [],
      collectionSortOrder: 'default'
    }
  })
}));

jest.mock('providers/ReduxStore/slices/collections/actions', () => ({
  importCollection: jest.fn(),
  openCollection: jest.fn(),
  importCollectionFromZip: jest.fn(),
  newHttpRequest: jest.fn()
}));

jest.mock('providers/ReduxStore/slices/collections/index', () => ({
  sortCollections: jest.fn()
}));

jest.mock('providers/ReduxStore/slices/app', () => ({
  savePreferences: jest.fn(),
  setIsCreatingCollection: jest.fn(),
  toggleSidebarSearch: jest.fn()
}));

jest.mock('utils/common/path', () => ({ normalizePath: (value) => value }));
jest.mock('utils/collections', () => ({
  isScratchCollection: () => false,
  flattenItems: () => [],
  isItemTransientRequest: () => false
}));
jest.mock('utils/common/regex', () => ({ sanitizeName: (value) => value }));
jest.mock('utils/terminal', () => ({ openDevtoolsAndSwitchToTerminal: jest.fn() }));
jest.mock('hooks/useKeybinding', () => jest.fn());
jest.mock('react-hot-toast', () => ({ error: jest.fn() }));

jest.mock('ui/ActionIcon', () => ({ children, label }) => <button>{label}{children}</button>);
jest.mock('ui/MenuDropdown', () => ({ items, children }) => (
  <div>
    <div>{children}</div>
    {items.map((item) => <span key={item.id}>{item.label}</span>)}
  </div>
));
jest.mock('components/Sidebar/ImportCollection', () => () => <div />);
jest.mock('components/Sidebar/ImportCollectionLocation', () => () => <div />);
jest.mock('components/Sidebar/BulkImportCollectionLocation', () => () => <div />);
jest.mock('components/Sidebar/CloneGitRespository', () => () => <div />);
jest.mock('components/Sidebar/Collections/RemoveCollectionsModal/index', () => () => <div />);
jest.mock('components/Sidebar/CreateCollection', () => () => <div />);
jest.mock('components/WelcomeModal', () => () => <div />);
jest.mock('components/Sidebar/Collections', () => () => <div />);
jest.mock('components/Sidebar/SidebarSection', () => ({ title, actions }) => <div><div>{title}</div><div>{actions}</div></div>);

describe('CollectionsSection menus', () => {
  it('renders Chinese section menu labels', () => {
    render(<CollectionsSection />);

    expect(screen.getByText('Collections')).toBeInTheDocument();
    expect(screen.getByText('新建 Collection')).toBeInTheDocument();
    expect(screen.getByText('打开 Collection')).toBeInTheDocument();
    expect(screen.getByText('导入 Collection')).toBeInTheDocument();
    expect(screen.getByText('全部关闭')).toBeInTheDocument();
    expect(screen.getByText('在终端中打开')).toBeInTheDocument();
    expect(screen.getByText('搜索请求')).toBeInTheDocument();
    expect(screen.getByText('添加新 Collection')).toBeInTheDocument();
    expect(screen.getByText('更多操作')).toBeInTheDocument();
  });
});
