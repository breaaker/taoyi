/* 第一季标准件：前两单已接入订单运行时，其余参数仍待评分标定。 */
(function(root){
  'use strict';
  const specifications=Object.freeze({
    'ahan-vase-01':{
      orderId:'ahan-vase-01',version:1,status:'legacy-compatible-spec',materialId:'warm-earth',
      height:1.72,
      radiusKnots:[[0,.28],[.10,.38],[.25,.54],[.45,.62],[.70,.49],[.87,.30],[.96,.29],[1,.32]],
      base:{kind:'bare-clay',paint:[{kind:'dab-repeat',center:.875,width:.062,color:[.96,.91,.80],durationMs:120,count:24}]},
      upper:[{kind:'solid-ring',center:.882140625,width:.01171875,color:'#fbefcf',alpha:.38}],
      legacyReference:{extraRing:{center:.866046875,width:.00390625,color:'#eeddb8',alpha:.26}},
      photo:{background:'linen',size:[720,900],yaw:.27,pitch:.29,distance:4.75,targetY:.9,lightAngle:.87,lightStrength:1.08},
      scoreSamples:[
        {id:'near',profile:[.28,.54,.62,.49,.30,.32],height:1.72,materialId:'warm-earth',paleTop:.75,expected:{shape:5,decoration:5}},
        {id:'wide-neck',profile:[.28,.54,.62,.49,.52,.53],height:1.72,materialId:'warm-earth',paleTop:.75,expected:{shape:4,decoration:5}},
        {id:'wrong-clay',profile:[.28,.54,.62,.49,.30,.32],height:1.72,materialId:'red-earth',paleTop:.75,expected:{shape:5,decoration:4}}
      ]
    },
    'tang-soup-bowl-02':{
      orderId:'tang-soup-bowl-02',version:1,status:'playable-standard',materialId:'warm-earth',
      height:1.15,
      radiusKnots:[[0,.58],[.07,.61],[.20,.67],[.40,.80],[.62,.92],[.82,.97],[.96,1],[1,1]],
      base:{kind:'bare-clay',paint:[],finish:'fired-matte'},
      upper:[
        {kind:'solid-ring',center:.28,width:.022,color:'#8a604d',alpha:.91},
        {kind:'solid-ring',center:.40,width:.022,color:'#8a604d',alpha:.91}
      ],
      photo:{background:'linen',size:[720,900],yaw:.34,pitch:.30,distance:5.30,targetY:.56,lightAngle:.87,lightStrength:1.05},
      scoreSamples:[
        {id:'near',shapeDelta:0,ringCenterDelta:0,materialId:'warm-earth',expectedTier:'excellent-candidate'},
        {id:'narrow-foot',shapeDelta:{v0:-.12,v25:-.10},ringCenterDelta:0,materialId:'warm-earth',expectedTier:'shape-penalty'},
        {id:'single-ring',shapeDelta:0,missingUpper:[1],materialId:'warm-earth',expectedTier:'decoration-penalty'},
        {id:'deep-bowl',heightDelta:+.28,ringCenterDelta:0,materialId:'warm-earth',expectedTier:'shape-penalty'}
      ]
    },
    'shen-ferry-cup-03':{
      orderId:'shen-ferry-cup-03',version:1,status:'art-spec-only',materialId:'red-earth',
      height:1.22,
      radiusKnots:[[0,.46],[.07,.49],[.20,.51],[.40,.50],[.60,.49],[.78,.48],[.92,.49],[.98,.52],[1,.53]],
      base:{kind:'bare-clay',paint:[],finish:'fired-matte'},
      upper:[
        {kind:'solid-ring',center:.22,width:.022,color:'#555354',alpha:.91},
        {kind:'solid-ring',center:.53,width:.022,color:'#555354',alpha:.91},
        {kind:'solid-ring',center:.80,width:.022,color:'#555354',alpha:.91}
      ],
      photo:{background:'slate',size:[720,900],yaw:.25,pitch:.30,distance:4.55,targetY:.61,lightAngle:.92,lightStrength:1.07},
      scoreSamples:[
        {id:'near',shapeDelta:0,ringCenterDelta:0,materialId:'red-earth',expectedTier:'excellent-candidate'},
        {id:'wrong-clay',shapeDelta:0,ringCenterDelta:0,materialId:'warm-earth',expectedTier:'material-penalty'},
        {id:'equal-spaced',shapeDelta:0,ringCenters:[.25,.50,.75],materialId:'red-earth',expectedTier:'decoration-penalty'},
        {id:'thin-foot',shapeDelta:{v0:-.12,v10:-.10},ringCenterDelta:0,materialId:'red-earth',expectedTier:'shape-penalty'}
      ]
    }
  });

  // Mirrors the current reference's cubic interpolation so order 01 is pixel-stable.
  function radiusAt(knots,t){
    let j=1;while(j<knots.length-1&&t>knots[j][0])j++;
    const [ta,ra]=knots[j-1],[tb,rb]=knots[j];
    const before=knots[Math.max(0,j-2)],after=knots[Math.min(knots.length-1,j+1)];
    const m0=(rb-before[1])/(tb-before[0]),m1=(after[1]-ra)/(after[0]-ta);
    const f=(t-ta)/(tb-ta),f2=f*f,f3=f2*f,span=tb-ta;
    return (2*f3-3*f2+1)*ra+(f3-2*f2+f)*span*m0+(-2*f3+3*f2)*rb+(f3-f2)*span*m1;
  }
  function buildShapeFromKnots(knots,height){
    return {radii:Array.from({length:113},(_,i)=>radiusAt(knots,i/112)),
      heights:Array.from({length:113},(_,i)=>height*i/112)};
  }
  function buildShape(orderId){
    const spec=specifications[orderId];if(!spec)throw new Error('Unknown art standard: '+orderId);
    return buildShapeFromKnots(spec.radiusKnots,spec.height);
  }
  function validateSpec(orderId){
    const spec=specifications[orderId],shape=buildShape(orderId);
    return !!spec&&shape.radii.length===113&&shape.heights.length===113&&
      shape.radii.every(r=>Number.isFinite(r)&&r>=.20&&r<=1)&&
      shape.heights.every((h,i)=>Number.isFinite(h)&&(i===0||h>shape.heights[i-1]))&&
      spec.upper.every(r=>r.center>=.02&&r.center<=.98&&r.width>0&&r.width<=.11);
  }
  function buildReferenceLayers(orderId,E){
    const spec=specifications[orderId];if(!spec)throw new Error('Unknown art standard: '+orderId);
    const paint=E.createPaint();
    for(const dab of spec.base.paint)for(let i=0;i<dab.count;i++)E.dabPaint(paint,dab.center,dab.width,dab.color,dab.durationMs);
    const paintCanvas=document.createElement('canvas');paintCanvas.width=1;paintCanvas.height=E.PAINT_ROWS;
    E.paintToCanvas(paintCanvas,paint);
    const patternCanvas=document.createElement('canvas');patternCanvas.width=1024;patternCanvas.height=1024;
    const ctx=patternCanvas.getContext('2d');
    function stripe(ring){
      const width=ring.width*1024,y=(1-ring.center)*1024-width/2;
      ctx.fillStyle=ring.color;ctx.globalAlpha=ring.alpha;ctx.fillRect(0,y,1024,width);
    }
    spec.upper.forEach(stripe);
    if(spec.legacyReference?.extraRing)stripe(spec.legacyReference.extraRing);
    ctx.globalAlpha=1;
    return {paintCanvas,patternCanvas};
  }
  function renderReferencePhoto(orderId,E,recipe){
    const spec=specifications[orderId];if(!spec)throw new Error('Unknown art standard: '+orderId);
    const source=document.createElement('canvas');source.style.cssText='position:fixed;left:-10000px;top:0;width:360px;height:450px;pointer-events:none';
    document.body.appendChild(source);
    const legacy=orderId==='ahan-vase-01';
    const renderer=new E.PotteryRenderer(source,E.createPotMesh(buildShape(orderId),{photoStand:!legacy}),{preserveDrawingBuffer:true,standStyle:'limestone'});
    try{
      const layers=buildReferenceLayers(orderId,E);
      renderer.setPaintCanvas(layers.paintCanvas);renderer.setPatternCanvas(layers.patternCanvas);
      const p=spec.photo;
      renderer.draw(1,{yaw:p.yaw,pitch:p.pitch,distance:p.distance,targetY:p.targetY},p.lightAngle,recipe,0,0,legacy,p.lightStrength);
      const output=document.createElement('canvas');output.width=p.size[0];output.height=p.size[1];
      return E.composePhoto(output,source,p.background);
    }finally{renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();source.remove();}
  }
  const api={specifications,buildShapeFromKnots,buildShape,buildReferenceLayers,renderReferencePhoto,validateSpec};
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PotteryArtStandards=api;
})(typeof window!=='undefined'?window:null);
