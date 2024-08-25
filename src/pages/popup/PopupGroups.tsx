import emptyIcon from '@assets/img/empty.svg';
import loadingIcon from '@assets/img/loading.svg';
import { Groups } from '@src/types';
import { getValue, setValue } from '@src/utils/storage';
import { createTab } from '@src/utils/tabs';
import toast from '@src/utils/toast';
import {
  useCallback, useEffect, useState,
} from 'react';
import { FaEdit, FaPlusCircle } from 'react-icons/fa';
import Modal from 'react-modal';
import GroupView from './GroupView';
import useError from './useError';

export default function PopupGroups({ isEditMode }:{isEditMode: boolean}): JSX.Element {
  const [groups, setGroups] = useState<Groups>({});
  const [filteredGroups, setFilteredGroups] = useState<Groups>();
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectGroup] = useState<string|null>(null);
  const [newGroup, setNewGroup] = useState<string| null>(null);
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

  const updateGroup = (groupName: string, newUrls: string[]) => {
    setGroups({ ...groups, [groupName]: newUrls });
    toast({ title: 'Saved!', text: groupName, icon: 'success' });
    if (newGroup) {
      setNewGroup(null);
    }
  };

  const openEditPage = () => {
    createTab(chrome.runtime.getURL('groups/index.html'), true);
  };

  const closeModal = () => {
    setSelectGroup(null);
  };

  const handleChangeQuery = useCallback(
    (event: { target: { value: string } }) => setQuery(event.target.value),
    [],
  );

  const renderNewGroup = () => {
    if (newGroup === null) return null;
    return (
      <div className="mt-12">
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input value={newGroup} onChange={(e) => setNewGroup(e.target.value)} autoFocus />
        <GroupView
          name={newGroup}
          urls={[]}
          isEditMode
          onUpdate={(newUrls) => { updateGroup(newGroup, newUrls); }}
        />
      </div>
    );
  };

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

  if (filteredGroupNames.length === 0 && !newGroup && !query) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4">
        <img
          src={emptyIcon}
          className="w-[200px] h-[200px] self-center"
          alt="empty"
        />
        <span>Add New Group!</span>
        <FaPlusCircle className="hover:cursor-pointer" onClick={() => { setNewGroup('New group'); }} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row items-center gap-4">
        <input
          placeholder="Groups title"
          onChange={handleChangeQuery}
          className="px-4 text-sm border border-gray-400 rounded"
        // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        <FaPlusCircle onClick={() => { setNewGroup('New group'); }} />
        {!isEditMode ? (
          <FaEdit onClick={openEditPage} />
        ) : null}
      </div>
      {renderNewGroup()}
      <div className="flex flex-col mt-4">
        {filteredGroupNames.map((groupName) => (
          <GroupView
            key={groupName}
            name={groupName}
            onRemove={() => { setSelectGroup(groupName); }}
            onUpdate={(newUrls) => { updateGroup(groupName, newUrls); }}
            urls={filteredGroups[groupName]}
            isEditMode={isEditMode}
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
