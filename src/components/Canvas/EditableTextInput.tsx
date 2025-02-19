import {ChangeEvent, CSSProperties, KeyboardEvent} from "react";
import {Html} from "./Html";

interface EditableTextInputProps {
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

function getStyle(width: number, height: number): CSSProperties {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const baseStyle: CSSProperties = {
    width: `${width + 1}px`,
    height: `${height + 1}px`,
    padding: '0px',
    border: '0',
    margin: "0px",
    background: "none",
    outline: "none",
    resize: "none",
    color: "black",
    fontSize: "24px",
    lineHeight: "1",
    overflow: "hidden",
    fontFamily: "sans-serif",
    position: 'absolute',
    top: '0px',
    left: '0px',
    textAlign: 'center',
    transform: `translate(${0}px, ${0}px)`,
  };
  if (isFirefox) {
    return baseStyle;
  }
  return {
    ...baseStyle,
  };
}

export function EditableTextInput({
                                    x,
                                    y,
                                    width,
                                    height,
                                    value,
                                    onChange,
                                    onKeyDown,
                                  }: EditableTextInputProps) {
  const style = getStyle(width, height);
  return (
    <Html groupProps={{x, y}} divProps={{style: {opacity: 1}}}>
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={style}
      />
    </Html>
  );
}
