import VanillaJSONEditor from '@src/components/JSONEditor';
import { Groups } from '@src/types';
import { getValue, setValue } from '@src/utils/storage';
import { useCallback, useEffect, useState } from 'react';
import { Content } from 'vanilla-jsoneditor';
import { FaSave } from 'react-icons/fa';
import toast from '@src/utils/toast';
import useError from '../popup/useError';

export default function GroupEditor() {
  const [groups, setGroups] = useState<Content>();
  const { onError } = useError();

  const getDatabase = useCallback(async () => {
    const storage = await getValue();
    const db: Groups = storage?.groups ?? [];
    return db;
  }, []);

  const setDatabase = useCallback((data:Groups) => {
    setValue({
      groups: data,
    })
      .catch(onError);
  }, [onError]);

  // TODO: validate url
  const onChange = (content: Content) => {
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

  useEffect(() => {
    async function getGroups() {
      try {
        const storage: Groups = await getDatabase() ?? {};
        setGroups({ json: storage });
      } catch (err) { onError(err); }
    }
    getGroups();
  }, [getDatabase, onError]);

  return (
    <div className="flex flex-col gap-4">
      <FaSave className="text-blue-500 hover:cursor-pointer" onClick={onSave} />
      <VanillaJSONEditor
        content={groups}
        onChange={onChange}
      />
    </div>
  );
}
