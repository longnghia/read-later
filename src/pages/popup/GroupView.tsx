import { isDev } from '@src/utils/env';
import { createTabs } from '@src/utils/tabs';
import { useState } from 'react';
import { FaCaretDown, FaCaretUp, FaTrash } from 'react-icons/fa';

export default function GroupView({
  name,
  urls: initialUrls = [],
  onRemove,
}: {
  name: string;
  urls: string[];
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(isDev);
  const [urls, setUrls] = useState(initialUrls);

  const onExpand = () => {
    setExpanded(true);
  };
  const onCollapse = () => {
    setExpanded(false);
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

  const openUrls = async () => {
    createTabs(urls);
  };

  // TODO: manuplate urls

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
        <FaTrash
          className="text-red-500 hover:cursor-pointer"
          onClick={onRemove}
        />
      </div>
      {renderUrls()}
    </div>
  );
}
