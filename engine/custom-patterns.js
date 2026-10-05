(function () {
  'use strict';
  const STORAGE_KEY='clay-and-flame-custom-patterns-v1';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const tools=new Set(['brush','erase','line','circle','leaf']);
  function validPattern(p){
    return !!p&&typeof p.id==='string'&&/^P[a-z0-9-]{5,32}$/.test(p.id)&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=32&&
      Number.isInteger(p.repeat)&&p.repeat>=1&&p.repeat<=16&&['repeat','mirror'].includes(p.arrangement)&&
      (p.spacing===undefined||Number.isFinite(p.spacing)&&p.spacing>=0&&p.spacing<=.45)&&
      (p.scaleX===undefined||Number.isFinite(p.scaleX)&&p.scaleX>=.5&&p.scaleX<=1.8)&&
      (p.motifWidthU===undefined||Number.isFinite(p.motifWidthU)&&p.motifWidthU>=.02&&p.motifWidthU<=1)&&
      Number.isFinite(p.offset)&&p.offset>=0&&p.offset<=1&&Array.isArray(p.strokes)&&p.strokes.every(s=>
        tools.has(s.tool)&&typeof s.color==='string'&&/^#[0-9a-fA-F]{6}$/.test(s.color)&&
        Number.isFinite(s.size)&&s.size>=.003&&s.size<=.15&&Array.isArray(s.points)&&s.points.length>=1&&
        s.points.every(point=>Array.isArray(point)&&point.length===2&&point.every(v=>Number.isFinite(v)&&v>=0&&v<=1)));
  }
  function loadPatterns(){try{const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(data)?data.filter(validPattern):[];}catch(_){return [];}}
  function savePattern(pattern){
    if(!validPattern(pattern))throw new Error('花纹内容无效');
    const library=loadPatterns(),index=library.findIndex(item=>item.id===pattern.id);
    if(index<0)library.push(pattern);else library[index]=pattern;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(library));
    return library;
  }
  // Keep the shortest crossing over the left/right edge. The same path is
  // rendered at x-1, x and x+1, so a brush touching the seam stays continuous.
  function unwrapPoints(points){
    if(!points.length)return [];
    const unwrapped=[[...points[0]]];
    for(let i=1;i<points.length;i++){
      let x=points[i][0],previous=unwrapped[i-1][0];
      while(x-previous>.5)x-=1;
      while(x-previous<-.5)x+=1;
      unwrapped.push([x,points[i][1]]);
    }
    return unwrapped;
  }
  function pathForStroke(ctx,stroke,W,H){
    const points=stroke.points;if(!points.length)return;
    const p=stroke.tool==='brush'||stroke.tool==='erase'?unwrapPoints(points):points;
    const first=p[0],last=p[p.length-1];
    if(stroke.tool==='circle'){
      const radius=Math.hypot((last[0]-first[0])*W,(last[1]-first[1])*H);
      ctx.arc(first[0]*W,first[1]*H,Math.max(radius,1),0,Math.PI*2);
    }else if(stroke.tool==='leaf'){
      const x1=first[0]*W,y1=first[1]*H,x2=last[0]*W,y2=last[1]*H;
      const dx=x2-x1,dy=y2-y1;
      ctx.moveTo(x1,y1);ctx.quadraticCurveTo((x1+x2)/2-dy*.28,(y1+y2)/2+dx*.28,x2,y2);
      ctx.quadraticCurveTo((x1+x2)/2+dy*.28,(y1+y2)/2-dx*.28,x1,y1);
    }else{
      ctx.moveTo(first[0]*W,first[1]*H);
      if(p.length===1){ctx.lineTo(first[0]*W+.01,first[1]*H+.01);}
      else for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0]*W,p[i][1]*H);
    }
  }
  function drawUnit(ctx,pattern,x,y,W,H,mirror=false){
    ctx.save();ctx.beginPath();ctx.rect(x,y,W,H);ctx.clip();ctx.translate(x,y);
    if(mirror){ctx.translate(W,0);ctx.scale(-1,1);}
    for(const stroke of pattern.strokes){
      ctx.globalCompositeOperation=stroke.tool==='erase'?'destination-out':'source-over';
      ctx.strokeStyle=stroke.color;ctx.fillStyle=stroke.color;
      ctx.lineWidth=stroke.size*H;ctx.lineCap='round';ctx.lineJoin='round';
      for(const shift of [-1,0,1]){
        ctx.save();ctx.translate(shift*W,0);ctx.beginPath();pathForStroke(ctx,stroke,W,H);
        if(stroke.tool==='leaf')ctx.fill();else ctx.stroke();ctx.restore();
      }
    }
    ctx.restore();
  }
  function renderTile(canvas,pattern){
    const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    if(!validPattern(pattern))return;
    const cell=W/pattern.repeat,spacing=pattern.spacing||0;
    const motif=document.createElement('canvas');motif.width=512;motif.height=H;
    const motifContext=motif.getContext('2d');
    drawUnit(motifContext,pattern,0,0,motif.width,H);
    let sourceLeft=0,sourceWidth=motif.width;
    if(motifContext.getImageData){
      const pixels=motifContext.getImageData(0,0,motif.width,H).data;
      let first=motif.width,last=-1;
      for(let y=0;y<H;y++)for(let x=0;x<motif.width;x++)if(pixels[(y*motif.width+x)*4+3]>8){first=Math.min(first,x);last=Math.max(last,x);}
      if(last>=0){sourceLeft=Math.max(0,first-2);sourceWidth=Math.min(motif.width,last+3)-sourceLeft;}
    }
    const source=document.createElement('canvas');source.width=W;source.height=H;
    const sc=source.getContext('2d');
    for(let index=0;index<pattern.repeat;index++){
      sc.save();
      if(pattern.arrangement==='mirror'&&index%2===1){sc.translate((index+1)*cell,0);sc.scale(-1,1);}
      else sc.translate(index*cell,0);
      const drawn=pattern.motifWidthU?W*pattern.motifWidthU:cell*(1-spacing)*(pattern.scaleX||1),left=(cell-drawn)/2;
      if(pattern.motifWidthU){
        sc.drawImage(motif,sourceLeft,0,sourceWidth,H,left,0,drawn,H);
        if(drawn>cell){sc.drawImage(motif,sourceLeft,0,sourceWidth,H,left-W,0,drawn,H);sc.drawImage(motif,sourceLeft,0,sourceWidth,H,left+W,0,drawn,H);}
      }else{
        sc.drawImage(motif,left,0,drawn,H);
        if(drawn>cell){sc.drawImage(motif,left-W,0,drawn,H);sc.drawImage(motif,left+W,0,drawn,H);}
      }
      sc.restore();
    }
    const shift=Math.round(pattern.offset*W)%W;
    ctx.drawImage(source,shift-W,0);ctx.drawImage(source,shift,0);
  }
  function createPattern(name='我的花纹'){
    return {id:`P${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,name,repeat:4,arrangement:'repeat',spacing:0,scaleX:1,offset:0,strokes:[]};
  }
  window.PotteryEngine={...(window.PotteryEngine||{}),CUSTOM_PATTERN_KEY:STORAGE_KEY,validPattern,loadPatterns,savePattern,unwrapPoints,drawUnit,renderTile,createPattern};
}());
