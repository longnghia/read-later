import { useState } from 'react';
import { FaSave } from 'react-icons/fa';

export default function GroupEdit({
  urls,
  onSubmit,
}: {
  urls: string[];
  onSubmit: (data: string[]) => void;
}) {
  const [value, setValue] = useState(urls.join('\n'));
  const newUrls = value.split(/\s+/g).map((item) => item.trim());

  const submit = () => {
    onSubmit(newUrls);
  };

  return (
    <div className="flex-1">
      <textarea
        rows={4}
        className="w-full p-2 border rounded-lg"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <FaSave onClick={submit} />
    </div>
  );
}
