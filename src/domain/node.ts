import { type NodeId, type Mat3, type Color, makeId } from "./types"

export type RectNode = {
  kind: "rect",
  id: NodeId,
  x: number,
  y: number,
  width: number,
  height: number
  fill: Color;
  transform: Mat3;
  visible: boolean;
};

export type Node = RectNode; //Temporarily only rect

export function createRect(
  x: number, y: number, w: number, h: number, fill: Color): RectNode {
  return {
    kind: "rect",
    id: makeId(crypto.randomUUID()),
    x, y, width: w, height: h,
    fill,
    transform: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    visible: true
  };
}