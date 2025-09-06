export type Brand<T, B> = T & { __brand: B };
export type NodeId = Brand<string, "NodeId">;
export type Color = {r: number, g: number, b: number, a: number};
export type Mat3 = [
  number, number, number,
  number, number, number,
  number, number, number
  ];

export function makeId(raw: string) : NodeId {
  return raw as NodeId;
}