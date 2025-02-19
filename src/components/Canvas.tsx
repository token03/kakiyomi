import {Image, Layer, Stage} from 'react-konva';
import {useEffect, useRef, useState, useCallback} from "react";
import konva from 'konva';
import EditableText from "./Canvas/EditableText.tsx";
import useImage from 'use-image';

interface CanvasProps {
  initialText?: string;
  initialWidth?: number;
  initialHeight?: number;
  imageURL?: string;
  stageWidth?: number;
  stageHeight?: number;
}

const DEFAULT_STAGE_SIZE = 800;

export default function Canvas({
                                 initialText = "Click to resize. Double click to edit.",
                                 imageURL = 'https://i.redd.it/atxs52s7fnv21.jpg',
                                 stageWidth = DEFAULT_STAGE_SIZE,
                                 stageHeight = DEFAULT_STAGE_SIZE,
                               }: CanvasProps) {
  const sourceImageRef = useRef<konva.Layer>(null);
  const stageRef = useRef<konva.Stage>(null);

  const [text, setText] = useState(initialText);
  const [textWidth, setTextWidth] = useState(200);
  const [textHeight, setTextHeight] = useState(200);

  const [isTextSelected, setIsTextSelected] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [isTransformingText, setIsTransformingText] = useState(false);

  const [image] = useImage(imageURL);
  const [imageWidth, setImageWidth] = useState(stageWidth);
  const [imageHeight, setImageHeight] = useState(stageHeight);
  const [imageX, setImageX] = useState(0);

  const [textX, setTextX] = useState(20);
  const [textY, setTextY] = useState(40);


  useEffect(() => {
    if (image) {
      const originalWidth = image.naturalWidth;
      const originalHeight = image.naturalHeight;

      if (originalWidth && originalHeight) {
        const aspectRatio = originalWidth / originalHeight;
        const newImageHeight = stageHeight;
        const newImageWidth = newImageHeight * aspectRatio;

        setImageWidth(newImageWidth);
        setImageHeight(newImageHeight);

        const x = (stageWidth - newImageWidth) / 2;
        setImageX(x);
      } else {
        setImageWidth(stageWidth);
        setImageHeight(stageHeight);
        setImageX(0);
      }
    }
  }, [image, stageWidth, stageHeight]); // Depend on image, stageWidth, stageHeight


  const handleStageMouseDown = useCallback((e: konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnImage = e.target.getLayer() === sourceImageRef.current;
    if (clickedOnEmpty || clickedOnImage) {
      setIsTextSelected(false);
      setIsEditingText(false);
      setIsTransformingText(false);
    }
  }, []);

  useEffect(() => {
    if (!isTextSelected) {
      setIsEditingText(false);
      setIsTransformingText(false);
    }
  }, [isTextSelected]);


  const toggleEditMode = useCallback(() => {
    setIsEditingText((prev) => !prev);
    setIsTextSelected(true);
  }, []);

  const toggleTransformMode = useCallback(() => {
    setIsTransformingText((prev) => !prev);
    setIsTextSelected(true);
  }, []);

  const handleTextDragEnd = useCallback((newX: number, newY: number) => {
    setTextX(newX);
    setTextY(newY);
  }, []);


  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      onMouseDown={handleStageMouseDown}
      ref={stageRef}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '800px',
        height: '800px',
      }}
    >
      <Layer
        ref={sourceImageRef}
      >
        <Image
          image={image}
          width={imageWidth}
          height={imageHeight}
          x={imageX}
          y={0}
        />
      </Layer>
      <Layer>
        <EditableText
          x={textX}
          y={textY}
          text={text}
          width={textWidth}
          height={textHeight}
          onResize={(newWidth: number, newHeight: number) => {
            setTextWidth(newWidth);
            setTextHeight(newHeight);
          }}
          isEditing={isEditingText}
          isTransforming={isTransformingText}
          onToggleEdit={toggleEditMode}
          onToggleTransform={toggleTransformMode}
          onChange={setText}
          onDragEnd={handleTextDragEnd}
        />
      </Layer>
    </Stage>
  );
}
