struct VSIn {
  @location(0) pos: vec2<f32>,
  @location(1) rect: vec4<f32>, //x, y, w, h
  @location(2) color: vec4<f32>
};

struct VSOut {
  @builtin(position) pos: vec4<f32>,
  @location(0) color: vec4<f32>
};

@group(0) @binding(0) var<uniform> viewSize: vec2<f32>;

@vertex
fn vs_main(input: VSIn) -> VSOut {
  var out: VSOut;
  let p = input.rect.xy + input.pos * input.rect.zw;
  let clip = (p / viewSize * 2.0 - vec2(1.0, 1.0)) * vec2(1.0, -1.0);
  out.pos = vec4(clip, 0.0, 1.0);
  out.color = input.color;
  return out;
}

@fragment
fn fs_main(input: VSOut) -> @location(0) vec4<f32> {
  return input.color;
}