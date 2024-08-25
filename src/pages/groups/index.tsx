import { createRoot } from 'react-dom/client';
import '@assets/styles/tailwind.css';
import ReactModal from 'react-modal';
import PopupGroups from '../popup/PopupGroups';

ReactModal.setAppElement('#__root');

function init() {
  const rootContainer = document.querySelector('#__root');
  if (!rootContainer) throw new Error("Can't find Groups root element");
  const root = createRoot(rootContainer);
  root.render(
    <div className="p-4">
      <PopupGroups isEditMode />
    </div>,
  );
}

init();
