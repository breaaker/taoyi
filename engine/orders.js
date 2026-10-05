(function () {
  'use strict';
  const ORDER_ID='ahan-vase-01',SECOND_ID='tang-soup-bowl-02',VIEW_KEY='clay-and-flame-order-view-v1';
  const content=window.PotteryOrderCatalog?.orders.find(order=>order.id===ORDER_ID);
  if(content&&window.PotteryCapabilities&&!window.PotteryCapabilities.canPlay(content))throw new Error('首封订单内容尚未完成接线');
  const target=content?.legacy?.targetProfile||window.PotteryEngine.ORDER_TARGET_PROFILE||[.28,.54,.62,.49,.30,.32];
  const legacyLetters={
    basic:'收到啦。瓶子比我画的胖些，我娘说这样反而不容易倒。唐叔来买花，问这是谁做的。我说你那间窑房就在拐角，叫他自己去敲门。',
    close:'白菊插进去了，口子正好，早上开窗也没晃。唐叔看见后端起来掂了掂，说他那口汤锅旁边也缺个像样的陶器。你这两天留意一下门。',
    excellent:'我娘今早先拿它当酱油瓶，看到白圈又放回去了。她嘴上说「总算有个有用的」，转头把最好看的花插了进去。唐叔在旁边听笑了，说要找你做碗。你可别告诉他我先说了。'
  };
  const letters=content?.replies||legacyLetters;
  const engine=()=>window.PotteryEngine;
  function unlocked(id,state=engine().loadEconomy()){
    if(id===ORDER_ID)return true;
    const order=window.PotteryOrderRegistry?.get(id);
    return !!order&&state.orders?.[order.unlock.afterOrderId]?.status==='replied';
  }
  function activeOrderId(){
    const state=engine().loadEconomy(),work=window.PotteryWorkflow?.current();
    if(work?.purpose==='order'&&work.orderId&&state.orders?.[work.orderId]?.status==='accepted')return work.orderId;
    const pending=Object.entries(state.orders||{}).find(([,order])=>['accepted','sent'].includes(order?.status));
    if(pending)return pending[0];
    let selected=null;try{selected=localStorage.getItem(VIEW_KEY);}catch(_){}
    return selected&&unlocked(selected,state)?selected:ORDER_ID;
  }
  function orderContent(){return window.PotteryOrderRegistry?.get(activeOrderId())||content;}
  function selectOrder(id){if(!unlocked(id)||!window.PotteryOrderRegistry?.get(id))return false;localStorage.setItem(VIEW_KEY,id);return true;}
  function nextAvailableOrder(){const current=orderContent(),next=current?.unlocksNextOrderId;
    return next&&unlocked(next)&&window.PotteryOrderRegistry?.get(next)?.status==='playable'?window.PotteryOrderRegistry.get(next):null;}
  function paintProfile(paint){return Array.from({length:113},(_,i)=>{
    const row=Math.round(i/112*511);return [0,1,2,3].map(channel=>Number(paint?.[row*4+channel])||0);
  });}
  function radiusAt(knots,t){
    let j=1;while(j<knots.length-1&&t>knots[j][0])j++;
    const [ta,ra]=knots[j-1],[tb,rb]=knots[j],before=knots[Math.max(0,j-2)],after=knots[Math.min(knots.length-1,j+1)];
    const m0=(rb-before[1])/(tb-before[0]),m1=(after[1]-ra)/(after[0]-ta),f=(t-ta)/(tb-ta),f2=f*f,f3=f2*f,span=tb-ta;
    return (2*f3-3*f2+1)*ra+(f3-2*f2+f)*span*m0+(-2*f3+3*f2)*rb+(f3-f2)*span*m1;
  }
  const rgb=hex=>[1,3,5].map(offset=>parseInt(hex.slice(offset,offset+2),16)/255);
  const smooth=t=>{const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x);};
  function sampleShape(shape){
    const h=shape.heights.at(-1);let j=1;
    return Array.from({length:113},(_,i)=>{
      const y=i/112*h;while(j<112&&shape.heights[j]<y)j++;
      const f=(y-shape.heights[j-1])/(shape.heights[j]-shape.heights[j-1]);
      return shape.radii[j-1]+(shape.radii[j]-shape.radii[j-1])*Math.max(0,Math.min(1,f));
    });
  }
  function targetPaint(reference,t){
    let sum=[0,0,0],weight=0;
    for(const zone of reference.paintZones||[]){
      const {from,to,opacity,edge}=zone;
      const a=opacity*smooth((t-from+edge)/(2*edge))*(1-smooth((t-to+edge)/(2*edge)));
      const start=rgb(window.PotteryEconomyCatalog.find('pigment',zone.fromPigment).hex),end=rgb(window.PotteryEconomyCatalog.find('pigment',zone.toPigment).hex),f=smooth((t-from)/(to-from));
      for(let c=0;c<3;c++)sum[c]+=(start[c]+(end[c]-start[c])*f)*a;
      weight+=a;
    }
    return weight>0?[...sum.map(c=>c/weight),Math.min(.98,weight)]:[0,0,0,0];
  }
  function scoreStandard(craft,materialId,reference){
    const samples=craft.profile113?.length===113?craft.profile113:null;
    const ts=samples?Array.from({length:113},(_,i)=>i/112):[0,.25,.45,.7,.87,1];
    const actual=samples||craft.profile;
    const error=ts.reduce((sum,t,i)=>sum+Math.abs(actual[i]-radiusAt(reference.profileDraft.radiusKnots,t)),0)/ts.length+Math.abs(craft.height-reference.profileDraft.estimatedHeight)*.18;
    const shape=error<.07?5:error<.12?4:error<.19?3:error<.27?2:1;
    const bands=craft.bandProfile||[];
    const match=target=>{
      const physical=(target.bandHeight||target.width*reference.profileDraft.estimatedHeight);
      return Math.max(0,...bands.filter(b=>(b.assetId||b.kind)===target.id).map(b=>{
        const position=Math.max(0,1-Math.abs(b.center-target.center)/.065);
        const size=Math.max(0,1-Math.abs(b.width*craft.height-physical)/Math.max(.012,physical*.8));
        return position*size*(window.PotteryEngine.decorationVisibleFraction?.(b)??1);
      }));
    };
    const components=[];
    if(reference.motifs.length)components.push([.35,reference.motifs.reduce((sum,m)=>sum+match(m),0)/reference.motifs.length]);
    const rings=reference.details.filter(d=>d.source.type==='ring'),details=reference.details.filter(d=>d.source.type!=='ring');
    if(rings.length)components.push([.25,rings.reduce((sum,m)=>sum+match(m),0)/rings.length]);
    if(details.length)components.push([.10,details.reduce((sum,m)=>sum+match(m),0)/details.length]);
    if(reference.paintZones.length){
      let matched=0,count=0;
      for(let i=0;i<113;i++){
        const desired=targetPaint(reference,i/112);if(desired[3]<.15)continue;count++;
        const row=craft.paintProfile?.[i];if(!row||row[3]<.08)continue;
        const distance=desired.slice(0,3).reduce((sum,c,j)=>sum+Math.abs(c-row[j]),0)/3+Math.abs(desired[3]-row[3])*.15;
        matched+=Math.max(0,1-distance/.32);
      }
      components.push([.30,matched/Math.max(1,count)]);
    }
    const weight=components.reduce((sum,[w])=>sum+w,0),similarity=components.reduce((sum,[w,v])=>sum+w*v,0)/Math.max(.01,weight);
    const decoration=Math.max(1,Math.min(5,Math.round(1+4*similarity)-(materialId===reference.materialId?0:1)));
    return {shape,decoration,shapeHint:shape>=4?'器型已接近参照。':`对照照片调整轮廓，目标器高约 ${reference.profileDraft.estimatedHeight.toFixed(2)}。`,decorationHint:decoration>=4?'底色与花纹布局已接近参照。':'对照照片的渐变底色、花纹位置和大小；细纹也会提升相似度。'};
  }
  function scoreCraft(craft,materialId,orderId=activeOrderId()){
    if(!craft||!Array.isArray(craft.profile)||craft.profile.length!==6||craft.profile.some(n=>!Number.isFinite(n))||!Number.isFinite(craft.height))return {shape:0,decoration:0,shapeHint:'请用新版取景台拍摄这件陶器。',decorationHint:'还没有可评分的装饰快照。'};
    const selectedReference=window.PotteryOrderRegistry?.get(orderId)?.reference;
    if(selectedReference?.motifs&&orderId!==ORDER_ID&&orderId!==SECOND_ID)return scoreStandard(craft,materialId,selectedReference);
    if(orderId===SECOND_ID){
      const reference=window.PotteryOrderRegistry.get(orderId).reference;
      const targetProfile=[0,.25,.45,.7,.87,1].map(t=>radiusAt(reference.profileDraft.radiusKnots,t));
      const error=craft.profile.reduce((sum,r,i)=>sum+Math.abs(r-targetProfile[i]),0)/6+Math.abs(craft.height-reference.profileDraft.estimatedHeight)*.18;
      const shape=error<.07?5:error<.12?4:error<.19?3:error<.27?2:1;
      const colors=Array.isArray(craft.paintProfile)?craft.paintProfile:[];
      const ring=target=>{
        const wanted=rgb(target.color),rows=colors.filter((_,i)=>Math.abs(i/112-target.center)<Math.max(.018,target.width*.8));
        return rows.reduce((sum,row)=>sum+(row?.[3]>.12&&wanted.reduce((difference,v,c)=>difference+Math.abs(v-row[c]),0)<.42?1:0),0)/Math.max(1,rows.length);
      };
      const rings=reference.rings.map(ring),both=rings.every(value=>value>=.45);
      const zone=reference.paintZones?.[0],pigment=id=>window.PotteryEconomyCatalog?.find('pigment',id)?.hex;
      let wash=false;
      if(zone&&pigment(zone.fromPigment)&&pigment(zone.toPigment)&&colors.length===113){
        const from=rgb(pigment(zone.fromPigment)),to=rgb(pigment(zone.toPigment));
        const samples=[.12,.43,.82].map(f=>{
          const t=zone.from+(zone.to-zone.from)*f,row=colors[Math.round(t*112)],mix=smooth(f);
          const wanted=from.map((channel,c)=>channel+(to[c]-channel)*mix);
          return {row,matched:row?.[3]>.12&&wanted.reduce((difference,v,c)=>difference+Math.abs(v-row[c]),0)<.46};
        });
        wash=samples.filter(sample=>sample.matched).length>=2&&samples[2].row?.[1]>samples[0].row?.[1]+.05;
      }
      const decoration=Math.min(5,rings.filter(value=>value>=.45).length+(both?1:0)+(both&&materialId===reference.materialId?1:0)+(both&&wash?1:0));
      return {shape,decoration,shapeHint:shape>=4?'矮而敞口的碗形很接近参照。':'把器身收矮、碗口放宽，并留稳底。',decorationHint:decoration>=4?'两道棕环的位置已接近参照；红到暖金的底色也会提升相似度。':'对照照片，在碗壁涂出两道棕环，再铺一层由红到暖金的浅色。'};
    }
    const error=craft.profile.reduce((sum,r,i)=>sum+Math.abs(r-target[i]),0)/6+Math.abs(craft.height-1.72)*.12;
    const shape=error<.07?5:error<.12?4:error<.19?3:error<.27?2:1;
    const paint=Math.max(0,Math.min(1,Number(craft.paleTop)||0));
    const decoration=Math.min(5,(materialId==='warm-earth'?2:1)+(paint>.5?3:paint>.18?2:paint>.04?1:0));
    return {shape,decoration,shapeHint:shape>=4?'轮廓与窗台花瓶很接近。':craft.height>1.95?'瓶身偏高；收短一些并留稳底。':'对照参照图，调整腹部、瓶颈和底足。',decorationHint:decoration>=4?'口沿下方的浅色环已看见。':'在口沿下一小圈涂米白色，并保留泥本色。'};
  }
  function grade(score,orderId=activeOrderId()){const minimum=window.PotteryOrderRegistry?.get(orderId)?.scoring;
    return score.shape>=(minimum?.minimumShapeStars||3)&&score.decoration>=(minimum?.minimumDecorationStars||3)&&score.shape+score.decoration>=(minimum?.minimumTotalStars||6);}
  function currentDraftScore(){
    try{
      const active=window.PotteryWorkflow?.current();
      if(!active||active.purpose!=='order')return null;
      const draft=JSON.parse(localStorage.getItem('clay-and-flame-e1-draft-v2')||'null');
      if(draft?.workId!==active.workId||!draft.shape||!Array.isArray(draft.shape.radii)||draft.shape.radii.length!==113)return null;
      const decoration=JSON.parse(localStorage.getItem('clay-and-flame-e3-draft-v2')||'null');
      const paint=decoration?.workId===active.workId&&decoration.sourceShape===JSON.stringify(draft.shape)?decoration.paint:[];
      let pale=0;
      for(let row=415;row<481;row++)if(paint[row*4+3]>.08&&paint[row*4]>.7&&paint[row*4+1]>.65)pale++;
      const sampled=sampleShape(draft.shape);
      return scoreCraft({profile:[0,.25,.45,.7,.87,1].map(t=>sampled[Math.round(t*112)]),profile113:sampled,bandProfile:decoration?.workId===active.workId&&decoration.sourceShape===JSON.stringify(draft.shape)?decoration.bands:[],height:draft.shape.heights[112],paleTop:pale/66,paintProfile:paintProfile(paint)},draft.materialId,active.orderId||activeOrderId());
    }catch(_){return null;}
  }
  function orderState(){return engine().loadEconomy().orders[activeOrderId()]||null;}
  function writeOrder(next,id=activeOrderId()){const state=engine().loadEconomy();const updated={...state,orders:{...state.orders,[id]:next}};localStorage.setItem(engine().ECONOMY_KEY,JSON.stringify(updated));return next;}
  function acceptOrder(){const id=activeOrderId(),current=orderState();if(current)return current;if(!unlocked(id)||!window.PotteryOrderRegistry?.canAccept(orderContent()))throw new Error('这封订单还未开放');return writeOrder({status:'accepted',acceptedAt:Date.now(),orderId:id},id);}
  function sendOrder(photo,album){
    const current=orderState();if(current?.status!=='accepted')throw new Error('请先接下订单');
    if(!engine().validPhoto(photo)||!album.some(item=>item.id===photo.id))throw new Error('作品照不在图册中');
    if(photo.craft?.orderId&&photo.craft.orderId!==activeOrderId())throw new Error('这件作品属于另一封订单');
    if(photo.createdAt<current.acceptedAt)throw new Error('请提交接单后拍摄的新作品');
    if(engine().saleForPhoto(photo))throw new Error('这件作品已经拍卖成交');
    const id=activeOrderId(),work=window.PotteryWorkflow?.current();
    if(work?.purpose==='order'&&work.orderId&&work.orderId!==id)throw new Error('这件作品属于另一封订单');
    const score=scoreCraft(photo.craft,photo.materialId,id);
    if(!grade(score,id))throw new Error('相似度还未达到寄出门槛');
    return writeOrder({...current,status:'sent',sentAt:Date.now(),photoId:photo.id,workId:photo.craft.workId||photo.id,score:{shape:score.shape,decoration:score.decoration}});
  }
  function replyProgress(order,album){
    if(!order||order.status==='accepted')return 0;
    const ids=new Set();
    for(const photo of album){
      if(photo.createdAt<=order.sentAt||photo.id===order.photoId)continue;
      const id=photo.craft?.workId||photo.id;
      if(id!==order.workId)ids.add(id);
    }
    return Math.min(window.PotteryOrderRegistry?.get(order.orderId||ORDER_ID)?.replyDelay.otherWorks||2,ids.size);
  }
  function claimReply(album){
    const state=engine().loadEconomy(),id=activeOrderId(),order=state.orders[id];
    if(order?.status==='replied')return {order,balance:state.balance,alreadyClaimed:true};
    if(order?.status!=='sent'||replyProgress(order,album)<(orderContent()?.replyDelay.otherWorks||2))throw new Error('还需完成其他陶器');
    const sum=order.score.shape+order.score.decoration;
    const tiers=orderContent().scoring.tiers;
    const tier=['excellent','close','basic'].find(key=>tiers[key].includes(sum))||'basic';
    const reward=window.PotteryEconomyCatalog?.orderReward(id,tier);
    if(!Number.isSafeInteger(reward))throw new Error('订单报酬尚未配置');
    if(!Number.isSafeInteger(state.balance+reward))throw new Error('金币余额超出范围');
    const updated={...order,status:'replied',tier,reward,repliedAt:Date.now()};
    const next={...state,balance:state.balance+reward,orders:{...state.orders,[id]:updated}};
    localStorage.setItem(engine().ECONOMY_KEY,JSON.stringify(next));
    return {order:updated,balance:next.balance,alreadyClaimed:false};
  }
  window.PotteryEngine={...window.PotteryEngine,ORDER_ID,ORDER_LETTERS:letters,activeOrderId,orderContent,selectOrder,nextAvailableOrder,paintProfile,sampleShape,targetPaint,scoreCraft,currentDraftScore,grade,orderState,acceptOrder,sendOrder,replyProgress,claimReply};
}());
