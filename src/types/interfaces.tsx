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
}

export interface Point {
  x: number;
  y: number;
}

export interface LineData {
  tool: 'pen' | 'eraser';
  points: number[];
  strokeWidth: number;
}
