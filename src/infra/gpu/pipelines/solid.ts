import { type GpuContext } from "../device";

export class SolidPipeline {
  private gc: GpuContext;
  private pipeline: GPURenderPipeline;
  private uniformBuf: GPUBuffer;
  private bindGroup: GPUBindGroup;
  private quad: GPUBuffer;

  constructor(gc: GpuContext, shaderCode: string) {
    this.gc = gc;

    const device = gc.device;

    this.uniformBuf = device.createBuffer({
      size: 8, // vec2<f32>
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    this.bindGroup = device.createBindGroup({
      layout: device.createBindGroupLayout({
        entries: [{
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "uniform" }
        }]
      }),
      entries: [{
        binding: 0,
        resource: { buffer: this.uniformBuf }
      }]
    });

    const module = device.createShaderModule({ code: shaderCode });

    this.pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module,
        entryPoint: "vs_main",
        buffers: [
          { arrayStride: 2 * 4, attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }], stepMode: "vertex" }, // pos
          { arrayStride: 4 * 4, attributes: [{ shaderLocation: 1, offset: 0, format: "float32x4" }], stepMode: "instance" }, // rect
          { arrayStride: 4 * 4, attributes: [{ shaderLocation: 2, offset: 0, format: "float32x4" }], stepMode: "instance" }  // color
        ]
      },
      fragment: {
        module, entryPoint: "fs_main",
        targets: [{ format: gc.format }]
      },
      primitive: { topology: "triangle-strip" }
    });

    const bindGroupLayout = this.pipeline.getBindGroupLayout(0);
    this.bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: this.uniformBuf }}]
    });

    this.quad = device.createBuffer({
      size: 4 * 2 * 4,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(this.quad, 0, new Float32Array([0,0, 1,0, 0,1, 1,1]));
  }

  updateViewSize(w: number, h: number): void {
    this.gc.device.queue.writeBuffer(this.uniformBuf, 0, new Float32Array([w, h]));
  }

  draw(
    pass: GPURenderPassEncoder,
    rect: { x: number, y: number, w: number, h: number },
    color: { r: number, g: number, b: number, a: number }): void {
    const device = this.gc.device;

    // Temp: we create buffers per draw for MVP. Later we'll do the batching
    const rectBuf = device.createBuffer({ size: 4 * 4, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(rectBuf, 0, new Float32Array([rect.x, rect.y, rect.w, rect.h]));

    const colBuf = device.createBuffer({ size: 4 * 4, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(colBuf, 0, new Float32Array([color.r, color.g, color.b, color.a]));

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.setVertexBuffer(0, this.quad);
    pass.setVertexBuffer(1, rectBuf);
    pass.setVertexBuffer(2, colBuf);
    pass.draw(4, 1, 0, 0);
  }
}
