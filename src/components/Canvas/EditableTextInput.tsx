import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useRef,
  useEffect,
} from "react";
import { Html } from "./Html";
import { TextBox } from "../../types/interfaces.tsx";

interface EditableTextInputProps {
  textBox: TextBox;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

function getStyle(textBox: TextBox): CSSProperties {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const baseStyle: CSSProperties = {
    width: `${textBox.width}px`, // Match textBox width exactly
    padding: "0px",
    border: "none",
    margin: "0px",
    background: "none",
    outline: "none",
    resize: "none",
    color: textBox.fontColor,
    fontSize: `${textBox.fontSize}px`,
    lineHeight: "1", // Could be made configurable via TextBox if needed
    overflow: "hidden",
    fontFamily: textBox.fontFamily,
    fontWeight: textBox.fontWeight,
    textAlign: "center",
    transformOrigin: "left top",
  };
  if (isFirefox) {
    // Slight adjustment for Firefox as in demo
    return { ...baseStyle, transform: "translateY(-2px)" };
  }
  return baseStyle;
}

export function EditableTextInput({
  textBox,
  value,
  onChange,
  onKeyDown,
}: EditableTextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const style = getStyle(textBox);

  // Adjust textarea height dynamically when value changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${textarea.scrollHeight + 3}px`; // Set to content height
    }
  }, [value]);

  // Focus and select textarea on mount
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.select(); // Optional: Selects all text for easy replacement
    }
  }, []);

  // Enhance onKeyDown to exit on Enter (without Shift)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      // Enter key without Shift exits editing
      onKeyDown(e); // This will trigger handleEscapeKeys in EditableText if mapped correctly
    } else {
      onKeyDown(e); // Pass through other key events (e.g., Escape)
    }
  };

  return (
    <Html
      groupProps={{ x: textBox.x, y: textBox.y }}
      divProps={{ style: { opacity: 1 } }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        style={style}
      />
    </Html>
  );
}
