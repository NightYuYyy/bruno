import React from 'react';
import { render, screen } from '@testing-library/react';
import '../../../../i18n';
import Collection from './index';

jest.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, jest.fn(), jest.fn()],
  useDrop: () => [{ isOver: false, canDrop: false }, jest.fn()]
}));

jest.mock('react-dnd-html5-backend', () => ({
  getEmptyImage: jest.fn()
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => {
    const state = {
      app: {
        clipboard: {
          hasCopiedItems: false
        }
      }
    };
    return typeof selector === 'function' ? selector(state) : undefined;
  }
}));

jest.mock('src/selectors/tab', () => ({
  isTabForItemActive: () => () => false
}), { virtual: true });

jest.mock('providers/ReduxStore/slices/collections', () => ({
  toggleCollection: jest.fn(),
  collapseFullCollection: jest.fn()
}));

jest.mock('providers/ReduxStore/slices/collections/actions', () => ({
  mountCollection: jest.fn(),
  moveCollectionAndPersist: jest.fn(),
  handleCollectionItemDrop: jest.fn(),
  pasteItem: jest.fn(),
  showInFolder: jest.fn(),
  saveCollectionSecurityConfig: jest.fn()
}));

jest.mock('providers/ReduxStore/slices/tabs', () => ({
  addTab: jest.fn(),
  makeTabPermanent: jest.fn()
}));

jest.mock('providers/ReduxStore/slices/app', () => ({
  setFocusedSidebarPath: jest.fn()
}));

jest.mock('utils/collections/search', () => ({
  doesCollectionHaveItemsMatchingSearchText: () => true
}));

jest.mock('utils/collections', () => ({
  isItemAFolder: () => false,
  isItemARequest: () => false,
  areItemsLoading: () => false
}));

jest.mock('utils/common/platform', () => ({
  getRevealInFolderLabel: () => '在文件资源管理器中显示'
}));

jest.mock('utils/beta-features', () => ({
  useBetaFeature: () => false,
  BETA_FEATURES: { OPENAPI_SYNC: 'openapi-sync' }
}));

jest.mock('components/Sidebar/SidebarAccordionContext', () => ({
  useSidebarAccordion: () => ({ dropdownContainerRef: { current: null } })
}));

jest.mock('utils/collections/emptyStateRequest', () => ({
  createEmptyStateMenuItems: () => []
}));

jest.mock('hooks/useKeybinding', () => jest.fn());
jest.mock('react-hot-toast', () => ({ error: jest.fn() }));
jest.mock('components/Sidebar/NewRequest', () => () => <div />);
jest.mock('components/Sidebar/NewFolder', () => () => <div />);
jest.mock('./CollectionItem', () => () => <div />);
jest.mock('./RemoveCollection', () => () => <div />);
jest.mock('./RenameCollection', () => () => <div />);
jest.mock('./CloneCollection', () => () => <div />);
jest.mock('components/ShareCollection/index', () => () => <div />);
jest.mock('./GenerateDocumentation', () => () => <div />);
jest.mock('./CollectionItem/CollectionItemDragPreview/index', () => ({ CollectionItemDragPreview: () => <div /> }));
jest.mock('utils/terminal', () => ({ openDevtoolsAndSwitchToTerminal: jest.fn() }));
jest.mock('ui/ActionIcon', () => ({ children }) => <div>{children}</div>);
jest.mock('./StyledWrapper', () => ({ children, ...props }) => <div {...props}>{children}</div>);
jest.mock('components/Icons/OpenAPISync', () => () => <div />);
jest.mock('ui/StatusBadge', () => ({ children }) => <span>{children}</span>);
jest.mock('ui/MenuDropdown', () => {
  const mockReact = require('react');
  return mockReact.forwardRef(({ items, children }, ref) => {
    mockReact.useImperativeHandle(ref, () => ({ show: jest.fn(), hide: jest.fn() }));
    return (
      <div>
        <div>{children}</div>
        {items.map((item) => item.type === 'divider' ? null : <span key={item.id}>{item.label}</span>)}
      </div>
    );
  });
});

describe('Collection menu', () => {
  it('renders Chinese labels for the collection action menu', () => {
    render(
      <Collection
        collection={{
          uid: 'collection-1',
          name: 'NightYu',
          pathname: 'C:/collections/nightyu',
          items: [],
          collapsed: false,
          isLoading: false,
          mountStatus: 'mounted'
        }}
        searchText=""
      />
    );

    expect(screen.getByText('新建请求')).toBeInTheDocument();
    expect(screen.getByText('新建文件夹')).toBeInTheDocument();
    expect(screen.getByText('运行')).toBeInTheDocument();
    expect(screen.getByText('克隆')).toBeInTheDocument();
    expect(screen.getByText('重命名')).toBeInTheDocument();
    expect(screen.getByText('共享')).toBeInTheDocument();
    expect(screen.getByText('生成文档')).toBeInTheDocument();
    expect(screen.getByText('折叠')).toBeInTheDocument();
    expect(screen.getByText('在文件资源管理器中显示')).toBeInTheDocument();
    expect(screen.getByText('设置')).toBeInTheDocument();
    expect(screen.getByText('在终端中打开')).toBeInTheDocument();
    expect(screen.getByText('移除')).toBeInTheDocument();
  });
});
