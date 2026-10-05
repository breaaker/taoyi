(function () {
  'use strict';
  const TAU=Math.PI*2;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const length=v=>Math.hypot(...v);
  const normalize=v=>v.map(x=>x/(length(v)||1));
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  function radiusAtHeight(shape,y){
    const heights=shape.heights,radii=shape.radii;
    if(y<0||y>heights[heights.length-1])return null;
    let low=0,high=heights.length-1;
    while(high-low>1){const mid=(low+high)>>1;if(heights[mid]<y)low=mid;else high=mid;}
    const t=(y-heights[low])/(heights[high]-heights[low]||1);
    return radii[low]*(1-t)+radii[high]*t;
  }
  function raycastPotDetail(shape,camera,spin,x,y,viewWidth,viewHeight){
    if(!viewWidth||!viewHeight)return null;
    const target=[0,camera.targetY??.92,0];
    const eye=[Math.sin(camera.yaw)*camera.distance,target[1]+Math.sin(camera.pitch)*camera.distance,Math.cos(camera.yaw)*camera.distance];
    const backward=normalize(eye.map((value,i)=>value-target[i]));
    const right=normalize(cross([0,1,0],backward));
    const up=cross(backward,right),tan=Math.tan(18*Math.PI/180),aspect=viewWidth/viewHeight;
    const nx=(x/viewWidth*2-1)*tan*aspect,ny=(1-y/viewHeight*2)*tan;
    const dir=normalize(right.map((value,i)=>value*nx+up[i]*ny-backward[i]));
    let previous=null;
    const maximum=camera.distance+2.5,step=.025;
    for(let t=.1;t<=maximum;t+=step){
      const point=eye.map((value,i)=>value+dir[i]*t),radius=radiusAtHeight(shape,point[1]);
      if(radius===null){previous=null;continue;}
      const difference=Math.hypot(point[0],point[2])-radius;
      if(previous&&previous.difference>0&&difference<=0){
        let low=previous.t,high=t;
        for(let i=0;i<12;i++){
          const mid=(low+high)*.5,mx=eye[0]+dir[0]*mid,my=eye[1]+dir[1]*mid,mz=eye[2]+dir[2]*mid;
          if(Math.hypot(mx,mz)-radiusAtHeight(shape,my)>0)low=mid;else high=mid;
        }
        const hit=(low+high)*.5,worldX=eye[0]+dir[0]*hit,worldZ=eye[2]+dir[2]*hit,worldY=eye[1]+dir[1]*hit;
        const localX=Math.cos(spin)*worldX+Math.sin(spin)*worldZ;
        const localZ=-Math.sin(spin)*worldX+Math.cos(spin)*worldZ;
        const u=(Math.atan2(localZ,localX)/TAU+1)%1;
        return {u,v:clamp(worldY/shape.heights[shape.heights.length-1],0,1),y:worldY,point:[worldX,worldY,worldZ],exact:true};
      }
      previous={t,difference};
    }
    return null;
  }
  function raycastPot(shape,camera,spin,x,y,viewWidth,viewHeight){
    const hit=raycastPotDetail(shape,camera,spin,x,y,viewWidth,viewHeight);
    return hit?[hit.u,hit.v]:null;
  }
  // A finger may land just outside the silhouette. Snap only a short distance to
  // the projected, camera-facing surface; never infer height from screen Y alone.
  function pickPotSurface(shape,camera,spin,x,y,viewWidth,viewHeight,projectPoint,tolerance=36){
    const exact=raycastPotDetail(shape,camera,spin,x,y,viewWidth,viewHeight);
    if(exact||!projectPoint)return exact;
    let best=null,bestSquared=tolerance*tolerance;
    const count=shape.heights.length;
    for(let i=0;i<count;i+=2){
      const radius=shape.radii[i],height=shape.heights[i];
      for(let j=0;j<17;j++){
        const angle=camera.yaw+(j/16-.5)*Math.PI;
        const worldX=Math.sin(angle)*radius,worldZ=Math.cos(angle)*radius;
        const screen=projectPoint([worldX,height,worldZ]);
        const squared=(screen.x-x)**2+(screen.y-y)**2;
        if(squared>=bestSquared)continue;
        const localX=Math.cos(spin)*worldX+Math.sin(spin)*worldZ;
        const localZ=-Math.sin(spin)*worldX+Math.cos(spin)*worldZ;
        bestSquared=squared;
        best={u:(Math.atan2(localZ,localX)/TAU+1)%1,v:height/shape.heights[count-1],y:height,point:[worldX,height,worldZ],exact:false};
      }
    }
    return best;
  }
  function addSurfacePoint(points,point){
    if(!point)return false;
    const last=points[points.length-1];
    if(!last){points.push([...point]);return true;}
    let u=point[0];while(u-last[0]>.5)u-=1;while(u-last[0]<-.5)u+=1;
    if(Math.hypot((u-last[0])*2.6,(point[1]-last[1])*1.7)<.002)return false;
    points.push([u,point[1]]);return true;
  }
  function resamplePath(points,step=.006){
    if(points.length<2)return points.map(point=>[...point]);
    const output=[[...points[0]]];let carry=0;
    for(let i=1;i<points.length;i++){
      const start=points[i-1],end=points[i],dx=(end[0]-start[0])*2.6,dy=(end[1]-start[1])*1.7,segment=Math.hypot(dx,dy);
      if(segment<1e-7)continue;
      let along=step-carry;
      while(along<=segment){const t=along/segment;output.push([start[0]+(end[0]-start[0])*t,start[1]+(end[1]-start[1])*t]);along+=step;}
      carry=segment-(along-step);
    }
    const end=points[points.length-1],last=output[output.length-1];
    if(Math.hypot((end[0]-last[0])*2.6,(end[1]-last[1])*1.7)>step*.3)output.push([...end]);
    else output[output.length-1]=[...end];
    return output;
  }
  function smoothPath(points,strength=.55){
    const amount=clamp(strength,0,1);
    if(points.length<3||amount===0)return resamplePath(points);
    let current=points.map(point=>[...point]);
    for(let pass=0;pass<3;pass++){
      current=current.map((point,i)=>{
        if(i===0||i===current.length-1)return [...point];
        const before=current[i-1],after=current[i+1];
        const ax=(point[0]-before[0])*2.6,ay=(point[1]-before[1])*1.7;
        const bx=(after[0]-point[0])*2.6,by=(after[1]-point[1])*1.7;
        const cosine=(ax*bx+ay*by)/(Math.hypot(ax,ay)*Math.hypot(bx,by)||1);
        const corner=clamp((cosine-.2)/.65,0,1);
        const factor=amount*.52*corner;
        return [point[0]+(before[0]+after[0]-2*point[0])*.5*factor,point[1]+(before[1]+after[1]-2*point[1])*.5*factor];
      });
    }
    return resamplePath(current);
  }
  function validSurfaceStroke(stroke){
    return !!stroke&&Array.isArray(stroke.points)&&stroke.points.length>0&&stroke.points.every(point=>Array.isArray(point)&&point.length===2&&point.every(Number.isFinite)&&point[0]>=-50&&point[0]<=50&&point[1]>=0&&point[1]<=1)&&
      Array.isArray(stroke.color)&&stroke.color.length===3&&stroke.color.every(value=>Number.isFinite(value)&&value>=0&&value<=1)&&
      Number.isFinite(stroke.width)&&stroke.width>=.003&&stroke.width<=.11&&Number.isFinite(stroke.smoothing)&&stroke.smoothing>=0&&stroke.smoothing<=1;
  }
  function drawSurfaceStrokes(canvas,strokes){
    const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
    for(const stroke of strokes){
      if(!validSurfaceStroke(stroke))continue;
      (window.PotteryEngine.withDecorationClip||((canvas,item,draw)=>draw()))(canvas,stroke,()=>{
      const points=smoothPath(stroke.points,stroke.smoothing);
      ctx.strokeStyle=`rgba(${stroke.color.map(c=>Math.round(c*255)).join(',')},0.95)`;
      ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=Math.max(2,stroke.width*H);ctx.lineCap='round';ctx.lineJoin='round';
      if(points.length===1){for(const shift of [-1,0,1]){ctx.beginPath();ctx.arc(((points[0][0]%1+1)%1+shift)*W,(1-points[0][1])*H,ctx.lineWidth*.5,0,TAU);ctx.fill();}return;}
      for(let i=1;i<points.length;i++){
        const a=points[i-1],b=points[i],u=((a[0]%1)+1)%1,delta=b[0]-a[0];
        if(Math.abs(delta)>.1)continue;
        for(const shift of [-1,0,1]){ctx.beginPath();ctx.moveTo((u+shift)*W,(1-a[1])*H);ctx.lineTo((u+delta+shift)*W,(1-b[1])*H);ctx.stroke();}
      }
      });
    }
  }
  window.PotteryEngine={...(window.PotteryEngine||{}),raycastPot,raycastPotDetail,pickPotSurface,addSurfacePoint,resamplePath,smoothPath,validSurfaceStroke,drawSurfaceStrokes};
}());
