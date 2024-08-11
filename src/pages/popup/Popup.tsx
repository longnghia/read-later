import { Tab } from '@src/types';
import { setBadge } from '@src/utils/badge';
import { getValue, setValue } from '@src/utils/storage';
import { createTab, getIcon } from '@src/utils/tabs';
import {
  MouseEvent, useCallback, useEffect, useState,
} from 'react';
import { FaTrash } from 'react-icons/fa';

export default function Popup(): JSX.Element {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>([]);
  const [query, setQuery] = useState('');

  const getDatabase = useCallback(async () => {
    const storage = await getValue();
    const db: Tab[] = storage?.read_later ?? [];
    return db;
  }, []);

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
      read_later: [...newTabs].reverse(),
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

  const openAndRemoveTab = (event: MouseEvent, index: number) => {
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
      let temp = tabs;
      if (query) {
        temp = tabs.filter(
          (tab) => tab.url.toLowerCase().indexOf(query) !== -1
            || tab.title.toLowerCase().indexOf(query) !== -1,
        );
      }

      setFilteredTabs(temp);
    };
    const timeout = setTimeout(() => {
      queryStorage();
    }, 800);
    return () => clearTimeout(timeout);
  }, [query, tabs]);

  // update DB considering debouce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStorageAndUpdateBadge(tabs);
    }, 200);
    return () => clearTimeout(timeout);
  }, [setStorageAndUpdateBadge, tabs]);

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 h-full p-3 text-center bg-white">
      <div className="border border-gray-400 rounded">
        <input placeholder="Tab title" onChange={handleChangeQuery} />
      </div>
      <div className="flex flex-col gap-3">
        {filteredTabs.map((tab, index) => (
          <div className="flex flex-row items-center h-[100px] p-3 gap-x-4" key={tab.url}>
            <img src={getIcon(tab.url)} alt="tab icon" className="w-8 h-8" />
            <div
              className="flex flex-wrap flex-1 w-full h-full overflow-hidden overflow-ellipsis"
              onClick={(e) => openAndRemoveTab(e, index)}
            >
              {tab.title}
            </div>
            <FaTrash onClick={() => { removeTab(index); }} />
          </div>
        ))}
      </div>
    </div>
  );
}
