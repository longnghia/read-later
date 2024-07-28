import { getCurrentTab } from './tabs';

export function setBadge(text: string, onlyCurrent = false) {
  getCurrentTab().then((tab) => {
    chrome.browserAction.setBadgeText({
      tabId: onlyCurrent ? tab.id : undefined,
      text,
    });
  });
}

export function setTemporaryBadge(text: string) {
  setBadge(text);
  chrome.browserAction.getBadgeText({})
    .then((curBadge) => {
      setTimeout(() => {
        setBadge(curBadge);
      }, 5000);
    });
}
