import { createGpuContext, resizeCanvasToDisplaySize, type GpuContext } from "./device.ts";
import { SolidPipeline } from './pipelines/solid';
import solidWGSL from '../../../shaders/solid.wgsl?raw';
import { Document } from "../../domain/document";
import { type Node } from "../../domain/node";

export class Renderer {
  private readonly canvas: HTMLCanvasElement;
  private gc!: GpuContext;
  private rafId: number | null = null;
  private clearColor: GPUColor = {r: 0.10, g: 0.10, b: 0.10, a: 1.0 };
  private onResizeBound = () => this.onResize();

  private solid!: SolidPipeline;
  private doc: Document | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async start(): Promise<void> {
    this.gc = await createGpuContext(this.canvas);
    this.solid = new SolidPipeline(this.gc, solidWGSL);

    await new Promise(requestAnimationFrame);

    this.onResize();
    window.addEventListener('resize', this.onResizeBound);
    this.loop();
  }

  dispose(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResizeBound);
  }

  setScene(doc: Document): void {
    this.doc = doc;
  }

  setClearColor(color: GPUColor): void {
    this.clearColor = color;
  }

  private onResize(): void {
    resizeCanvasToDisplaySize(this.canvas);
    const rect = this.canvas.getBoundingClientRect();
    this.solid.updateViewSize(rect.width, rect.height);
  }

  private loop = (): void => {
    this.frame();
    this.rafId = requestAnimationFrame(this.loop);
  };

  private frame(): void {
    const { device, context } = this.gc;
    const encoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();
    const renderPass = encoder.beginRenderPass({
      colorAttachments: [{
        view: textureView,
        clearValue: this.clearColor,
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });

    if (this.doc) {
      const nodes: Node[] = this.doc.all();
      for (const n of nodes) {
        if (n.kind === "rect" && n.visible) {
          this.solid.draw(renderPass, { x: n.x, y: n.y, w: n.width, h: n.height }, n.fill);
        }
      }
    }

    renderPass.end();
    device.queue.submit([encoder.finish()]);
  }
}