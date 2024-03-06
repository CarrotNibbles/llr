import { cn } from '@/lib/utils';
import React, { useState } from 'react';

type EditableTextProps = {
  isEditable?: boolean;
  initialText: string;
};

const EditableText = React.forwardRef<
  HTMLDivElement,
  EditableTextProps & { className?: string } & React.ComponentPropsWithoutRef<'span'>
>(({ className, onDoubleClick, onBlur, onChange, isEditable, initialText }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [lastText, setLastText] = useState(initialText);

  const handleDoubleClick: React.MouseEventHandler<HTMLSpanElement> = (event) => {
    if (!(isEditable ?? true)) return;
    setIsEditing(true);
    setLastText(text);
    if (onDoubleClick) onDoubleClick(event);
  };

  const handleBlur: React.FocusEventHandler<HTMLSpanElement> = (event) => {
    setIsEditing(false);
    if (text.length === 0) setText(lastText);
    if (onBlur) onBlur(event);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setText(event.target.value);
    if (onChange) onChange(event);
  };

  return (
    <div onDoubleClick={handleDoubleClick} onBlur={handleBlur} className={className}>
      {isEditing ? (
        <input
          className="w-auto min-w-1 inline-flex input whitespace-nowrap"
          onChange={handleChange}
          value={text}
          size={30}
        />
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
});

EditableText.displayName = 'EditableText';

export { EditableText };
