import emptyIcon from '@assets/img/empty.svg';
import loadingIcon from '@assets/img/loading.svg';
import { Groups } from '@src/types';
import { getValue, setValue } from '@src/utils/storage';
import { createTab } from '@src/utils/tabs';
import toast from '@src/utils/toast';
import {
  useCallback, useEffect, useState,
} from 'react';
import {
  FaEdit, FaPlusCircle,
} from 'react-icons/fa';
import Modal from 'react-modal';
import GroupView from './GroupView';
import { NewGroup } from './NewGroup';
import useError from './useError';

export default function PopupGroups({ isEditMode }:{isEditMode: boolean}): JSX.Element {
  const [groups, setGroups] = useState<Groups>({});
  const [filteredGroups, setFilteredGroups] = useState<Groups>();
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectGroup] = useState<string|null>(null);
  const [showsNewGroup, setShowsNewGroup] = useState(false);
  const { error, onError } = useError();
  const filteredGroupNames = Object.keys(filteredGroups ?? {});

  const showNewGroup = () => {
    setShowsNewGroup(true);
  };
  const hideNewGroup = () => {
    setShowsNewGroup(false);
  };

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

  const removeGroup = async () => {
    if (!selectedGroup) return;
    const temp = { ...groups };
    if (temp[selectedGroup]) {
      delete temp[selectedGroup];
      setGroups(temp);
      toast({ title: 'Removed!', text: selectedGroup, icon: 'success' });
    } else {
      onError(`no group ${selectedGroup}`);
      toast({ title: 'Error!', icon: 'error' });
    }
    setSelectGroup(null);
  };

  const addGroup = async ({ name, urls }:{name: string, urls: string[]}) => {
    const temp = { ...groups };
    if (!temp[name]) {
      temp[name] = urls;
      setGroups(temp);
      hideNewGroup();
      toast({ title: 'Success!', text: `Group ${name.toUpperCase()} added`, icon: 'success' });
    } else {
      toast({ title: 'Error!', text: `${name.toUpperCase()} existed!`, icon: 'error' });
    }
  };

  const openEditPage = () => {
    createTab(chrome.runtime.getURL('groups/index.html'), true);
    setTimeout(() => {
      window.close();
    }, 250);
  };

  const closeModal = () => {
    setSelectGroup(null);
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
          alt="loading"
        />
      </div>
    );
  }

  if (filteredGroupNames.length === 0 && !query) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4">
        <img
          src={emptyIcon}
          className="w-[200px] h-[200px] self-center"
          alt="empty"
        />
        <span>Add New Group!</span>
        <FaPlusCircle className="hover:cursor-pointer" onClick={openEditPage} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row items-center gap-4">
        <input
          placeholder="Search Group"
          onChange={handleChangeQuery}
          className="px-4 w-full text-sm border border-gray-400 rounded"
        // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        <FaPlusCircle className="hover:cursor-pointer" onClick={showNewGroup} />
        {!isEditMode ? (
          <FaEdit className="hover:cursor-pointer" onClick={openEditPage} />
        ) : null}
      </div>
      {showsNewGroup
        ? (
          <NewGroup onSubmit={addGroup} onCancel={hideNewGroup} />
        )
        : null}
      <div className="flex flex-col mt-4">
        {filteredGroupNames.map((groupName) => (
          <GroupView
            key={groupName}
            name={groupName}
            onRemove={() => { setSelectGroup(groupName); }}
            urls={filteredGroups[groupName]}
          />
        ))}
      </div>
      {error ? <div className="text-red-500">{error}</div> : null}
      <Modal
        isOpen={!!selectedGroup}
        onRequestClose={() => { setSelectGroup(null); }}
        contentLabel="Remove Group"
      >
        <span className="text-center">
          Are you sure to remove
          <b>
            {` ${selectedGroup}?`}
          </b>
        </span>
        <div className="flex flex-row items-center justify-around flex-1 gap-4 p-4">
          <button className="p-3 border border-black rounded-lg" type="button" onClick={closeModal}>Cancel</button>
          <button className="p-3 text-white bg-red-500 rounded-lg" type="button" onClick={removeGroup}>Confirm</button>
        </div>
      </Modal>
    </div>
  );
}
