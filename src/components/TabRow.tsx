import { Tab } from '@src/types';
import { getIcon } from '@src/utils/tabs';
import {
  MouseEvent,
} from 'react';
import { FaTrash } from 'react-icons/fa';

export default function TabRow({
  data,
  onClick,
  onRemove,
}: {
  data: Tab;
  // eslint-disable-next-line no-unused-vars
  onClick: (event: MouseEvent) => void;
  onRemove: () => void;
}) {
  const { url, title } = data;
  return (
    <div key={url} className="flex items-center justify-between flex-1 gap-1 p-2 mb-2 border border-gray-300 rounded hover:cursor-pointer hover:bg-slate-200">
      <div className="flex flex-1 flex-row items-center h-[52px] gap-x-4">
        <img src={getIcon(url)} alt="tab icon" className="w-8 h-8" />
        <div
          className="flex flex-wrap items-center flex-1 h-full overflow-hidden text-xs"
          onClick={onClick}
        >
          {title}
        </div>
        <FaTrash onClick={onRemove} className="text-red-500" />
      </div>
    </div>

  );
}
