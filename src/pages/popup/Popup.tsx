import emptyIcon from '@assets/img/empty.svg';
import loadingIcon from '@assets/img/loading.svg';
import { Tab } from '@src/types';
import { setBadge, setBadgeBackground } from '@src/utils/badge';
import { getValue, setValue } from '@src/utils/storage';
import { createTab, getIcon } from '@src/utils/tabs';
import {
  MouseEvent, useCallback, useEffect, useState,
} from 'react';
import { FaTrash } from 'react-icons/fa';

export default function Popup(): JSX.Element {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>();
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
      try {
        const storage: Tab[] = await getDatabase();

        console.log('🚀 ~ getTabs ~ storage:', storage);
        if (storage) {
          setTabs([...storage].reverse());
        }
      } catch (error) {
        console.error('failed to get data', error);
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
        setBadgeBackground('#22c55e');
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

  if (!filteredTabs) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <img src={loadingIcon} className="w-[200px] h-[200px] self-center" alt="empty" />
      </div>
    );
  }

  if (filteredTabs.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <img src={emptyIcon} className="w-[200px] h-[200px] self-center" alt="empty" />
      </div>
    );
  }

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 h-full p-3 text-center bg-white">
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
      <input placeholder="Tab title" onChange={handleChangeQuery} className="px-3 px-4 text-sm border border-gray-400 rounded" autoFocus />
      <div className="flex flex-col gap-3">
        {filteredTabs.map((tab, index) => (
          <div className="flex flex-row items-center h-[80px] p-3 gap-x-4" key={tab.url}>
            <img src={getIcon(tab.url)} alt="tab icon" className="w-8 h-8" />
            <div
              className="flex flex-wrap items-center flex-1 w-full h-full overflow-hidden text-sm break-words overflow-ellipsis"
              onClick={(e) => openAndRemoveTab(e, index)}
            >
              {tab.title}
            </div>
            <FaTrash onClick={() => { removeTab(index); }} className="text-red-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
