import React, {forwardRef, useCallback, useImperativeHandle, useRef, useState} from 'react';
import {Layer, Line} from 'react-konva';
import Konva from "konva";
import {LineData} from "../../types/interfaces.tsx";


interface PaintLayerProps {
  initialLines?: LineData[];
  isPaintModeEnabled: boolean;
  currentStrokeWidth: number; // Receive current stroke width from parent
}

export interface PaintLayerRef {
  getLines: () => LineData[];
  clearLines: () => void;
  getLayer: () => Konva.Layer | null;
  handleMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  handleMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  handleMouseUp: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const PaintLayer: React.ForwardRefRenderFunction<PaintLayerRef, PaintLayerProps> = (
  {initialLines = [], isPaintModeEnabled, currentStrokeWidth}, // Destructure currentStrokeWidth
  ref
) => {
  const [tool, setTool] = useState<string>('pen');
  const [lines, setLines] = useState<LineData[]>(initialLines);
  const isDrawing = useRef(false);
  const layerRef = useRef<Konva.Layer>(null);

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isPaintModeEnabled) return;
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setLines([...lines, {
        tool: tool as 'pen' | 'eraser',
        points: [pos.x, pos.y],
        strokeWidth: currentStrokeWidth // Capture current strokeWidth here
      }]);
    }
  }, [lines, tool, isPaintModeEnabled, currentStrokeWidth]); // Add currentStrokeWidth to dependencies

  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isPaintModeEnabled) return;
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (point) {
      const lastLine = lines[lines.length - 1];
      if (lastLine) {
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
      }
    }
  }, [lines, isPaintModeEnabled]);

  const handleMouseUp = useCallback(() => {
    if (!isPaintModeEnabled) return;
    console.log("PaintLayer: Mouse Up");
    isDrawing.current = false;
  }, [isPaintModeEnabled]);

  const getLines = useCallback(() => {
    return lines;
  }, [lines]);

  const clearLines = useCallback(() => {
    setLines([]);
  }, []);

  const getLayer = useCallback(() => {
    return layerRef.current;
  }, []);

  useImperativeHandle(ref, () => ({
    getLines: getLines,
    clearLines: clearLines,
    getLayer: getLayer,
    handleMouseDown: handleMouseDown,
    handleMouseMove: handleMouseMove,
    handleMouseUp: handleMouseUp,
  }));


  return (
    <Layer
      ref={layerRef}
    >
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          stroke= 'rgba(238, 232, 170, 0.8)'
          strokeWidth={line.strokeWidth} // Use line's individual strokeWidth
          tension={0.7}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={
            line.tool === 'eraser' ? 'destination-out' : 'source-over'
          }
        />
      ))}
    </Layer>
  );
};

export default forwardRef(PaintLayer);
