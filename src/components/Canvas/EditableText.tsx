import React, {useCallback} from 'react';
import { ResizableText } from "./ResizableText";
import { EditableTextInput } from "./EditableTextInput";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

const ESCAPE_KEY = 27;

interface EditableTextProps {
  x: number;
  y: number;
  isEditing: boolean;
  isTransforming: boolean;
  isSelected: boolean;
  onToggleEdit: (e: KonvaEventObject<MouseEvent> | React.KeyboardEvent) => void;
  onToggleTransform: (e:  KonvaEventObject<MouseEvent>) => void;
  onChange: (text: string) => void;
  onResize: (width: number, height: number) => void;
  text: string;
  width: number;
  height: number;
  onDragEnd: (x: number, y: number) => void;
  onSelect: () => void;
}

function EditableText({
                        x,
                        y,
                        isEditing,
                        isSelected,
                        onToggleEdit,
                        onChange,
                        onResize,
                        text,
                        width,
                        height,
                        onDragEnd,
                        onSelect
                      }: EditableTextProps) {

  function handleEscapeKeys(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode === ESCAPE_KEY) {
      onToggleEdit(e);
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.currentTarget.value);
  }

  const handleTextClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    onSelect();
  }, [onSelect]);


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
      isSelected={isSelected}
      onClick={handleTextClick} // Use handleTextClick to ensure onSelect is called
      onDoubleClick={onToggleEdit}
      onResize={onResize}
      text={text}
      width={width}
      onDragEnd={onDragEnd}
    />
  );
}

export default EditableText;
