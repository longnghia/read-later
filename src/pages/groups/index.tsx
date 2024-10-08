import '@assets/styles/tailwind.css';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';
import GroupEditor from './GroupEditor';

ReactModal.setAppElement('#__root');

function init() {
  const rootContainer = document.querySelector('#__root');
  if (!rootContainer) throw new Error("Can't find Groups root element");
  const root = createRoot(rootContainer);
  root.render(
    <div className="p-4">
      <GroupEditor />
    </div>,
  );
}

init();
