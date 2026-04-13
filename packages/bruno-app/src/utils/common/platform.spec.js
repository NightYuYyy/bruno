jest.mock('platform', () => ({
  os: {
    family: 'Windows'
  }
}));

import '../../i18n';
import { getRevealInFolderLabel } from './platform';

describe('platform helpers', () => {
  it('returns Chinese reveal label on Windows', () => {
    expect(getRevealInFolderLabel()).toBe('在文件资源管理器中显示');
  });
});
