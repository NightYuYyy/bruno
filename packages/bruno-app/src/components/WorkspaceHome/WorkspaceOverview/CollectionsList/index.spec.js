import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import toast from 'react-hot-toast';
import '../../../../i18n';
import CollectionsList from './index';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({
    collections: {
      collections: []
    }
  })
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn()
  }
}));
jest.mock('components/Sidebar/Collections/Collection/RenameCollection', () => () => <div />);
jest.mock('components/Sidebar/Collections/Collection/RemoveCollection', () => () => <div />);
jest.mock('components/Sidebar/Collections/Collection/DeleteCollection', () => () => <div />);
jest.mock('components/ShareCollection', () => () => <div />);
jest.mock('components/Dropdown', () => ({ children }) => <div>{children}</div>);
jest.mock('./StyledWrapper', () => ({ children }) => <div>{children}</div>);

describe('CollectionsList', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    toast.error.mockReset();
  });

  it('renders Chinese empty-state labels', () => {
    render(<CollectionsList workspace={{ uid: 'workspace-1', collections: [] }} />);

    expect(screen.getByText('还没有 Collection')).toBeInTheDocument();
    expect(screen.getByText('创建你的第一个 Collection，或打开已有 Collection 以开始使用。')).toBeInTheDocument();
  });

  it('shows a Chinese toast when opening an unloaded git-backed collection', () => {
    render(
      <CollectionsList
        workspace={{
          uid: 'workspace-1',
          collections: [
            {
              name: 'Demo',
              path: 'C:/demo',
              remote: 'https://example.com/demo.git'
            }
          ]
        }}
      />
    );

    fireEvent.click(screen.getByText('Demo'));

    expect(toast.error).toHaveBeenCalledWith('Collection “Demo” 需要先克隆');
  });
});
