const mockEmit = jest.fn();

jest.mock('electron', () => ({
  ipcMain: {
    emit: mockEmit
  },
  BrowserWindow: jest.fn(() => ({
    removeMenu: jest.fn(),
    loadURL: jest.fn()
  }))
}));

jest.mock('os', () => ({
  platform: () => 'win32'
}));

const template = require('./menu-template');
const fs = require('fs');
const path = require('path');

describe('menu-template', () => {
  beforeEach(() => {
    mockEmit.mockReset();
  });

  it('does not depend on bruno-app translation source files', () => {
    const file = path.join(__dirname, 'menu-template.js');
    const content = fs.readFileSync(file, 'utf8');

    expect(content.includes('../../../bruno-app/src/i18n/translation/')).toBe(false);
  });

  it('provides Chinese labels for translated native menu items', () => {
    expect(template[1].label).toBe('编辑');
    expect(template[2].label).toBe('查看');
    expect(template[0].submenu[0].label).toBe('打开 Collection');
    expect(template[0].submenu[1].label).toBe('最近打开');
    expect(template[0].submenu[1].submenu[0].label).toBe('清空最近项');
    expect(template[0].submenu[3].label).toBe('退出');
    expect(template[0].submenu[4].label).toBe('强制退出');
    expect(template[2].submenu[2].label).toBe('实际大小');
    expect(template[2].submenu[3].label).toBe('放大');
    expect(template[2].submenu[4].label).toBe('缩小');
    expect(template[4].submenu[0].label).toBe('关于 Bruno');
    expect(template[4].submenu[1].label).toBe('文档');
  });
});
