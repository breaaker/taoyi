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
    // Stretch the gripped strip; compress the whole wall evenly.
    // Both gestures keep the foot fixed on the wheel.
    const segmentWeights=base.heights.slice(1).map((_,i)=>falloff(i+.5-index));
    const activeLength=segmentWeights.reduce((sum,w,i)=>sum+w*(base.heights[i+1]-base.heights[i]),0);
    const requested=clamp(base.heights[RINGS]+verticalIntent,MIN_HEIGHT,MAX_HEIGHT)-base.heights[RINGS];
    const strain=activeLength>0?clamp(requested/activeLength,-.65,1.5):0;
    const result=cloneShape(base);
    const compressing=verticalIntent<0;
    const globalScale=(base.heights[RINGS]+requested)/base.heights[RINGS];
    for(let i=1;i<=RINGS;i++){
      const spacing=base.heights[i]-base.heights[i-1];
      result.heights[i]=compressing?base.heights[i]*globalScale:
        result.heights[i-1]+spacing*(1+strain*segmentWeights[i-1]);
    }
    for(let i=0;i<=RINGS;i++){
      // A subtle width cue; vertical gestures must not create a thin ledge.
      const widthResponse=compressing?
        clamp(.04*(1-globalScale)*base.radii[i],0,.008):
        clamp(-.025*strain*weights[i]*base.radii[i],-.008,0);
      result.radii[i]=clamp(base.radii[i]+radialIntent*weights[i]+widthResponse,.13,1);
    }
    return result;
  }

  window.PotteryEngine = { ...(window.PotteryEngine || {}), cloneShape, shapeFromGesture };
}());
