import { Tab } from '@src/types';
import { setBadge, setBadgeBackground } from '@src/utils/badge';
import { getValue, setValue } from '@src/utils/storage';
import {
  createTab,
  dublicateTab,
  getCurrentTabs,
  saveTabs,
} from '@src/utils/tabs';
import { Command } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
const log = (...args: any) => console.log('[background]', args);

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
        await savePages(false);
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
  chrome.contextMenus.create({
    id: 'debug',
    title: 'Debug',
    contexts: ['browser_action'],
    onclick: () => {
      createTab(chrome.runtime.getURL('_generated_background_page.html'), true);
    },
    icons: {
      16: '../../assets/img/malware16.png',
      32: '../../assets/img/malware32.png',
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
      16: '../../assets/img/popup16.png',
      32: '../../assets/img/popup32.png',
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

const main = async () => {
  await setValue({
    read_later: [
      {
        url: 'https://github.com/trending',
        title: 'Trending repositories on GitHub today · GitHub',
        date: 1723390018361,
      },
      {
        url: 'https://github.com/hacksider/Deep-Live-Cam',
        title: 'GitHub - hacksider/Deep-Live-Cam: real time face swap and one-click video deepfake with only a single image (uncensored)',
        date: 1723390019144,
      },
      {
        url: 'https://github.com/NaiboWang/EasySpider',
        title: 'GitHub - NaiboWang/EasySpider: A visual no-code/code-free web crawler/spider易采集：一个可视化浏览器自动化测试/数据采集/爬虫软件，可以无代码图形化的设计和执行爬虫任务。别名：ServiceWrapper面向Web应用的智能化服务封装系统。',
        date: 1723390019755,
      },
      {
        url: 'https://github.com/mbrg/power-pwn',
        title: 'GitHub - mbrg/power-pwn: An offensive security toolset for Microsoft 365 focused on Microsoft Copilot, Copilot Studio and Power Platform',
        date: 1723390021819,
      },
    ],
  });
  setupBadge();
  setupOmnibox();
  setupContextMenu();
  setupListener();
  setupCommands();
};

main();
