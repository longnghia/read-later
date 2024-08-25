import emptyIcon from '@assets/img/empty.svg';
import loadingIcon from '@assets/img/loading.svg';
import { Groups } from '@src/types';
import { getValue, setValue } from '@src/utils/storage';
import {
  useCallback, useEffect, useState,
} from 'react';
import GroupView from './GroupView';
import useError from './useError';

export default function PopupGroups(): JSX.Element {
  const [groups, setGroups] = useState<Groups>({});
  const [filteredGroups, setFilteredGroups] = useState<Groups>();
  const [query, setQuery] = useState('');

  const { error, onError } = useError();
  const filteredGroupNames = Object.keys(filteredGroups ?? {});

  const getDatabase = useCallback(async () => {
    const storage = await getValue();
    const db: Groups = storage?.groups ?? [];
    return db;
  }, []);

  useEffect(() => {
    async function getGroups() {
      try {
        const storage: Groups = await getDatabase() ?? {};
        setGroups(storage);
      } catch (err) { onError(err); }
    }
    getGroups();
  }, [getDatabase, onError]);

  const setStorage = useCallback((data:Groups) => {
    setValue({
      groups: data,
    })
      .catch(onError);
  }, [onError]);

  const removeGroup = async (groupName: string) => {
    const temp = { ...groups };
    if (temp[groupName]) {
      delete temp[groupName];
      setGroups(temp);
    } else {
      onError(`no group ${groupName}`);
    }
  };

  const handleChangeQuery = useCallback(
    (event: { target: { value: string } }) => setQuery(event.target.value),
    [],
  );

  // update groups on query
  useEffect(() => {
    const queryStorage = async () => {
      const temp = Object.entries(groups).reduce<Groups>((acc, [groupName, urls]) => {
        if (groupName.includes(query)) {
          acc[groupName] = urls;
        }
        return acc;
      }, {});
      setFilteredGroups(temp);
    };
    const timeout = setTimeout(() => {
      queryStorage();
    }, 800);
    return () => clearTimeout(timeout);
  }, [query, groups]);

  useEffect(() => {
    setStorage(groups);
  }, [setStorage, groups]);

  if (!filteredGroups) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <img
          src={loadingIcon}
          className="w-[200px] h-[200px] self-center"
          alt="empty"
        />
      </div>
    );
  }

  if (!filteredGroups) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <img
          src={loadingIcon}
          className="w-[200px] h-[200px] self-center"
          alt="empty"
        />
      </div>
    );
  }

  if (filteredGroupNames.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <img
          src={emptyIcon}
          className="w-[200px] h-[200px] self-center"
          alt="empty"
        />
      </div>
    );
  }

  return (
    <div>
      <input
        placeholder="Groups title"
        onChange={handleChangeQuery}
        className="px-4 text-sm border border-gray-400 rounded"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
      <div className="flex flex-col mt-4">
        {filteredGroupNames.map((groupName) => (
          <GroupView
            key={groupName}
            name={groupName}
            onRemove={() => { removeGroup(groupName); }}
            urls={filteredGroups[groupName]}
          />
        ))}
      </div>
      {error ? <div className="text-red-500">{error}</div> : null}
    </div>
  );
}
