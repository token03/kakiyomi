import React, { useCallback } from "react";
import { ResizableText } from "./ResizableText";
import { EditableTextInput } from "./EditableTextInput";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import { TextBox } from "../../types/interfaces.tsx";

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

interface EditableTextProps {
  textBox: TextBox;
  onToggleEdit: (e: KonvaEventObject<MouseEvent> | React.KeyboardEvent) => void;
  onToggleTransform: (e: KonvaEventObject<MouseEvent>) => void;
  onChange: (text: string) => void;
  onResize: (width: number, height: number) => void;
  onDragEnd: (x: number, y: number) => void;
  onSelect: () => void;
}

function EditableText({
  textBox,
  onToggleEdit,
  onChange,
  onResize,
  onDragEnd,
  onSelect,
}: EditableTextProps) {
  function handleEscapeKeys(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode === ESCAPE_KEY || (e.keyCode === ENTER_KEY && !e.shiftKey)) {
      onToggleEdit(e);
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.currentTarget.value);
  }

  const handleTextClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      onSelect();
    },
    [onSelect],
  );

  if (textBox.isEditing) {
    return (
      <EditableTextInput
        textBox={textBox}
        value={textBox.text}
        onChange={handleTextChange}
        onKeyDown={handleEscapeKeys}
      />
    );
  }
  return (
    <ResizableText
      textBox={textBox}
      onClick={handleTextClick}
      onDoubleClick={onToggleEdit}
      onResize={onResize}
      onDragEnd={onDragEnd}
    />
  );
}

export default EditableText;
