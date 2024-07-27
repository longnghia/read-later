import { Tab } from '../types';
import { isURL } from './url';

/* tabs */
export function saveTabs() {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    (tabs) => {
      const res = tabs.reduce<Omit<Tab, 'createdAt'>[]>((pre, tab) => {
        if (tab.title && tab.url) {
          pre.push({ title: tab.title, url: tab.url });
        }
        return pre;
      }, []);
      const link = document.createElement('a');
      link.href = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(res),
      )}`;
      link.download = `${tabs[0].title}.json`;
      link.click();
    },
  );
}

export function getCurrentTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        highlighted: true,
        currentWindow: true,
      },
      (tabs) => {
        if (tabs[0]) {
          resolve(tabs[0]);
        } else {
          reject(new Error('[tabs] No tabs found'));
        }
      },
    );
  });
}

/**
 *
 * @param url tab to open
 * @param active new tab is focused if active = true
 */
export function createTab(url: string, active = false) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      const currentTab = tabs[0];
      chrome.tabs.create({
        active,
        openerTabId: currentTab.id,
        index: currentTab.index + 1,
        url: url ?? currentTab.url,
      });
    },
  );
}

/**
 * Duplicate current tab
 */
export function dublicateTab() {
  createTab('');
}

/**
 *
 * @param text selected text
 * @param command
 */
export function openUrl(text: string, command: string) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.create({
        url: isURL(text) ? text : `https://www.google.com/search?q=${text}`,
        active: command !== 'open-in-bg',
        index: tabs[0].index + 1,
      });
    },
  );
}

/**
 * Load new url in current tab
 */
export function updateUrl(url: string) {
  chrome.tabs.update({
    url,
  });
}
