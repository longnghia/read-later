import { createRequire } from 'node:module';
import { ManifestTypeV2 } from './v2-type.mjs';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

const manifest: ManifestTypeV2 = {
  manifest_version: 2,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  browser_specific_settings: {
    gecko: {
      id: 'read-later@paulcoding.com',
      strict_min_version: '58.0',
    },
  },
  icons: {
    128: 'public/icon-128.png',
  },
  web_accessible_resources: ['public/*', 'assets/*'],
};

function getManifestV2(pageDirMap: { [x: string]: any }): ManifestTypeV2 {
  const pages = Object.keys(pageDirMap);

  if (pages.length === 0) {
    return manifest;
  }

  if (pages.indexOf('options') > -1) {
    manifest.options_ui = {
      page: pageDirMap.options,
    };
  }

  if (pages.indexOf('background') > -1) {
    manifest.background = {
      scripts: [pageDirMap.background],
    };
  }

  if (pages.indexOf('popup') > -1) {
    manifest.browser_action = {
      default_popup: pageDirMap.popup,
      default_icon: 'public/icon-34.png',
    };
  }

  if (pages.indexOf('content') > -1) {
    manifest.content_scripts = [
      {
        matches: ['http://*/*', 'https://*/*', '<all_urls>'],
        js: [pageDirMap.content],
        css: pageDirMap['content-css'],
        run_at: 'document_start',
      },
    ];
  }

  if (pages.indexOf('devtools') > -1) {
    manifest.devtools_page = pageDirMap.devtools;
  }

  manifest.permissions = ['tabs', 'storage', 'contextMenus'];
  manifest.commands = {
    save_active_tab: {
      suggested_key: {
        default: 'Ctrl+B',
        mac: 'MacCtrl+B',
      },
      description: "Send a 'read-later' event to the extension",
    },
    open_in_background: {
      suggested_key: {
        default: 'Ctrl+Q',
        mac: 'MacCtrl+Q',
      },
      description: 'open selected in background',
    },
  };

  return manifest;
}

export default getManifestV2;
