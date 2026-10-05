(function(){
  'use strict';
  const engine=window.PotteryEngine,flow=window.PotteryWorkflow;
  const canvas=document.getElementById('auctionPot');
  function validShape(shape){return shape&&Array.isArray(shape.radii)&&Array.isArray(shape.heights)&&shape.radii.length===113&&shape.heights.length===113&&shape.radii.every(r=>Number.isFinite(r)&&r>=.13&&r<=1)&&shape.heights.every((h,i)=>Number.isFinite(h)&&(i===0?Math.abs(h)<1e-6:h>shape.heights[i-1]));}
  async function loadImage(id,fit){return new Promise((resolve,reject)=>{const path=engine.patternAssetPath(id);if(!path){reject(new Error('作品花纹不在工坊目录'));return;}const image=new Image();image.onload=()=>resolve(engine.fittedPatternAsset(image,fit));image.onerror=()=>reject(new Error('作品花纹尚未载入'));image.src=path;});}
  async function prepare(){
    const work=flow.current();if(!work||work.stage!=='finish')throw new Error('没有正在拍卖的作品');
    let shapeDraft,decoration;
    try{shapeDraft=JSON.parse(localStorage.getItem(flow.SHAPE_KEY)||'null');decoration=JSON.parse(localStorage.getItem(flow.DECOR_KEY)||'null');}catch(_){throw new Error('作品数据无法读取');}
    if(shapeDraft?.workId!==work.workId||!validShape(shapeDraft.shape)||decoration?.workId!==work.workId||decoration.sourceShape!==JSON.stringify(shapeDraft.shape)||!Array.isArray(decoration.bands)||!decoration.bands.every(engine.validBand)||!engine.validPaint(decoration.paint))throw new Error('这件作品的器型或装饰数据已中断');
    const recipe=window.PotteryClaySamples.find(item=>item.id===shapeDraft.materialId);if(!recipe)throw new Error('泥料已不在工坊');
    const renderer=new engine.PotteryRenderer(canvas,engine.createPotMesh(shapeDraft.shape));
    const paint=document.createElement('canvas');paint.width=1;paint.height=engine.PAINT_ROWS;engine.paintToCanvas(paint,Float32Array.from(decoration.paint));renderer.setPaintCanvas(paint);
    const pattern=document.createElement('canvas');pattern.width=1024;pattern.height=1024;
    const assets={},custom=new Map(engine.loadPatterns().map(item=>[item.id,item]));
    for(const id of new Set(decoration.bands.map(item=>item.assetId).filter(Boolean))){
      if(custom.has(id)){const item=custom.get(id);const tile=document.createElement('canvas');tile.width=1024;tile.height=512;engine.renderTile(tile,item);assets[id]=tile;}
      else assets[id]=await loadImage(id,decoration.bands.find(b=>b.assetId===id)?.assetFit);
    }
    engine.paintBands(pattern,decoration.bands,assets);
    const strokes=Array.isArray(decoration.strokes)&&decoration.strokes.every(engine.validSurfaceStroke)?decoration.strokes:[];
    engine.drawSurfaceStrokes(pattern,strokes);renderer.setPatternCanvas(pattern);
    const platform=window.PotteryPlatformPose;
    const camera={yaw:0,pitch:.26,distance:6,targetY:1.02,spin:0};window.PotterySceneCamera=camera;let last=0;
    function fitToStage(){
      const frame=document.getElementById('gameFrame');if(!frame)return;
      const w=frame.clientWidth,h=frame.clientHeight;
      const ellipse=platform.ellipse('auction-wide.png');
      camera.pitch=platform.pitch(ellipse);
      camera.yaw=0;
      const platformWidth=ellipse.rx*2*Math.max(w/1672,h/941);
      const targetWidth=platformWidth*.70,targetHeight=h*.37;
      const {radii,heights}=shapeDraft.shape;
      function sizeAt(distance){
        camera.distance=distance;
        let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
        for(let i=0;i<radii.length;i+=7)for(let a=0;a<8;a++){
          const angle=a*Math.PI/4,p=renderer.projectPoint([radii[i]*Math.cos(angle),heights[i],radii[i]*Math.sin(angle)],camera);
          minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
        }
        return {width:maxX-minX,height:maxY-minY};
      }
      let low=5.8,high=18;
      for(let i=0;i<16;i++){const middle=(low+high)/2,size=sizeAt(middle);if(size.width>targetWidth||size.height>targetHeight)low=middle;else high=middle;}
      camera.distance=high;
    }
    function alignPot(){
      const frame=document.getElementById('gameFrame');if(!frame)return;
      fitToStage();
      const point=platform.map(platform.ellipse('auction-wide.png'),frame.clientWidth,frame.clientHeight);
      const foot=renderer.projectPoint([0,0,0],camera);
      canvas.style.left=`${point.x-foot.x}px`;canvas.style.top=`${point.y-foot.y}px`;canvas.style.transform='none';
    }
    window.PotteryAuctionStage.alignPot=alignPot;
    alignPot();window.addEventListener('pottery:frame-ready',alignPot);window.addEventListener('resize',()=>requestAnimationFrame(alignPot),{passive:true});
    function frame(now){requestAnimationFrame(frame);if(document.hidden||now-last<30)return;const dt=last?Math.min(50,now-last):30;last=now;camera.spin+=dt*.00027;renderer.draw(1,camera,.88,recipe,camera.spin,0,true,1.12);}
    requestAnimationFrame(frame);
    return {work,recipe};
  }
  window.PotteryAuctionStage={};
  window.PotteryAuctionStage.ready=prepare();
  window.PotterySceneReady=window.PotteryAuctionStage.ready;
}());
