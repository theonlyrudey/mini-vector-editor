import { createGpuContext, resizeCanvasToDisplaySize, type GpuContext } from "./device.ts";

export class Renderer {
  private readonly canvas: HTMLCanvasElement;
  private gc!: GpuContext;
  private rafId: number | null = null;
  private clearColor: GPUColor = {r: 0.10, g: 0.10, b: 0.10, a: 1.0 };
  private onResizeBound = () => this.onResize();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async start(): Promise<void> {
    this.gc = await createGpuContext(this.canvas);
    resizeCanvasToDisplaySize(this.canvas);
    window.addEventListener('resize', this.onResizeBound);
    this.loop();
  }

  dispose(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResizeBound);
  }

  setClearColor(color: GPUColor): void {
    this.clearColor = color;
  }

  private onResize(): void {
    resizeCanvasToDisplaySize(this.canvas);
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

    renderPass.end();

    device.queue.submit([encoder.finish()]);
  }
}