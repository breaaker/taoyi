(function () {
  'use strict';
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const PAINT_ROWS=512;
  const kinds=new Set(['wave','petal']);
  const assetIdPattern=/^(?:[WR]\d{2}|P-[A-Z]{2}-\d{2}|CN-[A-Z]+-\d{2}|P[a-z0-9-]{5,32}|O\d{2}-D\d{2})$/;
  const imageBounds=new WeakMap();
  const motifColumns=new WeakMap();

  function alphaRowBounds(data,width,height){
    let first=height,last=-1;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      if(data[(y*width+x)*4+3]>8){first=Math.min(first,y);last=Math.max(last,y);}
    }
    return last<0?null:{top:first,height:last-first+1};
  }
  function visibleRows(image){
    const mutable=typeof image.getContext==='function';
    if(!mutable&&imageBounds.has(image))return imageBounds.get(image);
    const width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
    const probe=document.createElement('canvas');probe.width=width;probe.height=height;
    const context=probe.getContext('2d');context.drawImage(image,0,0);
    const bounds=alphaRowBounds(context.getImageData(0,0,width,height).data,width,height);
    const top=bounds?Math.max(0,bounds.top-2):0;
    const bottom=bounds?Math.min(height,bounds.top+bounds.height+2):0;
    const padded=bounds?{top,height:bottom-top}:null;
    if(!mutable)imageBounds.set(image,padded);
    return padded;
  }

  // A source tile can already contain several motifs. Take one native period,
  // then place its centre at equal angular intervals without changing its width.
  function layoutPatternTile(canvas,image,nativeRepeat,repeat,motifWidthU){
    const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
    const sourceW=image.naturalWidth||image.width,sourceH=image.naturalHeight||image.height;
    const periods=Math.max(1,Math.round(nativeRepeat));
    const count=Math.max(1,Math.min(16,Math.round(repeat)));
    const width=W*clamp(motifWidthU,.02,1),cell=W/count;
    let columns=motifColumns.get(image)?.get(periods);
    if(!columns&&typeof document!=='undefined'){
      const periodW=sourceW/periods,probe=document.createElement('canvas');
      probe.width=Math.ceil(periodW);probe.height=sourceH;
      const scan=probe.getContext('2d');
      if(scan?.getImageData){
        scan.drawImage(image,0,0,periodW,sourceH,0,0,probe.width,sourceH);
        const data=scan.getImageData(0,0,probe.width,sourceH).data;
        let first=probe.width,last=-1;
        for(let y=0;y<sourceH;y++)for(let x=0;x<probe.width;x++)if(data[(y*probe.width+x)*4+3]>8){first=Math.min(first,x);last=Math.max(last,x);}
        const left=last<0?0:Math.max(0,first-2),right=last<0?probe.width:Math.min(probe.width,last+3);
        columns={left:left*periodW/probe.width,width:(right-left)*periodW/probe.width};
        const cache=motifColumns.get(image)||new Map();cache.set(periods,columns);motifColumns.set(image,cache);
      }
    }
    columns||={left:0,width:sourceW/periods};
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<count;i++){
      const left=(i+.5)*cell-width/2;
      for(const wrap of [-W,0,W])ctx.drawImage(image,columns.left,0,columns.width,sourceH,left+wrap,0,width,H);
    }
  }

  function patternAssetPath(id){
    if(/^O\d{2}-D\d{2}$/.test(id))return `./assets/order-patterns/svg/${id}.svg`;
    if(/^W(?:0[1-9]|1\d|2[0-4])$/.test(id))return `./assets/patterns/png/${id}.png`;
    if(/^R0[1-5]$/.test(id))return `./assets/heritage/patterns/png/${id}.png`;
    if(/^(?:W(?:2[5-9]|30)|P-[A-Z]{2}-\d{2}|CN-[A-Z]+-\d{2})$/.test(id))return `./assets/expanded-patterns/png/${id}.png`;
    return null;
  }

  function fittedPatternAsset(image,fit){
    if(!fit)return image;
    const tile=document.createElement('canvas');tile.width=1024;tile.height=512;
    layoutPatternTile(tile,image,fit.nativeRepeat,fit.repeat,fit.motifWidthU);
    return tile;
  }

  function createBand({center,width=.035,kind='wave',color=[.30,.39,.45],assetId=null}) {
    if(!kinds.has(kind)&&!(typeof assetId==='string'&&assetIdPattern.test(assetId)))throw new Error('未知的装饰类型');
    if(!Array.isArray(color)||color.length!==3||color.some(value=>!Number.isFinite(value)))throw new Error('颜色参数无效');
    return {center:clamp(Number(center),.02,.98),width:clamp(Number(width),.005,.8),kind,assetId,
      color:color.map(value=>clamp(value,0,1))};
  }
  function validBand(band) {
    return !!band&&(kinds.has(band.kind)||typeof band.assetId==='string'&&assetIdPattern.test(band.assetId))&&
      Number.isFinite(band.center)&&band.center>=.02&&band.center<=.98&&
      Number.isFinite(band.width)&&band.width>=.005&&band.width<=.8&&
      Array.isArray(band.color)&&band.color.length===3&&band.color.every(v=>Number.isFinite(v)&&v>=0&&v<=1);
  }
  function appendBand(bands,band) {
    if(!validBand(band))throw new Error('装饰参数无效');
    return [...bands,band];
  }
  function createPaint(){return new Float32Array(PAINT_ROWS*4);}
  function validPaint(value){return Array.isArray(value)&&value.length===PAINT_ROWS*4&&value.every(v=>Number.isFinite(v)&&v>=0&&v<=1);}
  // v=0 is the foot and v=1 is the lip. The brush has compact support:
  // distant rows never change, while its falloff has no hard visual edge.
  function dabPaint(paint,center,width,color,dtMs){
    if(!Number.isFinite(center)||!Number.isFinite(width)||!Number.isFinite(dtMs)||!Array.isArray(color)||color.length!==3)return;
    const radius=clamp(width,.012,.11)*.72;
    const first=Math.max(0,Math.floor((center-radius)*PAINT_ROWS));
    const last=Math.min(PAINT_ROWS-1,Math.ceil((center+radius)*PAINT_ROWS));
    const time=clamp(dtMs,0,120);
    for(let row=first;row<=last;row++){
      const distance=Math.abs((row+.5)/PAINT_ROWS-center)/radius;
      const weight=Math.pow(Math.max(0,1-distance*distance),2);
      const deposit=1-Math.exp(-time*weight/780);
      if(deposit<.00001)continue;
      const i=row*4,oldAlpha=paint[i+3];
      const alpha=oldAlpha+(1-oldAlpha)*deposit;
      const mix=oldAlpha<.00001?1:deposit*.8;
      for(let c=0;c<3;c++)paint[i+c]+=((clamp(color[c],0,1))-paint[i+c])*mix;
      paint[i+3]=alpha;
    }
  }
  function strokePaint(paint,from,to,width,color,dtMs){
    const steps=Math.max(1,Math.ceil(Math.abs(to-from)*PAINT_ROWS/3));
    for(let s=0;s<=steps;s++)dabPaint(paint,from+(to-from)*s/steps,width,color,dtMs/(steps+1));
  }
  function paintToCanvas(canvas,paint){
    const context=canvas.getContext('2d');
    const image=context.createImageData(1,PAINT_ROWS);
    for(let row=0;row<PAINT_ROWS;row++)for(let channel=0;channel<4;channel++)
      image.data[(PAINT_ROWS-1-row)*4+channel]=Math.round(clamp(paint[row*4+channel],0,1)*255);
    context.putImageData(image,0,0);
  }
  const cssColor=color=>`rgba(${color.map(value=>Math.round(value*255)).join(',')},0.91)`;
  function mergedErasedRanges(ranges=[]){
    const valid=(Array.isArray(ranges)?ranges:[]).filter(r=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)&&r[1]>r[0]).map(([a,b])=>[clamp(a,0,1),clamp(b,0,1)]).sort((a,b)=>a[0]-b[0]);
    const merged=[];for(const range of valid){const last=merged[merged.length-1];if(last&&range[0]<=last[1])last[1]=Math.max(last[1],range[1]);else merged.push([...range]);}return merged;
  }
  function decorationVisibleFraction(item,low=item.center-item.width*.5,high=item.center+item.width*.5){
    low=clamp(low,0,1);high=clamp(high,0,1);if(high<=low)return 0;
    const erased=mergedErasedRanges(item.erasedRanges).reduce((sum,[a,b])=>sum+Math.max(0,Math.min(high,b)-Math.max(low,a)),0);
    return Math.max(0,1-erased/(high-low));
  }
  function withDecorationClip(canvas,item,draw){
    const ranges=mergedErasedRanges(item.erasedRanges);if(!ranges.length){draw();return;}
    const ctx=canvas.getContext('2d');ctx.save();ctx.beginPath();let low=0;
    for(const [a,b] of [...ranges,[1,1]]){if(a>low)ctx.rect(0,(1-a)*canvas.height,canvas.width,(a-low)*canvas.height);low=b;}
    ctx.clip();draw();ctx.restore();
  }
  function eraseDecorationRing(paint,bands,strokes,center,width){
    if(!Number.isFinite(center)||!Number.isFinite(width)||width<=0)throw new Error('擦除参数无效');
    const range=[clamp(center-width*.5,0,1),clamp(center+width*.5,0,1)];
    for(let row=0;row<PAINT_ROWS;row++){const v=(row+.5)/PAINT_ROWS;if(v>=range[0]&&v<=range[1])paint.fill(0,row*4,row*4+4);}
    const mask=item=>({...item,erasedRanges:mergedErasedRanges([...(item.erasedRanges||[]),range])});
    return {bands:bands.map(mask).filter(b=>decorationVisibleFraction(b)>0),strokes:strokes.map(mask).filter(stroke=>{
      const vs=stroke.points.map(p=>p[1]);return decorationVisibleFraction(stroke,Math.min(...vs)-stroke.width*.5,Math.max(...vs)+stroke.width*.5)>0;
    })};
  }
  function paintBands(canvas,bands,assets={}) {
    const ctx=canvas.getContext('2d');
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    bands.forEach(band=>withDecorationClip(canvas,band,()=>{
      const y=(1-band.center)*H,thick=band.width*H;
      if(band.assetId){
        const image=assets[band.assetId];
        if(image&&(image.complete===undefined||image.complete)&&(image.naturalWidth||image.width)){
          const bounds=visibleRows(image);
          if(bounds)ctx.drawImage(image,0,bounds.top,image.naturalWidth||image.width,bounds.height,0,y-thick*.5,W,thick);
        }
        return;
      }
      ctx.strokeStyle=cssColor(band.color);ctx.fillStyle=cssColor(band.color);
      if(band.kind==='wave'){
        ctx.lineWidth=Math.max(3,thick*.22);ctx.beginPath();
        for(let x=0;x<=W;x+=2){const waveY=y+Math.sin(x/W*Math.PI*24)*thick*.27;if(x===0)ctx.moveTo(x,waveY);else ctx.lineTo(x,waveY);}ctx.stroke();
        ctx.lineWidth=Math.max(1.5,thick*.055);
        for(const edge of [-1,1]){ctx.beginPath();ctx.moveTo(0,y+edge*thick*.48);ctx.lineTo(W,y+edge*thick*.48);ctx.stroke();}
      } else if(band.kind==='petal'){
        const repeats=18,cell=W/repeats;ctx.lineWidth=Math.max(2,thick*.1);
        for(let i=0;i<repeats;i++){const x=(i+.5)*cell;ctx.beginPath();ctx.moveTo(x-cell*.37,y);ctx.quadraticCurveTo(x,y-thick*.48,x+cell*.37,y);ctx.quadraticCurveTo(x,y+thick*.48,x-cell*.37,y);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(x,y,Math.max(1.5,thick*.075),0,Math.PI*2);ctx.fill();}
      }
    }));
  }
  window.PotteryEngine={...(window.PotteryEngine||{}),createBand,validBand,appendBand,createPaint,validPaint,dabPaint,strokePaint,paintToCanvas,paintBands,layoutPatternTile,patternAssetPath,fittedPatternAsset,alphaRowBounds,PAINT_ROWS,eraseDecorationRing,withDecorationClip,decorationVisibleFraction};
}());
