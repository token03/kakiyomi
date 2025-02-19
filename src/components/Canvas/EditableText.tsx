import React from 'react';
import {ResizableText} from "./ResizableText";
import {EditableTextInput} from "./EditableTextInput";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

const ESCAPE_KEY = 27;

interface EditableTextProps {
  x: number;
  y: number;
  isEditing: boolean;
  isTransforming: boolean;
  onToggleEdit: (e: KonvaEventObject<MouseEvent> | React.KeyboardEvent) => void;
  onToggleTransform: (e: KonvaEventObject<MouseEvent>) => void;
  onChange: (text: string) => void;
  onResize: (width: number, height: number) => void;
  text: string;
  width: number;
  height: number;
  onDragEnd: (x: number, y: number) => void; // Assuming onDragEnd takes x and y as parameters, adjust if needed based on ResizableText implementation
}

function EditableText({
                        x,
                        y,
                        isEditing,
                        isTransforming,
                        onToggleEdit,
                        onToggleTransform,
                        onChange,
                        onResize,
                        text,
                        width,
                        height,
                        onDragEnd // Add onDragEnd prop
                      }: EditableTextProps) {
  function handleEscapeKeys(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode === ESCAPE_KEY) {
      onToggleEdit(e);
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.currentTarget.value);
  }

  if (isEditing) {
    return (
      <EditableTextInput
        x={x}
        y={y}
        width={width}
        height={height}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleEscapeKeys}
      />
    );
  }
  return (
    <ResizableText
      x={x}
      y={y}
      isSelected={isTransforming}
      onClick={onToggleTransform}
      onDoubleClick={onToggleEdit}
      onResize={onResize}
      text={text}
      width={width}
      onDragEnd={onDragEnd} // Pass onDragEnd to ResizableText
    />
  );
}

export default EditableText;
