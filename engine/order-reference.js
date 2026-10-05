(function () {
  'use strict';
  const KEY='clay-and-flame-ahan-reference-photo-v3';
  const PROFILE=[.28,.54,.62,.49,.30,.32];
  const curve=[[0,.28],[.10,.38],[.25,.54],[.45,.62],[.70,.49],[.87,.30],[.96,.29],[1,.32]];
  function referenceShape(){
    const shape=window.PotteryEngine.createPotShape();
    const radii=shape.radii;
    for(let i=0;i<radii.length;i++){
      const t=i/112;let j=1;while(j<curve.length-1&&t>curve[j][0])j++;
      const [ta,ra]=curve[j-1],[tb,rb]=curve[j],before=curve[Math.max(0,j-2)],after=curve[Math.min(curve.length-1,j+1)];
      const m0=(rb-before[1])/(tb-before[0]),m1=(after[1]-ra)/(after[0]-ta);
      const f=(t-ta)/(tb-ta),f2=f*f,f3=f2*f,span=tb-ta;
      radii[i]=(2*f3-3*f2+1)*ra+(f3-2*f2+f)*span*m0+(-2*f3+3*f2)*rb+(f3-f2)*span*m1;
    }
    return shape;
  }
  function renderReference(){
    const E=window.PotteryEngine,canvas=document.createElement('canvas');
    canvas.style.cssText='position:fixed;left:-10000px;top:0;width:360px;height:450px;pointer-events:none';
    document.body.appendChild(canvas);
    let renderer;
    try{
      renderer=new E.PotteryRenderer(canvas,E.createPotMesh(referenceShape()),{preserveDrawingBuffer:true});
      const paint=E.createPaint();
      for(let i=0;i<24;i++)E.dabPaint(paint,.875,.062,[.96,.91,.80],120);
      const paintCanvas=document.createElement('canvas');paintCanvas.width=1;paintCanvas.height=E.PAINT_ROWS;
      E.paintToCanvas(paintCanvas,paint);renderer.setPaintCanvas(paintCanvas);
      const stripe=document.createElement('canvas');stripe.width=1024;stripe.height=1024;
      const stripeContext=stripe.getContext('2d');
      stripeContext.fillStyle='rgba(251,239,207,.38)';stripeContext.fillRect(0,1024*(1-.888),1024,12);
      stripeContext.fillStyle='rgba(238,221,184,.26)';stripeContext.fillRect(0,1024*(1-.868),1024,4);
      renderer.setPatternCanvas(stripe);
      const recipe=window.PotteryClaySamples.find(item=>item.id==='warm-earth');
      renderer.draw(1,{yaw:.27,pitch:.29,distance:4.75,targetY:.9},.87,recipe,0,0,true,1.08);
      const output=document.createElement('canvas');output.width=720;output.height=900;
      E.composePhoto(output,canvas,'linen');
      return output.toDataURL('image/jpeg',.88);
    }finally{
      renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    }
  }
  function getReferencePhoto(orderId=window.PotteryEngine.orderContent?.()?.id){
    const art=window.PotteryOrderRegistry?.get(orderId)?.reference?.art;
    if(art?.path)return './'+art.path;
    if(orderId==='ahan-vase-01')return './assets/order-references/season1/ahan-vase-01.png';
    if(orderId==='tang-soup-bowl-02')return './assets/order-references/season1/tang-soup-bowl-02.png';
    try{const stored=localStorage.getItem(KEY);if(stored?.startsWith('data:image/jpeg;base64,'))return stored;}catch(_){}
    const photo=renderReference();
    try{localStorage.setItem(KEY,photo);}catch(_){}
    return photo;
  }
  window.PotteryEngine={...(window.PotteryEngine||{}),ORDER_TARGET_PROFILE:PROFILE,ORDER_REFERENCE_KEY:KEY,referenceShape,getReferencePhoto};
}());
