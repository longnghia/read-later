import { getCurrentTab } from './tabs';

export function setBadge(text: string, onlyCurrent = false) {
  getCurrentTab().then((tab) => {
    chrome.browserAction.setBadgeText({
      tabId: onlyCurrent ? tab.id : undefined,
      text,
    });
  });
}

export async function setBadgeBackground(color = '#22c55e') {
  try {
    const tab = await getCurrentTab();
    await chrome.browserAction.setBadgeBackgroundColor({ color, tabId: tab.id });
  } catch (error) {
    console.error('failed to set badge color', error);
  }
}

export function setTemporaryBadge(text: string) {
  chrome.browserAction.getBadgeText({})
    .then((curBadge) => {
      setTimeout(() => {
        setBadge(curBadge);
      }, 5000);
    });
  setBadge(text);
}
