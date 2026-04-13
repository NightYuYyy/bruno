import '../../i18n';
import toast from 'react-hot-toast';
import { createEmptyStateMenuItems } from './emptyStateRequest';

const mockGenerateUniqueRequestName = jest.fn();

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn()
  }
}));

jest.mock('utils/collections', () => ({
  generateUniqueRequestName: (...args) => mockGenerateUniqueRequestName(...args)
}));

jest.mock('providers/ReduxStore/slices/collections/actions', () => ({
  newHttpRequest: jest.fn(),
  newWsRequest: jest.fn(),
  newGrpcRequest: jest.fn()
}));

describe('createEmptyStateMenuItems', () => {
  beforeEach(() => {
    mockGenerateUniqueRequestName.mockReset();
    toast.error.mockReset();
  });

  it('shows a Chinese fallback toast when request creation fails', async () => {
    mockGenerateUniqueRequestName.mockRejectedValue(new Error(''));

    const items = createEmptyStateMenuItems({
      dispatch: jest.fn(),
      collection: { uid: 'collection-1' },
      itemUid: 'folder-1'
    });

    await items[0].onClick();

    expect(toast.error).toHaveBeenCalledWith('创建请求时出错');
  });
});
