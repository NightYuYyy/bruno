const { ipcMain } = require('electron');
const os = require('os');
const { BrowserWindow } = require('electron');
const { version } = require('../../package.json');
const aboutBruno = require('./about-bruno');
const translationZhCN = require('../../../bruno-app/src/i18n/translation/zh-CN.json');
const translationEn = require('../../../bruno-app/src/i18n/translation/en.json');

const translations = {
  'zh-CN': translationZhCN,
  'en': translationEn
};

const locale = 'zh-CN';

const t = (key) => {
  const value = key.split('.').reduce((current, part) => current?.[part], translations[locale]);

  if (value !== undefined) {
    return value;
  }

  return key.split('.').reduce((current, part) => current?.[part], translations.en) || key;
};

const template = [
  {
    label: t('ELECTRON_MENU.COLLECTION'),
    submenu: [
      {
        label: t('COMMON.OPEN_COLLECTION'),
        click() {
          ipcMain.emit('main:open-collection');
        }
      },
      {
        label: t('ELECTRON_MENU.OPEN_RECENT'),
        role: 'recentdocuments',
        visible: os.platform() === 'darwin',
        submenu: [
          {
            label: t('ELECTRON_MENU.CLEAR_RECENT'),
            role: 'clearrecentdocuments'
          }
        ]
      },
      { type: 'separator' },
      {
        label: t('COMMON.QUIT'),
        click() {
          ipcMain.emit('main:start-quit-flow');
        }
      },
      {
        label: t('ELECTRON_MENU.FORCE_QUIT'),
        click() {
          process.exit();
        }
      }
    ]
  },
  {
    label: t('COMMON.EDIT'),
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' }
    ]
  },
  {
    label: t('COMMON.VIEW'),
    submenu: [
      { role: 'toggledevtools' },
      { type: 'separator' },
      {
        label: t('ELECTRON_MENU.ACTUAL_SIZE'),
        accelerator: 'CommandOrControl+0',
        registerAccelerator: false,
        click() {
          ipcMain.emit('menu:reset-zoom');
        }
      },
      {
        label: t('COMMON.ZOOM_IN'),
        accelerator: 'CommandOrControl+Plus',
        registerAccelerator: false,
        click() {
          ipcMain.emit('menu:zoom-in');
        }
      },
      {
        label: t('COMMON.ZOOM_OUT'),
        accelerator: 'CommandOrControl+-',
        registerAccelerator: false,
        click() {
          ipcMain.emit('menu:zoom-out');
        }
      },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close', accelerator: 'CommandOrControl+Shift+Q' }]
  },
  {
    label: t('COMMON.HELP'),
    role: 'help',
    submenu: [
      {
        label: t('COMMON.ABOUT_BRUNO'),
        click: () => {
          const aboutWindow = new BrowserWindow({
            width: 350,
            height: 250,
            webPreferences: {
              nodeIntegration: true
            }
          });
          aboutWindow.removeMenu();
          aboutWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(aboutBruno({ version }))}`);
        }
      },
      { label: t('COMMON.DOCUMENTATION'), click: () => ipcMain.emit('main:open-docs') }
    ]
  }
];

module.exports = template;
