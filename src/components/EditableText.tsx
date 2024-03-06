import React, { useState } from 'react';

type EditableTextProps = {
  onDoubleClick?: React.MouseEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  isEditable?: boolean;
  initialText?: string;
};

const EditableText = React.forwardRef<
  HTMLDivElement,
  EditableTextProps & { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, onDoubleClick, onBlur, onChange, isEditable, initialText }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText ?? '');

  const handleDoubleClick: React.MouseEventHandler<HTMLInputElement> = (event) => {
    if (!(isEditable ?? true)) return;
    setIsEditing(true);
    if (onDoubleClick) onDoubleClick(event);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    setIsEditing(false);
    if (onBlur) onBlur(event);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setText(event.target.value);
    if (onChange) onChange(event);
  };

  return (
    <div onDoubleClick={handleDoubleClick} className={className}>
      {isEditing ? (
        <span
          className="w-auto min-w-1 inline-block input"
          contentEditable
          onChange={handleChange}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
        >
          {text}
        </span>
      ) : (
        <span className="w-auto min-w-1 inline-block">{text}</span>
      )}
    </div>
  );
});

EditableText.displayName = 'EditableText';

export { EditableText };
