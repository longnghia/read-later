import { Tab } from '@src/types';
import { setBadge } from '@src/utils/badge';
import { getValue, setValue } from '@src/utils/storage';
import { createTab } from '@src/utils/tabs';
import { useCallback, useEffect, useState } from 'react';
import { FaBeer } from 'react-icons/fa';

export default function Popup(): JSX.Element {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [query, setQuery] = useState('');

  const getDatabase = useCallback(
    async () => {
      const storage = await getValue();
      const db: Tab[] = storage?.read_later ?? [];
      return db;
    },
    [],
  );

  // fill data by local storage
  // reverse the data to display latest tab on top, and to handle remove item easier
  useEffect(() => {
    async function getTabs() {
      const storage: Tab[] = await getDatabase();
      console.log('🚀 ~ getTabs ~ storage:', storage);
      if (storage) {
        setTabs([...storage].reverse());
      }
    }
    getTabs();
  }, [getDatabase]);

  const updateBadge = (count: number) => {
    setBadge(String(count));
  };

  const setStorageAndUpdateBadge = useCallback((newTabs: Tab[]) => {
    setValue({
      read_later: newTabs,
    })
      .then(() => {
        updateBadge(newTabs.length);
      })
      .catch((error) => {
        console.error('setStorageAndUpdateBadge', error);
      });
  }, []);

  const removeTab = async (pos: number) => {
    const temp = [...tabs];
    temp.splice(pos, 1);
    setTabs(temp);
  };

  const openAndRemoveTab = (event: any, index: number) => {
    createTab(tabs[index].url);

    if (event.altKey || event.metaKey) {
      removeTab(index);
    }
  };

  const handleChangeQuery = useCallback(
    (event: { target: { value: string } }) => setQuery(event.target.value),
    [],
  );

  // update tabs on query
  useEffect(() => {
    const queryStorage = async () => {
      const db = await getDatabase();
      let temp: Tab[];
      if (query === '') {
        temp = db;
      } else {
        temp = db.filter(
          (tab) => tab.url.toLowerCase().indexOf(query) !== -1
            || tab.title.toLowerCase().indexOf(query) !== -1,
        );
      }
      setTabs(temp);
    };
    const timeout = setTimeout(() => {
      queryStorage();
    }, 800);
    return () => clearTimeout(timeout);
  }, [query, getDatabase]);

  // update DB considering debouce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStorageAndUpdateBadge(tabs);
    }, 200);
    return () => clearTimeout(timeout);
  }, [setStorageAndUpdateBadge, tabs]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <div className="border rounded border-gray-400">
        <input placeholder="Tab title" onChange={handleChangeQuery} />
      </div>
      <div className="gap-3">
        {tabs.map((tab) => (
          <div className="p-3 flex-row items-center gap-x-3">
            <FaBeer />
            <div className="flex-1">{tab.title}</div>
            <FaBeer />

          </div>
        ))}
      </div>
    </div>
  );
}
