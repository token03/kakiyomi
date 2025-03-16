import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Layer, Line } from "react-konva";
import Konva from "konva";
import { LineData } from "../../types/interfaces.tsx";

interface PaintLayerProps {
  lines: LineData[]; // Receive lines as prop
  onLinesChange: (lines: LineData[]) => void; // Callback to update lines in parent
  isPaintModeEnabled: boolean;
  currentStrokeWidth: number;
}

export interface PaintLayerRef {
  clearLines: () => void;
  getLayer: () => Konva.Layer | null;
  handleMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  handleMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  handleMouseUp: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const PaintLayer: React.ForwardRefRenderFunction<
  PaintLayerRef,
  PaintLayerProps
> = (
  { lines, onLinesChange, isPaintModeEnabled, currentStrokeWidth }, // Receive lines and onLinesChange
  ref,
) => {
  const [tool, setTool] = useState<string>("pen");
  const isDrawing = useRef(false);
  const layerRef = useRef<Konva.Layer>(null);

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isPaintModeEnabled) return;
      isDrawing.current = true;
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        const newLine: LineData = {
          tool: tool as "pen" | "eraser",
          points: [pos.x, pos.y],
          strokeWidth: currentStrokeWidth,
        };
        onLinesChange([...lines, newLine]); // Use callback to update lines in parent
      }
    },
    [lines, tool, isPaintModeEnabled, currentStrokeWidth, onLinesChange],
  );

  const handleMouseMove = useCallback(
    (e: konva.KonvaEventObject<MouseEvent>) => {
      if (!isPaintModeEnabled) return;
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage?.getPointerPosition();
      if (point && lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        const updatedLine = {
          ...lastLine,
          points: lastLine.points.concat([point.x, point.y]),
        };
        const updatedLines = [...lines];
        updatedLines[lines.length - 1] = updatedLine;
        onLinesChange(updatedLines); // Use callback to update lines in parent
      }
    },
    [lines, isPaintModeEnabled, onLinesChange],
  );

  const handleMouseUp = useCallback(() => {
    if (!isPaintModeEnabled) return;
    isDrawing.current = false;
  }, [isPaintModeEnabled]);

  const clearLines = useCallback(() => {
    onLinesChange([]); // Use callback to clear lines in parent
  }, [onLinesChange]);

  const getLayer = useCallback(() => {
    return layerRef.current;
  }, []);

  useImperativeHandle(ref, () => ({
    clearLines: clearLines,
    getLayer: getLayer,
    handleMouseDown: handleMouseDown,
    handleMouseMove: handleMouseMove,
    handleMouseUp: handleMouseUp,
  }));

  return (
    <Layer ref={layerRef}>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          stroke="rgba(238, 232, 170, 0.8)"
          strokeWidth={line.strokeWidth}
          tension={0.7}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={
            line.tool === "eraser" ? "destination-out" : "source-over"
          }
        />
      ))}
    </Layer>
  );
};

export default forwardRef(PaintLayer);
