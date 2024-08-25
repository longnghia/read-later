import { isDev } from '@src/utils/env';
import { createTab, createTabs } from '@src/utils/tabs';
import { useState } from 'react';
import {
  FaCaretDown, FaCaretUp, FaEdit,
  FaTrash,
} from 'react-icons/fa';
import GroupEdit from './GroupEdit';

export default function GroupView({
  name,
  urls: initialUrls = [],
  onRemove,
  onUpdate,
  isEditMode = false,
}: {
  name: string;
  urls: string[];
  onRemove: () => void;
  onUpdate: (data: string[]) => void;
  isEditMode: boolean
}) {
  const [expanded, setExpanded] = useState(isDev);
  const [urls, setUrls] = useState(initialUrls);

  const onExpand = () => {
    setExpanded(true);
  };
  const onCollapse = () => {
    setExpanded(false);
  };
  const openEditPage = () => {
    createTab(chrome.runtime.getURL('groups/index.html'), true);
  };

  const updateGroup = (data: string[]) => {
    setUrls(data);
    onUpdate(data);
  };

  const renderUrls = () => {
    if (!expanded) return null;
    return (
      <>
        {urls.map((url) => (
          <div key={url}>{url}</div>
        ))}
      </>
    );
  };

  const renderTextArea = () => (
    <GroupEdit urls={urls} onSubmit={updateGroup} />
  );

  const openUrls = async () => {
    createTabs(urls);
  };

  return (
    <div>
      <div className="flex flex-row items-center my-2 font-semibold hover:bg-slate-200">
        <div className="hover:cursor-pointer" onClick={openUrls}>
          {name}
        </div>
        {expanded ? (
          <FaCaretUp className="hover:cursor-pointer" onClick={onCollapse} />
        ) : (
          <FaCaretDown className="hover:cursor-pointer" onClick={onExpand} />
        )}
        <div className="flex-1" />
        {!isEditMode ? (
          <FaEdit onClick={openEditPage} />
        ) : null}
        <FaTrash
          className="text-red-500 hover:cursor-pointer"
          onClick={onRemove}
        />
      </div>
      {!isEditMode ? renderUrls() : renderTextArea() }
    </div>
  );
}
