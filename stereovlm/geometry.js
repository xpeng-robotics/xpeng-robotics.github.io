'use strict';

// Calibrated XYZ coordinates use one shared scale on all axes.
// The optional legacy conversion is also a pinhole back-projection, not a depth height field.
(() => {
  const canvas = document.getElementById('depth-canvas');
  const data = window.STEREO_POINT_CLOUD;
  const legacy = window.STEREO_DEPTH_FIELD;
  const points = data?.points || legacy?.map(p => {
    const u = Math.round((p[0] * 400 + 400) / 3) * 3;
    const v = Math.round((p[1] * 400 + 160) / 3) * 3;
    return [(u - 400) * p[2] / 267, (v - 160) * p[2] / 267, p[2], p[3], p[2]];
  });
  if (!canvas || !points?.length) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const initial = {yaw: -0.22, pitch: 0.62};
  let yaw = initial.yaw, pitch = initial.pitch;
  let colorMode = 'rgb', width = 0, height = 0, drag = null, frame = null;
  const depths = points.map(p => p[4]).sort((a,b) => a-b);
  const nearDepth = depths[Math.floor(depths.length * .03)];
  const depthSpan = Math.max(.01,depths[Math.floor(depths.length * .97)] - nearDepth);
  const colors = points.map(p => {
    const t = Math.max(0,Math.min(1,(p[4]-nearDepth)/depthSpan));
    const near = [181,218,137], far = [161,133,219];
    return [
      `rgb(${near.map((n,i)=>Math.round(n+(far[i]-n)*t)).join(',')})`,
      `rgb(${p[3] >> 16},${(p[3] >> 8) & 255},${p[3] & 255})`
    ];
  });
  function render() {
    frame = null;
    if (!width || !height) return;
    ctx.clearRect(0,0,width,height);
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    let xmin=Infinity,xmax=-Infinity,ymin=Infinity,ymax=-Infinity;
    const projected = points.map((p,i) => {
      const x=p[0]*cy+p[2]*sy, z=-p[0]*sy+p[2]*cy;
      const y=p[1]*cp-z*sp, distance=p[1]*sp+z*cp;
      xmin=Math.min(xmin,x);xmax=Math.max(xmax,x);ymin=Math.min(ymin,y);ymax=Math.max(ymax,y);
      return {x,y,distance,i};
    });
    // Robust framing excludes distant outliers from camera bounds only.
    // All points retain their measured XYZ and remain in the rendered scene.
    const xs=projected.map(p=>p.x).sort((a,b)=>a-b);
    const ys=projected.map(p=>p.y).sort((a,b)=>a-b);
    const lo=Math.floor(points.length*.02), hi=Math.floor(points.length*.98);
    xmin=xs[lo];xmax=xs[hi];ymin=ys[lo];ymax=ys[hi];
    // Orthographic camera with a uniform XYZ scale: parallel planes remain planes.
    const scale=Math.min((width-34)/Math.max(.01,xmax-xmin),(height-88)/Math.max(.01,ymax-ymin));
    const ox=width/2-(xmin+xmax)*scale/2, oy=(height+10)/2-(ymin+ymax)*scale/2;
    projected.sort((a,b)=>b.distance-a.distance);
    const size=Math.max(1.3,Math.min(2.4,width/260));
    for (const p of projected) {
      ctx.fillStyle=colors[p.i][colorMode==='rgb'?1:0];
      ctx.fillRect(ox+p.x*scale-size/2,oy+p.y*scale-size/2,size,size);
    }
  }
  function schedule(){if(frame===null)frame=requestAnimationFrame(render);}
  function resize(){
    const box=canvas.getBoundingClientRect();width=box.width;height=box.height;
    const ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);schedule();
  }
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw,pitch};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{
    if(!drag)return;
    yaw=Math.max(-1.3,Math.min(1.3,drag.yaw+(e.clientX-drag.x)*.006));
    pitch=Math.max(-.4,Math.min(1.2,drag.pitch+(e.clientY-drag.y)*.005));schedule();
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach(event=>canvas.addEventListener(event,()=>drag=null));
  function reset(){yaw=initial.yaw;pitch=initial.pitch;schedule();}
  canvas.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;
    e.preventDefault();
    if(e.key==='Home')reset();
    if(e.key==='ArrowLeft')yaw=Math.max(-1.3,yaw-.08);
    if(e.key==='ArrowRight')yaw=Math.min(1.3,yaw+.08);
    if(e.key==='ArrowUp')pitch=Math.max(-.4,pitch-.08);
    if(e.key==='ArrowDown')pitch=Math.min(1.2,pitch+.08);
    schedule();
  });
  const buttons=[...document.querySelectorAll('[data-color]')];
  buttons.forEach(button=>{
    button.setAttribute('aria-pressed',String(button.dataset.color===colorMode));
    button.addEventListener('click',()=>{
      colorMode=button.dataset.color;
      buttons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));schedule();
    });
  });
  document.getElementById('reset-view').addEventListener('click',reset);
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize',resize);
  resize();
})();
