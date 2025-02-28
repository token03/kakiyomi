import {useRef, useEffect} from "react";
import {Text, Transformer} from "react-konva";
import konva from "konva";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import {TextBox} from "../../types/interfaces.tsx";

interface ResizableTextProps {
  textBox: TextBox;
  onResize: (width: number, height: number) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDoubleClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd: (x: number, y: number) => void;
}

export function ResizableText({
                                textBox,
                                onResize,
                                onClick,
                                onDoubleClick,
                                onDragEnd
                              }: ResizableTextProps) {
  const textRef = useRef<konva.Text>(null);
  const transformerRef = useRef<konva.Transformer>(null);

  useEffect(() => {
    if (textBox.isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [textBox.isSelected]);

  function handleResize() {
    if (textRef.current !== null) {
      const textNode = textRef.current;
      const newWidth = textNode.width() * textNode.scaleX();
      const newHeight = textNode.height() * textNode.scaleY();
      textNode.setAttrs({
        width: newWidth,
        scaleX: 1
      });
      onResize(newWidth, newHeight);
    }
  }

  function handleDragEnd(e: KonvaEventObject<DragEvent>) {
    if (onDragEnd) {
      onDragEnd(e.target.x(), e.target.y());
    }
  }

  const transformer = textBox.isSelected ? (
    <Transformer
      ref={transformerRef}
      rotateEnabled={false}
      flipEnabled={false}
      enabledAnchors={["middle-left", "middle-right"]}
      boundBoxFunc={(_oldBox, newBox) => {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      }}
    />
  ) : null;

  return (
    <>
      <Text
        x={textBox.x}
        y={textBox.y}
        draggable
        ref={textRef}
        text={textBox.text}
        fill={textBox.fontColor}
        align="center"
        fontFamily={textBox.fontFamily}
        fontSize={textBox.fontSize}
        fontStyle={textBox.fontWeight}
        perfectDrawEnabled={false}
        onTransform={handleResize}
        onClick={onClick}
        onTap={onClick}
        onDblClick={onDoubleClick}
        onDblTap={onDoubleClick}
        width={textBox.width}
        onDragEnd={handleDragEnd}
      />
      {transformer}
    </>
  );
}
