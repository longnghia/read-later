if (!chrome?.storage?.local) {
  throw new Error('[storage] chrome.storage.local not found!');
}

export function getValue(key: string | null = null): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (val) => {
      if (val) {
        resolve(val);
      } else {
        reject(new Error('[storage] Database null'));
      }
    });
  });
}

export function setValue(obj: object) {
  return new Promise((resolve) => {
    chrome.storage.local.set(obj, () => {
      resolve('[setValue] success');
    });
  });
}

export function clearValue() {
  return new Promise((resolve) => {
    chrome.storage.local.clear(() => {
      resolve('[clearValue] success');
    });
  });
}

export function getSettings() {
  return getValue('settings');
}

export function putSetting(config: object) {
  return new Promise((resolve, reject) => {
    const settings = getSettings();
    setValue({ settings: { ...settings, ...config } })
      .then(resolve)
      .catch(reject);
  });
}

window.getValue = getValue;
window.setValue = setValue;
window.clearValue = clearValue;
