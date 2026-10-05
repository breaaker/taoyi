(function () {
  'use strict';

  const PROFILE = [
    [0.00, 0.28], [0.035, 0.31], [0.10, 0.40], [0.24, 0.54],
    [0.40, 0.63], [0.55, 0.61], [0.70, 0.49], [0.81, 0.34],
    [0.91, 0.285], [0.97, 0.295], [1.00, 0.32]
  ];
  const HEIGHT = 1.72;
  const WALL = 0.055;
  const RINGS = 112;
  const SIDES = 128;
  const COS = Array.from({length:SIDES+1},(_,i)=>Math.cos(i*Math.PI*2/SIDES));
  const SIN = Array.from({length:SIDES+1},(_,i)=>Math.sin(i*Math.PI*2/SIDES));
  let cachedIndices=null;
  function shellVolume(radii,heights,wall){
    let volume=0;
    for(let i=1;i<heights.length;i++){
      const area=r=>Math.PI*(r*r-Math.max(.065,r-wall)**2);
      volume+=(area(radii[i-1])+area(radii[i]))*.5*(heights[i]-heights[i-1]);
    }
    return volume;
  }

  function radiusAt(t) {
    for (let i = 1; i < PROFILE.length; i++) {
      if (t <= PROFILE[i][0]) {
        const before = PROFILE[i - 1];
        const after = PROFILE[i];
        const f = (t - before[0]) / (after[0] - before[0]);
        const f2 = f*f, f3 = f2*f, span = after[0]-before[0];
        const previous = PROFILE[Math.max(0,i-2)];
        const next = PROFILE[Math.min(PROFILE.length-1,i+1)];
        const startSlope = (after[1]-previous[1]) / (after[0]-previous[0]);
        const endSlope = (next[1]-before[1]) / (next[0]-before[0]);
        return (2*f3-3*f2+1)*before[1] + (f3-2*f2+f)*span*startSlope
             + (-2*f3+3*f2)*after[1] + (f3-f2)*span*endSlope;
      }
    }
    return PROFILE[PROFILE.length - 1][1];
  }

  function createPotShape() {
    const raw = Array.from({length:RINGS+1},(_,i)=>radiusAt(i/RINGS));
    const smooth = values => values.map((_,i) => {
      const sample = offset => values[Math.max(0,Math.min(RINGS,i+offset))];
      return (sample(-2)+4*sample(-1)+6*sample(0)+4*sample(1)+sample(2))/16;
    });
    const radii=smooth(smooth(raw)),heights=Array.from({length:RINGS+1},(_,i)=>HEIGHT*i/RINGS);
    return {radii,heights,clayMass:shellVolume(radii,heights,WALL)};
  }

  function createClayBlank() {
    const smooth=(a,b,t)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x);};
    const radii=Array.from({length:RINGS+1},(_,i)=>{const t=i/RINGS;return .30+.14*smooth(0,.16,t)-.018*smooth(.78,1,t);});
    const heights=Array.from({length:RINGS+1},(_,i)=>1.38*i/RINGS);
    return {radii,heights,clayMass:shellVolume(radii,heights,WALL)};
  }

  function createPotMesh(shape = createPotShape(),options={}) {
    const rings = RINGS;
    const sides = SIDES;
    const vertices = [];
    const indices = [];
    const buildIndices=!cachedIndices;
    const {radii,heights}=shape;
    if(radii.length!==rings+1||heights.length!==rings+1)throw new Error('器型采样数不匹配');
    const vesselHeight=heights[rings];
    let wall=WALL;
    if(Number.isFinite(shape.clayMass)&&shape.clayMass>0){
      let low=.012,high=.22;
      if(high>low){
        for(let step=0;step<24;step++){
          const middle=(low+high)/2;
          if(shellVolume(radii,heights,middle)<shape.clayMass)low=middle;else high=middle;
        }
        wall=high;
      }
    }

    function vertex(r, y, c, s, normal, u, v, zone) {
      vertices.push(r * c, y, r * s, ...normal, u, v, zone);
      return vertices.length / 9 - 1;
    }
    function quad(a, b, c, d) {
      if(buildIndices)indices.push(a, b, c, a, c, d);
    }
    function roundedRimNormal(c,s,slope,inner,t) {
      const direction=inner?-1:1;
      const length=Math.hypot(1,slope);
      const blend=Math.max(0,Math.min(1,(t-.93)/.07));
      const easing=blend*blend*(3-2*blend);
      const x=direction*c/length,y=-direction*slope/length+easing,z=direction*s/length;
      const blendLength=Math.hypot(x,y,z);
      return [x/blendLength,y/blendLength,z/blendLength];
    }
    const outer = [];
    const inner = [];
    for (let i = 0; i <= rings; i++) {
      const t = i / rings;
      const r = radii[i];
      const low = Math.max(0,i-1), high = Math.min(rings,i+1);
      const slope = (radii[high]-radii[low]) / (heights[high]-heights[low]);
      const exterior = [];
      const interior = [];
      for (let j = 0; j <= sides; j++) {
        const u = j / sides;
        const c=COS[j],s=SIN[j];
        const n = Math.hypot(1, slope);
        const v=heights[i]/vesselHeight;
        exterior.push(vertex(r, heights[i], c, s, roundedRimNormal(c,s,slope,false,t), u, v, 0));
        interior.push(vertex(Math.max(.065, r - wall), heights[i], c, s, roundedRimNormal(c,s,slope,true,t), u, v, 2));
      }
      outer.push(exterior);
      inner.push(interior);
      if (i) for (let j = 0; j < sides; j++) {
        quad(outer[i-1][j], outer[i-1][j+1], outer[i][j+1], outer[i][j]);
        quad(inner[i-1][j+1], inner[i-1][j], inner[i][j], inner[i][j+1]);
      }
    }

    // A separately lit annulus makes the rim read as actual wall thickness.
    const lipOuter = [], lipInner = [];
    const lipSlope=(radii[rings]-radii[rings-1])/(heights[rings]-heights[rings-1]);
    for (let j = 0; j <= sides; j++) {
      const u = j / sides,c=COS[j],s=SIN[j];
      lipOuter.push(vertex(radii[rings], vesselHeight, c, s, roundedRimNormal(c,s,lipSlope,false,1), u, 1, 1));
      lipInner.push(vertex(Math.max(.065,radii[rings] - wall), vesselHeight, c, s, roundedRimNormal(c,s,lipSlope,true,1), u, 1, 1.1));
      if (j) quad(lipOuter[j-1], lipOuter[j], lipInner[j], lipInner[j-1]);
    }

    // Closing the cavity prevents the pedestal from showing through the pot.
    const floorCenter = vertex(0, .035, 1, 0, [0, 1, 0], 0, 0, 2);
    const floor = [];
    for (let j = 0; j <= sides; j++) {
      const u = j / sides;
      floor.push(vertex(Math.max(.065,radii[0] - wall), .035, COS[j], SIN[j], [0, 1, 0], u, 0, 2));
      if (j&&buildIndices) indices.push(floorCenter, floor[j], floor[j-1]);
    }
    // The stand shares the pot's projection and depth buffer, so the foot
    // cannot float above a separately positioned CSS ellipse.
    const standRadius = options.photoStand ? .90 : .78;
    const standTop = options.photoStand?-.008:-.025;
    const standBottom = options.photoStand ? -.27 : -.13;
    const standCenter = vertex(0,standTop,1,0,[0,1,0],0,0,3);
    const standTopEdge=[],standBottomEdge=[];
    for(let j=0;j<=sides;j++){
      const u=j/sides,c=COS[j],s=SIN[j];
      standTopEdge.push(vertex(standRadius,standTop,c,s,[0,1,0],u,0,3));
      standBottomEdge.push(vertex(standRadius,standBottom,c,s,[c,0,s],u,0,3));
      if(j){
        if(buildIndices)indices.push(standCenter,standTopEdge[j-1],standTopEdge[j]);
        quad(standBottomEdge[j-1],standBottomEdge[j],standTopEdge[j],standTopEdge[j-1]);
      }
    }
    if(buildIndices)cachedIndices=new Uint16Array(indices);
    return { vertices: new Float32Array(vertices), indices: cachedIndices, height: vesselHeight, rimRadius:radii[rings], wallThickness:wall, clayMass:shellVolume(radii,heights,wall) };
  }

  window.PotteryEngine = { ...(window.PotteryEngine || {}), createPotShape, createClayBlank, createPotMesh, shellVolume, PROFILE, HEIGHT, RINGS };
}());
