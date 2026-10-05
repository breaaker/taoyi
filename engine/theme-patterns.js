(function () {
  'use strict';
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const point=(x,y)=>[clamp(x,0,1),clamp(y,0,1)];
  function makeStroke(tool,color,size,points){return {tool,color,size,points:points.map(([x,y])=>point(x,y))};}
  function generateThemeCandidates({theme='tide',density=3,color='#315987',repeat=6,arrangement='repeat',spacing=0,offset=0,id='Ptheme1',name='主题花纹'}){
    const count=clamp(Math.round(Number(density)||3),1,5);
    const themes=new Set(['tide','reed','stars','brick']);
    if(!themes.has(theme)||!/^#[0-9a-fA-F]{6}$/.test(color))throw new Error('主题或颜色无效');
    const ideas=[];
    for(let variant=0;variant<3;variant++){
      const strokes=[];
      if(theme==='tide'){
        const rows=variant===0?1:variant===1?2:3;
        for(let row=0;row<rows;row++){
          const center=.5+(row-(rows-1)/2)*.16;
          const points=[];
          for(let i=0;i<=80;i++){
            const x=i/80;
            points.push([x,center+Math.sin(x*Math.PI*2*(count+variant)+row*.8)*(.045+.008*variant)]);
          }
          strokes.push(makeStroke('brush',color,.017-row*.002,points));
        }
      }else if(theme==='reed'){
        const leaves=count+variant+1;
        for(let i=0;i<leaves;i++){
          const x=(i+.5)/leaves,lean=(i%2?1:-1)*(.045+.012*variant);
          strokes.push(makeStroke('line',color,.008,[[x,.78],[x+lean,.3]]));
          strokes.push(makeStroke('leaf',color,.015,[[x+lean*.35,.6],[x+lean*1.8,.43]]));
          if(variant>0)strokes.push(makeStroke('leaf',color,.013,[[x+lean*.6,.52],[x-lean*.9,.38]]));
        }
      }else if(theme==='stars'){
        const stars=count+variant+1;
        for(let i=0;i<stars;i++){
          const x=(i+.5)/stars,y=.36+.23*(i%2);
          strokes.push(makeStroke('circle',color,.013,[[x,y],[x+.018+.004*variant,y]]));
          strokes.push(makeStroke('line',color,.009,[[x-.04,y],[x+.04,y]]));
          strokes.push(makeStroke('line',color,.009,[[x,y-.075],[x,y+.075]]));
        }
        if(variant===2)strokes.push(makeStroke('brush',color,.005,Array.from({length:41},(_,i)=>[i/40,.82-.06*Math.cos(i/40*Math.PI*2)])));
      }else{
        const columns=count+variant+2;
        for(const y of variant===0?[.34,.66]:[.25,.5,.75]){
          strokes.push(makeStroke('line',color,.014,[[0,y],[1,y]]));
          for(let i=0;i<columns;i++){
            const x=(i+(y>.5?.5:0))/columns;
            strokes.push(makeStroke('line',color,.011,[[x,y-.11],[x,y+.11]]));
          }
        }
      }
      ideas.push({id,name,repeat,arrangement,spacing,offset,strokes,label:['疏朗','交错','层叠'][variant]});
    }
    return ideas;
  }
  window.PotteryEngine={...(window.PotteryEngine||{}),generateThemeCandidates};
}());
