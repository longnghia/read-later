import VanillaJSONEditor from '@src/components/JSONEditor';
import { Groups } from '@src/types';
import { getValue, setValue } from '@src/utils/storage';
import toast from '@src/utils/toast';
import { useCallback, useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { Content } from 'vanilla-jsoneditor';
import devdb from '../background/devdb';
import useError from '../popup/useError';

export default function GroupEditor() {
  const [groups, setGroups] = useState<Content>();
  const [saved, setSaved] = useState(false);

  const { onError } = useError();

  const getDatabase = useCallback(async () => {
    const storage = await getValue();
    const db: Groups = storage?.groups;
    return db ?? devdb.groups;
  }, []);

  const setDatabase = useCallback((data:Groups) => {
    setSaved(true);
    setValue({
      groups: data,
    })
      .catch(onError);
  }, [onError]);

  // TODO: validate url
  const onChange = (content: Content) => {
    setSaved(false);
    setGroups(content);
  };

  const onSave = () => {
    if (!groups) return;
    try {
      if ('text' in groups && groups.text) {
        setDatabase(JSON.parse(groups.text));
      }
      if ('json' in groups && groups.json) {
        setDatabase(groups.json as Groups);
      }
      toast({ title: 'Saved!', icon: 'success' });
    } catch (err) {
      console.error(err);
    }
  };

  // initial data
  useEffect(() => {
    async function getGroups() {
      try {
        const storage: Groups = await getDatabase();
        setGroups({ json: storage });
      } catch (err) { onError(err); }
    }
    getGroups();
  }, [getDatabase, onError]);

  // Confirmation if data is unsaved
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message = 'You have unsaved changes. Are you sure you want to leave?';

      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = message;
      return message;
    };
    if (!saved) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saved]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2 hover:cursor-pointer" onClick={onSave}>
        <FaSave className="text-blue-500" title="Save" />
        <span className="text-sm text-blue-500">Save</span>
      </div>
      <VanillaJSONEditor
        content={groups}
        onChange={onChange}
      />
    </div>
  );
}
