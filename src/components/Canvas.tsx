// Canvas.tsx
import {Image, Layer, Stage} from 'react-konva';
import {useCallback, useEffect, useRef, useState} from "react";
import konva from 'konva';
import useImage from 'use-image';
import TextLayer from "./Canvas/TextLayer";
import PaintLayer, {PaintLayerRef} from "./Canvas/PaintLayer";
import {Button, Grid, Stack, Slider, Text} from "@mantine/core";
import {TextBox, LineData} from "../types/interfaces.tsx";

interface CanvasProps {
  imageURL: string;
  initialTextBoxes?: TextBox[];
  initialLines?: LineData[];
  stageWidth?: number;
  stageHeight?: number;
}

const DEFAULT_STAGE_SIZE = 800;

export default function Canvas({
                                 imageURL,
                                 initialTextBoxes = [],
                                 initialLines = [],
                                 stageWidth: propStageWidth = DEFAULT_STAGE_SIZE,
                                 stageHeight: propStageHeight = DEFAULT_STAGE_SIZE,
                               }: CanvasProps) {
  const sourceImageRef = useRef<konva.Layer>(null);
  const stageRef = useRef<konva.Stage>(null);
  const paintLayerRef = useRef<PaintLayerRef>(null);

  const [textBoxes, setTextBoxes] = useState<TextBox[]>(initialTextBoxes);
  const [selectedTextBoxKey, setSelectedTextBoxKey] = useState<string | null>(textBoxes[0]?.key || null);
  const [isPaintModeEnabled, setIsPaintModeEnabled] = useState(false);
  const [paintStrokeWidth, setPaintStrokeWidth] = useState(5);
  const [paintLines, setPaintLines] = useState<LineData[]>(initialLines);


  const [image] = useImage(imageURL);
  const [imageWidth, setImageWidth] = useState(propStageWidth);
  const [imageHeight, setImageHeight] = useState(propStageHeight);
  const [imageX, setImageX] = useState(0);
  const [stageWidth, setStageWidth] = useState(propStageWidth);
  const [stageHeight, setStageHeight] = useState(propStageHeight);


  useEffect(() => {
    if (image) {
      const originalWidth = image.naturalWidth;
      const originalHeight = image.naturalHeight;

      if (originalWidth && originalHeight) {
        setStageWidth(originalWidth);
        setStageHeight(originalHeight);
        setImageWidth(originalWidth);
        setImageHeight(originalHeight);
        setImageX(0);
      } else {
        setStageWidth(propStageWidth);
        setStageHeight(propStageHeight);
        setImageWidth(propStageWidth);
        setImageHeight(propStageHeight);
        setImageX(0);
      }
    }
  }, [image, propStageWidth, propStageHeight]);

  useEffect(() => {
    setTextBoxes(initialTextBoxes);
  }, [initialTextBoxes]);

  useEffect(() => {
    setPaintLines(initialLines);
  }, [initialLines]);


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
    console.log("Paint Data:", paintLines);
    downloadPaintLayer();
  };

  const handleClearPaintData = () => {
    setPaintLines([]);
    paintLayerRef.current?.clearLines();
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

  const handlePaintLinesChange = useCallback((newLines: LineData[]) => {
    setPaintLines(newLines);
  }, []);


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
          maxWidth: '100%',
          height:'auto',
          display: 'flex',
          justifyContent: 'center',
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
          currentStrokeWidth={paintStrokeWidth}
          lines={paintLines}
          onLinesChange={handlePaintLinesChange}
        />
        <TextLayer
          textBoxes={textBoxes}
          setTextBoxes={setTextBoxes}
          onSelectionChange={handleTextLayerSelectionChange}
        />
      </Stage>
      <Grid gutter={"sm"}>
        <Grid.Col span={2}>
          <Button fullWidth variant="light" color="black" onClick={handleGetPaintData}>
            Get Paint Data
          </Button>
        </Grid.Col>
        <Grid.Col span={2}>
          <Button fullWidth variant="light" color="black" onClick={handleClearPaintData}>
            Clear Paint Data
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
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
        <Grid.Col span={4}>
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
