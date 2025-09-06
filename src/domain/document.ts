import { type Node, type RectNode } from "./node";
import { type NodeId } from "./types";

export class Document {
  private nodes: Node[] = [];

  add(node: Node): void {
    this.nodes.push(node);
  }

  all(): Node[] {
    return this.nodes;
  }

  find(id: NodeId): Node | undefined {
    return this.nodes.find(n=> n.id === id);
  }

  updateRect(id: NodeId, update: Partial<RectNode>): void {
    this.nodes = this.nodes.map(n=> {
      if (n.id !== id || n.kind !== "rect") return n;
      return { ...n, ...update };
    });
  }
}