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
    <div key={url} className="gap-1 p-3 hover:cursor-pointer hover:bg-slate-200">
      <div className="flex flex-row items-center h-[80px] gap-x-4">
        <img src={getIcon(url)} alt="tab icon" className="w-8 h-8" />
        <div
          className="flex flex-wrap items-center w-full h-full overflow-hidden text-sm text-wrap text-start"
          onClick={onClick}
        >
          {title}
        </div>
        <FaTrash onClick={onRemove} className="text-red-500" />
      </div>
      <div className="px-4 h-[4] w-full bg-black" />
    </div>

  );
}
