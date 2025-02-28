import {ChangeEvent, CSSProperties, KeyboardEvent} from "react";
import {Html} from "./Html";
import {TextBox} from "../../types/interfaces.tsx";

interface EditableTextInputProps {
  textBox: TextBox;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

function getStyle(textBox: TextBox): CSSProperties {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const baseStyle: CSSProperties = {
    width: `${textBox.width + 1}px`,
    height: `${textBox.height + 1}px`,
    padding: '0px',
    border: '0',
    margin: "0px",
    background: "none",
    outline: "none",
    resize: "none",
    color: textBox.fontColor,
    fontSize: `${textBox.fontSize}px`,
    lineHeight: "1",
    overflow: "hidden",
    fontFamily: textBox.fontFamily,
    fontWeight: textBox.fontWeight,
    textAlign: 'center',
  };
  if (isFirefox) {
    return baseStyle;
  }
  return {
    ...baseStyle,
  };
}

export function EditableTextInput({
                                    textBox,
                                    value,
                                    onChange,
                                    onKeyDown,
                                  }: EditableTextInputProps) {
  const style = getStyle(textBox);
  return (
    <Html groupProps={{x: textBox.x, y: textBox.y}} divProps={{style: {opacity: 1}}}>
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={style}
      />
    </Html>
  );
}
