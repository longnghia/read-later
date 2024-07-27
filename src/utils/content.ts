import { getCurrentTab } from './tabs';

export function executeScript(script: string) {
  getCurrentTab().then((tab) => {
    if (!tab.id) return;
    chrome.tabs
      .executeScript(tab.id, { code: script })
      .then((res) => {
        console.log('[executeScript] done', res);
      })
      .catch((err) => console.log('[executeScript] error', err, script));
  });
}

export function reload(hard = false) {
  executeScript(`window.location.reload(${hard})`);
}
