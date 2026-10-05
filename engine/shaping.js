(function () {
  'use strict';

  const RINGS = 112;
  const clamp = (value,low,high) => Math.max(low,Math.min(high,value));
  const SUPPORT = 16;
  const MIN_HEIGHT = .50;
  const MAX_HEIGHT = 2.70;

  function falloff(distance) {
    const t=clamp(Math.abs(distance)/SUPPORT,0,1);
    return 1-3*t*t+2*t*t*t;
  }

  function smoothstep(low,high,value) {
    const t=clamp((value-low)/(high-low),0,1);
    return t*t*(3-2*t);
  }

  function cloneShape(shape) {
    return {radii:[...shape.radii],heights:[...shape.heights],
      clayMass:Number.isFinite(shape.clayMass)?shape.clayMass:window.PotteryEngine.shellVolume(shape.radii,shape.heights,.055)};
  }

  // Compute from the shape at pointer-down, never from the preceding frame.
  // This makes reversal within a stroke smooth and gives every stroke its own cap.
  function shapeFromGesture(base,{anchor,dx,dy,side}) {
    const index=clamp(Math.round(anchor),0,RINGS);
    const outward=side<0?-dx:dx;
    const radialIntent=.12*Math.tanh(outward/80);
    const verticalIntent=.25*Math.tanh(-dy/85);
    const weights=base.radii.map((_,i)=>falloff(i-index));
    // Pulling the middle carries the clay above the fingers with it. A broad
    // strain through the whole wall keeps the gesture effective without making
    // a sharp ledge where the local grip fades out.
    const rawHeight=i=>.48*i/RINGS+.52*smoothstep(index-24,index+24,i);
    const bottomWeight=rawHeight(0),weightSpan=rawHeight(RINGS)-bottomWeight;
    const heightWeights=weights.map((_,i)=>(rawHeight(i)-bottomWeight)/weightSpan);
    const result=cloneShape(base);
    // The full profile follows the pull, while a small extra displacement is
    // centred on the grip. Global scaling keeps short forms reachable even
    // after many compressions at the same spot.
    const targetHeight=clamp(base.heights[RINGS]+verticalIntent,MIN_HEIGHT,MAX_HEIGHT);
    const applied=targetHeight-base.heights[RINGS];
    const scale=targetHeight/base.heights[RINGS];
    const localDeltas=heightWeights.map((weight,i)=>applied*.18*(weight-i/RINGS));
    let localScale=1;
    for(let i=1;i<=RINGS;i++){
      const delta=localDeltas[i]-localDeltas[i-1];
      if(delta<0)localScale=Math.min(localScale,.8*scale*(base.heights[i]-base.heights[i-1])/-delta);
    }
    for(let i=1;i<=RINGS;i++)result.heights[i]=base.heights[i]*scale+localDeltas[i]*localScale;
    // Height changes affect the full wall. Spread the small width response
    // through the full profile so repeated compressions do not build a belt
    // around the grip; horizontal pushes remain local.
    const radialChanges=weights.map((weight,i)=>
      radialIntent*weight+clamp(-.22*applied/base.heights[RINGS]*base.radii[i],-.08,.08));
    for(let i=0;i<=RINGS;i++){
      result.radii[i]=clamp(base.radii[i]+radialChanges[i],.13,1.0);
    }
    return result;
  }

  window.PotteryEngine = { ...(window.PotteryEngine || {}), cloneShape, shapeFromGesture };
}());
