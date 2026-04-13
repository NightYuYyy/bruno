import i18n from './index';

describe('i18n configuration', () => {
  it('defaults to simplified Chinese and resolves common labels in Chinese', () => {
    expect(i18n.language).toBe('zh-CN');
    expect(i18n.t('COMMON.DOCUMENTATION')).toBe('文档');
    expect(i18n.t('WELCOME.CREATE_COLLECTION')).toBe('创建 Collection');
  });

  it('resolves newly added zh-CN keys for workspace, cookies, and electron menu', () => {
    expect(i18n.t('WORKSPACE.CREATE_TITLE')).toBe('创建工作区');
    expect(i18n.t('WORKSPACE.IMPORT_TITLE')).toBe('导入工作区');
    expect(i18n.t('COOKIES.MODIFY_TITLE')).toBe('修改 Cookie');
    expect(i18n.t('ELECTRON_MENU.ACTUAL_SIZE')).toBe('实际大小');
    expect(i18n.t('WORKSPACE.COLLECTION_NOT_CLONED', { name: 'Demo' })).toBe('Collection “Demo” 需要先克隆');
  });
});
