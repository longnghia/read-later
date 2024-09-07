import { Segmented } from 'antd';
import { useState } from 'react';
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
        return <PopupGroups isEditMode={false} />;
      default:
        return null;
    }
  };
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 h-full bg-white">
      <Segmented<PopupMode>
        options={[
          { label: 'Tabs', value: 'tabs' },
          { label: 'Groups', value: 'groups' }]}
        onChange={setMode}
        className="flex self-center"
      />
      <div className="p-3 ">
        {renderContent()}
      </div>
    </div>
  );
}
