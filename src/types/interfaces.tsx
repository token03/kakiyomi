export interface TextBox {
  key: string;
  blockId?: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  isEditing: boolean;
  isTransforming: boolean;
  fontWeight: string;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
}

export interface SegmentData {
  textBoundingBox?: [number, number, number, number];
  bubbleBoundingBox?: [number, number, number, number];
  textClass?: string;
  inpaintBoundingBoxes?: [number, number, number, number][];
}

export interface Page {
  key: string;
  name: string;
  order: number;
  sourceImage: string;
  textBoxes: TextBox[];
  segmentData: SegmentData[];
  lines: LineData[];
}

export interface LineData {
  tool: 'pen' | 'eraser';
  points: number[];
  strokeWidth: number;
}
