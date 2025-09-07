import { useEffect, useRef } from 'react';
import { Renderer } from '../infra/gpu/renderer';
import { Document } from '../domain/document'
import { createRect } from '../domain/node'

export function CanvasView() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const renderer = new Renderer(canvas);
    rendererRef.current = renderer;

    renderer.start().then(() => {
      const doc = new Document();
      doc.add(createRect(100, 100, 200, 120,
        { r: 0.9, g: 0.2, b: 0.2, a: 1.0 }));
      renderer.setScene(doc);
    }).catch(err => {
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