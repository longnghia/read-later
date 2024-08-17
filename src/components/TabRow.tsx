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
    <div className="flex flex-row items-center h-[80px] p-3 gap-x-4" key={url}>
      <img src={getIcon(url)} alt="tab icon" className="w-8 h-8" />
      <div
        className="flex flex-wrap items-center flex-1 w-full h-full overflow-hidden text-sm break-words overflow-ellipsis"
        onClick={onClick}
      >
        {title}
      </div>
      <FaTrash onClick={onRemove} className="text-red-500" />
    </div>
  );
}
