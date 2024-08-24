/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { PopupMode } from './types';

export default function Checkbox({
  mode,
  label,
  ...rest
}: { mode: PopupMode, label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <span className="flex-row px-1 gap-2 items-center">
      {label}
      <input
        type="checkbox"
        checked={mode === rest.value}
        className="ml-2"
        {...rest}
      />
    </span>
  );
}
