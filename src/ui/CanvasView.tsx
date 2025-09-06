import { useEffect, useRef } from 'react';
import { Renderer } from '../infra/gpu/renderer';

export function CanvasView() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const renderer = new Renderer(canvas);
    rendererRef.current = renderer;

    renderer.start().catch(err => {
      console.error(err);
      const msg = document.createElement('div');
      msg.style.position = 'absolute';
      msg.style.top = '56px';
      msg.style.left = '12px';
      msg.style.color = '#f66';
      msg.style.fontFamily = 'system-ui, sans-serif';
      msg.textContent = 'WebGPU not available. Try different browser';
      document.body.appendChild(msg);
    });

    return () => renderer.dispose();
  }, []);

  return (
    <canvas
      ref={ref}
      id="viewport"
      style={{ display: 'block' }}
    />
  )
}