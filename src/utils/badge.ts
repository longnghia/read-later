import { getCurrentTab } from './tabs';

export function setBadge(text: string) {
  getCurrentTab().then((tab) => {
    chrome.browserAction.setBadgeText({
      tabId: tab.id,
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
