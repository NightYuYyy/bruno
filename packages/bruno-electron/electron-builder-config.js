require('dotenv').config({ path: process.env.DOTENV_PATH });

const isUnsignedMacBuild = process.env.BRUNO_CI_UNSIGNED_MAC === 'true';
const macTargetArchs = (process.env.BRUNO_MAC_ARCHS || 'x64')
  .split(',')
  .map((arch) => arch.trim())
  .filter(Boolean);

const config = {
  appId: 'com.usebruno.app',
  productName: 'Bruno',
  electronVersion: '37.6.1',
  directories: {
    buildResources: 'resources',
    output: 'out'
  },
  extraResources: [
    {
      from: 'resources/data/sample-collection.json',
      to: 'data/sample-collection.json'
    }
  ],
  files: ['**/*'],
  afterSign: isUnsignedMacBuild ? undefined : 'notarize.js',
  mac: {
    artifactName: '${name}_${version}_${arch}_${os}.${ext}',
    category: 'public.app-category.developer-tools',
    target: isUnsignedMacBuild
      ? [
          {
            target: 'dmg',
            arch: macTargetArchs
          },
          {
            target: 'zip',
            arch: macTargetArchs
          }
        ]
      : [
          {
            target: 'pkg',
            arch: ['x64', 'arm64']
          },
          {
            target: 'dmg',
            arch: ['x64', 'arm64']
          },
          {
            target: 'zip',
            arch: ['x64', 'arm64']
          }
        ],
    icon: 'resources/icons/mac/icon.icns',
    hardenedRuntime: !isUnsignedMacBuild,
    identity: isUnsignedMacBuild ? null : 'Anoop MD (W7LPPWA48L)',
    entitlements: isUnsignedMacBuild ? undefined : 'resources/entitlements.mac.plist',
    entitlementsInherit: isUnsignedMacBuild ? undefined : 'resources/entitlements.mac.plist',
    notarize: false,
    protocols: [
      {
        name: 'Bruno',
        schemes: [
          'bruno'
        ]
      }
    ]
  },
  linux: {
    artifactName: '${name}_${version}_${arch}_${os}.${ext}',
    icon: 'resources/icons/png',
    target: [
      {
        target: 'AppImage',
        arch: ['x64', 'arm64']
      },
      {
        target: 'deb',
        arch: ['x64', 'arm64']
      },
      {
        target: 'rpm',
        arch: ['x64', 'arm64']
      }
    ],
    protocols: [
      {
        name: 'Bruno',
        schemes: ['bruno']
      }
    ],
    category: 'Development',
    desktop: {
      MimeType: 'x-scheme-handler/bruno;'
    }
  },
  deb: {
    // Docs: https://www.electron.build/configuration/linux#debian-package-options
    depends: [
      'libgtk-3-0',
      'libnotify4',
      'libnss3',
      'libxss1',
      'libxtst6',
      'xdg-utils',
      'libatspi2.0-0',
      'libuuid1',
      'libsecret-1-0',
      'libasound2' // #1036
    ]
  },
  win: {
    artifactName: '${name}_${version}_${arch}_win.${ext}',
    icon: 'resources/icons/win/icon.ico',
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ],
    sign: null,
    publisherName: 'Bruno Software Inc'
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    allowElevation: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true
  }
};

module.exports = config;
