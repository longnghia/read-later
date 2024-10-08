import { Tab } from '@src/types';
import { setBadge, setBadgeBackground } from '@src/utils/badge';
import { isProd } from '@src/utils/env';
import { save2Json } from '@src/utils/file';
import { getValue, setValue } from '@src/utils/storage';
import {
  createTab,
  dublicateTab,
  getCurrentTabs,
  saveTabs,
} from '@src/utils/tabs';
import { Command } from '../types';
import devdb from './devdb';

const log = (...args: any) => {
  if (isProd) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
  console.log('[background]', args);
};

chrome.browserAction.setBadgeBackgroundColor({ color: 'blue' });

function logStorageChange(
  changes: { [key: string]: chrome.storage.StorageChange },
  areaName: 'sync' | 'local' | 'managed' | 'session',
) {
  log(`\n\nChange in storage area: ${areaName}`);

  const changedItems = Object.keys(changes);

  changedItems.forEach((item) => {
    log('Old value: ', changes[item].oldValue);
    log('New value: ', changes[item].newValue);
  });
}

function onError(err: any) {
  log('onError', err);
}

function tabExisted(db: Tab[], newTab: Tab) {
  return db.some((tab) => tab.url === newTab.url);
}

function tabValid(tab: chrome.tabs.Tab) {
  return tab.url?.startsWith('http') && tab.title;
}

function parseTabInfo(tab: chrome.tabs.Tab): Tab {
  return {
    url: tab.url ?? '',
    title: tab.title ?? '',
    date: Date.now(),
  };
}

async function getTabsInfo(highlighted: boolean) {
  const tabs = await getCurrentTabs(highlighted);
  return tabs.filter(tabValid).map(parseTabInfo);
}

async function savePages(highlighted: boolean) {
  try {
    const tabs = await getTabsInfo(highlighted);
    const db: Tab[] = (await getValue()).read_later ?? [];

    const newTabs: Tab[] = [];

    for (let index = 0; index < tabs.length; index += 1) {
      const tab = tabs[index];
      if (tabExisted(db, tab)) {
        setBadgeBackground('orange');
      } else {
        newTabs.push(tab);
      }
    }

    if (newTabs.length === 0) {
      log('Tabs exist!', tabs);
      return;
    }

    newTabs.forEach((tab) => {
      db.push(tab);
    });

    await setValue({ read_later: db });
    log(`tabs saved ${newTabs.length} tabs`);
    setBadge(String(db.length));
    setBadgeBackground('#22c55e');
  } catch (error) {
    onError(error);
  }
}

function setupListener() {
  chrome.storage.onChanged.addListener(logStorageChange);
}

function setupCommands() {
  chrome.commands.onCommand.addListener(async (command) => {
    log(`command= ${command}`);

    switch (command as Command) {
      case 'save_active_tab':
        await savePages(true);
        break;
      case 'save_highlighted_tabs':
        await savePages(true);
        break;
      case 'log_tabs':
        saveTabs();
        break;
      case 'dublicate_tab':
        dublicateTab();
        break;
      // case 'open-in-bg' || command === 'open-in-fg':
      //   openUrl(command);
      //   break;
      // case 'fakeCtrlW':
      //   doFakeCtrW();
      //   break;
      // case 'save_json':
      //   save2Json();
      //   break;
      default:
        break;
    }
  });
}

function setupContextMenu() {
  if (!isProd) {
    chrome.contextMenus.create({
      id: 'debug',
      title: 'Debug',
      contexts: ['browser_action'],
      onclick: () => {
        createTab(chrome.runtime.getURL('_generated_background_page.html'), true);
      },
      icons: {
        16: '../public/malware16.png',
        32: '../public/malware32.png',
      },
    } as chrome.contextMenus.CreateProperties);

    chrome.contextMenus.create({
      id: 'popup',
      title: 'Popup',
      contexts: ['browser_action'],
      onclick: () => {
        createTab(chrome.runtime.getURL('popup/index.html'), true);
      },
      icons: {
        16: '../public/popup16.png',
        32: '../public/popup32.png',
      },
    } as chrome.contextMenus.CreateProperties);
  }

  chrome.contextMenus.create({
    id: 'export_json',
    title: 'Export JSON',
    contexts: ['browser_action'],
    onclick: async () => {
      const data = await getValue();
      save2Json(data);
    },
    icons: {
      16: '../public/json16.png',
      32: '../public/json32.png',
    },
  } as chrome.contextMenus.CreateProperties);
}

function setupOmnibox() {
  // chrome.contextMenus.create({
  //   id: 'omnibox',
  //   title: 'Omnibox',
  //   contexts: ['browser_action'],
  //   onclick: gotoOmnibox,
  //   icons: {
  //     16: '../../images/boxes.png',
  //     32: '../../images/boxes.png',
  //   },
  // });
}

async function setupBadge() {
  const storage = await getValue();
  const readlater = storage?.read_later ?? [];
  setBadge(String(readlater.length));
}

async function setupDevDB() {
  if (isProd) return;
  await setValue(devdb);
}

const main = async () => {
  await setupDevDB();
  setupBadge();
  setupOmnibox();
  setupContextMenu();
  setupListener();
  setupCommands();
};

main();
