import {Image, Layer, Stage} from 'react-konva';
import {useCallback, useEffect, useRef, useState} from "react";
import konva from 'konva';
import useImage from 'use-image';
import TextLayer from "./Canvas/TextLayer";
import PaintLayer, {PaintLayerRef} from "./Canvas/PaintLayer";
import {Button, Grid, Stack, Slider, Text} from "@mantine/core";
import {TextBox} from "../types/interfaces.tsx";

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
  const paintLayerRef = useRef<PaintLayerRef>(null);

  const [textBoxes, setTextBoxes] = useState<TextBox[]>(() => {
    const initialTextBox: TextBox = {
      key: crypto.randomUUID(),
      text: initialText,
      x: 20,
      y: 40,
      width: 200,
      height: 200,
      isSelected: false,
      isEditing: false,
      isTransforming: false,
    };
    return [initialTextBox];
  });
  const [selectedTextBoxKey, setSelectedTextBoxKey] = useState<string | null>(textBoxes[0]?.key || null);
  const [isPaintModeEnabled, setIsPaintModeEnabled] = useState(false);
  const [paintStrokeWidth, setPaintStrokeWidth] = useState(5);


  const [image] = useImage(imageURL);
  const [imageWidth, setImageWidth] = useState(stageWidth);
  const [imageHeight, setImageHeight] = useState(stageHeight);
  const [imageX, setImageX] = useState(0);


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
  }, [image, stageWidth, stageHeight]);

  const deselectTextBoxes = useCallback(() => {
    setSelectedTextBoxKey(null);
    setTextBoxes(prevTextBoxes =>
      prevTextBoxes.map(textBox => ({
        ...textBox,
        isSelected: false,
        isEditing: false,
        isTransforming: false,
      }))
    );
  }, [setTextBoxes, setSelectedTextBoxKey]);


  const handleStageMouseDown = useCallback((e: konva.KonvaEventObject<MouseEvent>) => {
    if (isPaintModeEnabled) {
      paintLayerRef.current?.handleMouseDown(e);
      return;
    }

    const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnImage = e.target.getLayer() === sourceImageRef.current;

    if (clickedOnEmpty || clickedOnImage) {
      deselectTextBoxes();
    }
  }, [deselectTextBoxes, isPaintModeEnabled]);

  const handleStageMouseMove = useCallback((e: konva.KonvaEventObject<MouseEvent>) => {
    if (isPaintModeEnabled) {
      paintLayerRef.current?.handleMouseMove(e);
    }
  }, [isPaintModeEnabled]);

  const handleStageMouseUp = useCallback((e: konva.KonvaEventObject<MouseEvent>) => {
    if (isPaintModeEnabled) {
      paintLayerRef.current?.handleMouseUp(e);
    }
  }, [isPaintModeEnabled]);


  const handleTextLayerSelectionChange = useCallback((key: string | null) => {
    setSelectedTextBoxKey(key);
  }, []);

  const handleGetPaintData = () => {
    if (paintLayerRef.current) {
      const lines = paintLayerRef.current.getLines();
      console.log("Paint Data:", lines);
      downloadPaintLayer();
      // Here you can send 'lines' to your backend
    }
  };

  const handleClearPaintData = () => {
    if (paintLayerRef.current) {
      paintLayerRef.current.clearLines();
    }
  };

  const downloadPaintLayer = () => {
    const layer = paintLayerRef.current?.getLayer();
    if (layer) {
      const link = document.createElement("a");
      link.href = layer.toDataURL();
      link.download = "mask.png";
      link.click();
    }
  }

  useEffect(() => {
    if (isPaintModeEnabled) {
      deselectTextBoxes();
    }
  }, [isPaintModeEnabled, deselectTextBoxes]);


  return (
    <Stack>
      <Stage
        width={stageWidth}
        height={stageHeight}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
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
        <PaintLayer
          ref={paintLayerRef}
          isPaintModeEnabled={isPaintModeEnabled}
          currentStrokeWidth={paintStrokeWidth} // Pass currentStrokeWidth
        />
        <TextLayer
          textBoxes={textBoxes}
          setTextBoxes={setTextBoxes}
          onSelectionChange={handleTextLayerSelectionChange}
        />
      </Stage>
      <Grid gutter={"sm"}>
        <Grid.Col span={3}>
          <Button fullWidth variant="light" color="black" onClick={handleGetPaintData}>
            Get Paint Data
          </Button>
        </Grid.Col>
        <Grid.Col span={3}>
          <Button fullWidth variant="light" color="black" onClick={handleClearPaintData}>
            Clear Paint Data
          </Button>
        </Grid.Col>
        <Grid.Col span={3}>
          <Slider
            label={<Text size="sm">Stroke Width: {paintStrokeWidth}</Text>}
            value={paintStrokeWidth}
            onChange={(value) => setPaintStrokeWidth(value)}
            color={"black"}
            step={5}
            min={5}
            max={50}
            marks={[
              { value: 0, label: '0' },
              { value: 25, label: '25' },
              { value: 50, label: '50' },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Button
            variant={isPaintModeEnabled ? "filled" : "light"}
            fullWidth
            color="black"
            onClick={() => setIsPaintModeEnabled(!isPaintModeEnabled)}
          >
            Toggle Paint Mode: {isPaintModeEnabled ? "ON" : "OFF"}
          </Button>
        </Grid.Col>
      </Grid>
    </Stack>

  );
}
