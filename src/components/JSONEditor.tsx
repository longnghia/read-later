import { useEffect, useRef } from 'react';
import { JSONEditor, JSONEditorPropsOptional } from 'vanilla-jsoneditor';

export default function VanillaJSONEditor(props: JSONEditorPropsOptional) {
  const refContainer = useRef<HTMLDivElement|null>(null);
  const refEditor = useRef<JSONEditor|null>(null);

  useEffect(() => {
    if (!refContainer.current) return () => {};

    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {},
    });

    return () => {
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }
  }, [props]);

  return <div className="flex flex-1" ref={refContainer} />;
}
