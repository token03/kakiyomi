import {useRef, useEffect} from "react";
import {Text, Transformer} from "react-konva";
import konva from "konva";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

interface ResizableTextProps {
  x: number;
  y: number;
  text: string;
  isSelected: boolean;
  width: number;
  onResize: (width: number, height: number) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDoubleClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd: (x: number, y: number) => void;
}

export function ResizableText({
                                x,
                                y,
                                text,
                                isSelected,
                                width,
                                onResize,
                                onClick,
                                onDoubleClick,
                                onDragEnd
                              }: ResizableTextProps) {
  const textRef = useRef<konva.Text>(null);
  const transformerRef = useRef<konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

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
      onDragEnd(e.target.x(), e.target.y()); // Call onDragEnd with new x and y
    }
  }

  const transformer = isSelected ? (
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
        x={x}
        y={y}
        draggable
        ref={textRef}
        text={text}
        fill="black"
        align="center"
        fontFamily="sans-serif"
        fontSize={24}
        perfectDrawEnabled={false}
        onTransform={handleResize}
        onClick={onClick}
        onTap={onClick}
        onDblClick={onDoubleClick}
        onDblTap={onDoubleClick}
        width={width}
        onDragEnd={handleDragEnd} // Add onDragEnd handler to Text
      />
      {transformer}
    </>
  );
}
