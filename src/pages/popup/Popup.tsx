import {
  useState,
} from 'react';
import Checkbox from './Checkbox';
import PopupGroups from './PopupGroups';
import PopupTabs from './PopupTabs';
import { PopupMode } from './types';

export default function Popup(): JSX.Element {
  const [mode, setMode] = useState<PopupMode>('tabs');

  const renderContent = () => {
    switch (mode) {
      case 'tabs':
        return <PopupTabs />;
      case 'groups':
        return <PopupGroups />;
      default:
        return null;
    }
  };
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 h-full text-center bg-white">
      <div className="self-center items-center justify-center flex-row gap-4 m-4">
        <Checkbox value="tabs" mode={mode} label="Tabs" onChange={() => setMode('tabs')} />
        <Checkbox value="groups" mode={mode} label="Groups" onChange={() => setMode('groups')} />
      </div>
      <div className=" p-3 ">
        {renderContent()}
      </div>
    </div>
  );
}
