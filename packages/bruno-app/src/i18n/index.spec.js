import i18n from './index';

describe('i18n configuration', () => {
  it('defaults to simplified Chinese and resolves common labels in Chinese', () => {
    expect(i18n.language).toBe('zh-CN');
    expect(i18n.t('COMMON.DOCUMENTATION')).toBe('文档');
    expect(i18n.t('WELCOME.CREATE_COLLECTION')).toBe('创建 Collection');
  });
});
