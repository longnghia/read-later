import emptyIcon from '@assets/img/empty.svg';
import loadingIcon from '@assets/img/loading.svg';
import { animated, useTransition } from '@react-spring/web';
import TabRow from '@src/components/TabRow';
import { Tab } from '@src/types';
import { setBadge, setBadgeBackground } from '@src/utils/badge';
import { getValue, setValue } from '@src/utils/storage';
import { createTab } from '@src/utils/tabs';
import {
  MouseEvent, useCallback, useEffect, useState,
} from 'react';

export default function PopupTabs(): JSX.Element {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>();
  const [query, setQuery] = useState('');

  const transitions = useTransition(tabs, {
    keys: (item) => item.url,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

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
        <img
          src={loadingIcon}
          className="w-[200px] h-[200px] self-center"
          alt="loading"
        />
      </div>
    );
  }

  if (filteredTabs.length === 0 && !query) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4">
        <img
          src={emptyIcon}
          className="w-[200px] h-[200px] self-center"
          alt="empty"
        />
        <span>
          Add a tab by
          {' '}
          <code>control + b</code>
          !
        </span>
      </div>
    );
  }

  return (
    <div>
      <input
        placeholder="Tab title"
        onChange={handleChangeQuery}
        className="px-4 text-sm border border-gray-400 rounded"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
      <div className="flex flex-col mt-4">
        {transitions((style, item, t, index) => (
          <animated.li style={style} key={item.url} className="flex items-center justify-between p-2 mb-2 border border-gray-300 rounded">
            <TabRow
              key={item.url}
              data={item}
              onClick={(e) => openAndRemoveTab(e, index)}
              onRemove={() => {
                removeTab(index);
              }}
            />
          </animated.li>
        ))}
      </div>
    </div>
  );
}
