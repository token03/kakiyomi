import React, { useState, useCallback } from "react";
import { Layer } from "react-konva";
import EditableText from "./EditableText.tsx";
import { TextBox } from "../../types/interfaces.tsx";

interface TextLayerProps {
  textBoxes: TextBox[];
  setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>;
  onSelectionChange: (key: string | null) => void;
}

const TextLayer: React.FC<TextLayerProps> = ({
  textBoxes,
  setTextBoxes,
  onSelectionChange,
}) => {
  const [selectedTextBoxKey, setSelectedTextBoxKey] = useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (textBoxes.length > 0 && selectedTextBoxKey === null) {
      setSelectedTextBoxKey(textBoxes[0].key);
      onSelectionChange(textBoxes[0].key);
    }
  }, [textBoxes, selectedTextBoxKey, onSelectionChange]);

  const handleTextSelect = useCallback(
    (key: string) => {
      setSelectedTextBoxKey(key);
      onSelectionChange(key);
      setTextBoxes((prevTextBoxes) =>
        prevTextBoxes.map((textBox) => ({
          ...textBox,
          isSelected: textBox.key === key,
          isEditing: textBox.key === key ? textBox.isEditing : false,
          isTransforming: textBox.key === key ? textBox.isTransforming : false,
        })),
      );
    },
    [setTextBoxes, onSelectionChange],
  );

  const toggleEditMode = useCallback(
    (key: string) => {
      setTextBoxes((prevTextBoxes) =>
        prevTextBoxes.map((textBox) =>
          textBox.key === key
            ? {
                ...textBox,
                isEditing: !textBox.isEditing,
                isTransforming: false,
                isSelected: true,
              }
            : textBox,
        ),
      );
      setSelectedTextBoxKey(key);
      onSelectionChange(key);
    },
    [setTextBoxes, onSelectionChange],
  );

  const toggleTransformMode = useCallback(
    (key: string) => {
      setTextBoxes((prevTextBoxes) =>
        prevTextBoxes.map((textBox) =>
          textBox.key === key
            ? {
                ...textBox,
                isTransforming: !textBox.isTransforming,
                isEditing: false,
                isSelected: true,
              }
            : textBox,
        ),
      );
      setSelectedTextBoxKey(key);
      onSelectionChange(key);
    },
    [setTextBoxes, onSelectionChange],
  );

  const handleTextChange = useCallback(
    (key: string, newText: string) => {
      setTextBoxes((prevTextBoxes) =>
        prevTextBoxes.map((textBox) =>
          textBox.key === key ? { ...textBox, text: newText } : textBox,
        ),
      );
    },
    [setTextBoxes],
  );

  const handleTextResize = useCallback(
    (key: string, newWidth: number, newHeight: number) => {
      setTextBoxes((prevTextBoxes) =>
        prevTextBoxes.map((textBox) =>
          textBox.key === key
            ? { ...textBox, width: newWidth, height: newHeight }
            : textBox,
        ),
      );
    },
    [setTextBoxes],
  );

  const handleTextDragEnd = useCallback(
    (key: string, newX: number, newY: number) => {
      setTextBoxes((prevTextBoxes) =>
        prevTextBoxes.map((textBox) =>
          textBox.key === key ? { ...textBox, x: newX, y: newY } : textBox,
        ),
      );
    },
    [setTextBoxes],
  );

  return (
    <Layer>
      {textBoxes.map((textBox) => (
        <EditableText
          key={textBox.key}
          textBox={textBox}
          onToggleEdit={() => toggleEditMode(textBox.key)}
          onToggleTransform={() => toggleTransformMode(textBox.key)}
          onChange={(newText) => handleTextChange(textBox.key, newText)}
          onResize={(newWidth: number, newHeight: number) =>
            handleTextResize(textBox.key, newWidth, newHeight)
          }
          onDragEnd={(newX: number, newY: number) =>
            handleTextDragEnd(textBox.key, newX, newY)
          }
          onSelect={() => handleTextSelect(textBox.key)}
        />
      ))}
    </Layer>
  );
};

export default TextLayer;
