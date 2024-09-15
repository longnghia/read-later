import { getCurrentTabs } from '@src/utils/tabs';
import toast from '@src/utils/toast';
import React, {
  useCallback, useEffect, useState,
} from 'react';
import {
  FaCheckCircle,
} from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';

type NewGroupProps = {
  onSubmit: (data: {name: string; urls: string[]}) => void;
  onCancel: () => void
}

export function NewGroup({ onSubmit, onCancel }: NewGroupProps) {
  const [name, setName] = useState<string>('');
  const [urls, setUrls] = useState<string[]>([]);

  const getTabs = useCallback(async () => {
    const tabs = await getCurrentTabs(true);
    setUrls(tabs.map((item) => item.url!));
  }, []);

  const submit = () => {
    if (!name || urls.length === 0) {
      toast({ title: 'Invalid!', icon: 'error' });
      return;
    }
    onSubmit({ name, urls });
  };

  const onUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newUrls = e.target.value.split(',').map((item) => item.trim());
    setUrls(newUrls);
  };

  useEffect(() => {
    getTabs();
  }, [getTabs]);

  return (
    <div className="my-4">
      <div className="flex flex-row items-center gap-4">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex flex-1 px-4 w-full text-sm border border-gray-400 rounded"
          type="text"
          placeholder="New group"
        />
        <FaCircleXmark className="hover:cursor-pointer text-gray-500" onClick={onCancel} title="Cancel" />
        <FaCheckCircle className="hover:cursor-pointer text-blue-500" onClick={submit} title="Save" />
      </div>
      <textarea className="text-[10px] w-full h-[200px] p-2 border rounded-lg mt-3" value={urls.join(',\n')} onChange={onUrlsChange} />
    </div>
  );
}
