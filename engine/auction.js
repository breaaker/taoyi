(function () {
  'use strict';
  const ECONOMY_KEY='clay-and-flame-economy-v1';
  const materialPrices={'warm-earth':24,stoneware:34,porcelain:42,'red-earth':28,'coarse-earthenware':30};
  const buyers=['桥南茶馆','灯塔藏家','渡船客','旧街窑主','游商阿禾','山居旅人'];
  const clamp=(value,lo,hi)=>Math.max(lo,Math.min(hi,Number.isFinite(value)?value:lo));
  function hash(value){let n=2166136261;for(const char of value){n=Math.imul(n^char.charCodeAt(0),16777619);}return n>>>0;}
  function premiumValues(craft,catalog){
    const pigmentById=new Map();
    for(const use of Array.isArray(craft.pigments)?craft.pigments:[]){
      if(!use||typeof use.id!=='string'||!Number.isFinite(use.coverage))continue;
      const amount=Math.round((catalog.find('pigment',use.id)?.value||0)*clamp(use.coverage/.18,0,1));
      pigmentById.set(use.id,Math.max(pigmentById.get(use.id)||0,amount));
    }
    const valuedPigments=[...pigmentById.values()].sort((a,b)=>b-a);
    const patternById=new Map();
    for(const use of Array.isArray(craft.patterns)?craft.patterns:[]){
      if(!use||typeof use.id!=='string'||!Number.isFinite(use.width))continue;
      const item=catalog.find('pattern',use.id);
      const expanded=Number.isFinite(item?.bandHeight);
      // Old photos were made while expanded motifs were free placeholders.
      const value=expanded&&(craft.economyVersion<4||use.legacy)?8:(item?.value||0);
      const fullWidth=expanded&&craft.economyVersion>=4?
        Math.max(.05,.7*item.bandHeight/Math.max(.5,craft.height||1.9)):.05;
      const amount=Math.round(value*clamp(use.width/fullWidth,0,1));
      patternById.set(use.id,Math.max(patternById.get(use.id)||0,amount));
    }
    const valuedPatterns=[...patternById.values()].sort((a,b)=>b-a);
    return {pigment:(valuedPigments[0]||0)+Math.round((valuedPigments[1]||0)*.55),pattern:(valuedPatterns[0]||0)+Math.round((valuedPatterns[1]||0)*.5)};
  }
  function valuePhoto(photo){
    const craft=photo.craft||{};
    if([2,3,4].includes(craft.economyVersion)&&window.PotteryEconomyCatalog){
      const catalog=window.PotteryEconomyCatalog;
      const base=craft.materialOwned?(catalog.find('material',photo.materialId)?.value||45):45;
      const {pigment,pattern}=premiumValues(craft,catalog);
      if(craft.economyVersion>=3){
        const formScore=clamp(craft.form,.35,1);
        const coverage=clamp(craft.coverage,0,1);
        const bands=clamp(craft.bands,0,100),strokes=clamp(craft.strokes,0,100);
        const decorationScore=clamp(.55*Math.min(1,coverage/.35)+.25*Math.min(1,bands/3)+.20*Math.min(1,strokes/4),0,1);
        const colorCount=(Array.isArray(craft.pigments)?craft.pigments:[]).filter(use=>Number.isFinite(use?.coverage)&&use.coverage>.02).length;
        const coverageBalance=.16*(1-clamp(Math.abs(coverage-.38)/.38,0,1));
        const bandBalance=bands>=1&&bands<=3 ? .12 : bands<=5&&bands>=4 ? .06 : 0;
        const paletteBalance=colorCount===0 ? .05 : colorCount===1 ? .12 : colorCount<=3 ? .16 : .06;
        const harmonyScore=clamp(.45+coverageBalance+bandBalance+paletteBalance-Math.max(0,bands-5)*.025-Math.max(0,colorCount-4)*.04,.25,.98);
        const form=Math.round(12+28*formScore);
        const decoration=Math.round(26*decorationScore);
        const formFactor=.34*formScore,decorationFactor=.23*decorationScore,harmonyFactor=.20*harmonyScore;
        const qualityMultiplier=.68+formFactor+decorationFactor+harmonyFactor;
        const interestPercent=hash(craft.workId||photo.id)%17-8;
        const interestMultiplier=1+interestPercent/100;
        const subtotal=base+pigment+pattern+form+decoration;
        const total=Math.max(40,Math.round(subtotal*qualityMultiplier*interestMultiplier));
        return {version:craft.economyVersion,base,form,decoration,pigment,pattern,harmonyScore:Math.round(harmonyScore*100),formFactor,decorationFactor,harmonyFactor,qualityMultiplier,interestPercent,interestMultiplier,subtotal,total};
      }
      const form=Math.round(14+clamp(craft.form,.35,1)*30);
      const decoration=Math.round(Math.min(12,clamp(craft.coverage,0,1)*30)+Math.min(6,clamp(craft.bands,0,100)*2)+Math.min(6,clamp(craft.strokes,0,100)*2));
      const harmony=6;
      const interest=hash(craft.workId||photo.id)%11-5;
      const total=base+form+decoration+pigment+pattern+harmony+interest;
      return {base,form,decoration,pigment,pattern,harmony,interest,total};
    }
    const base=materialPrices[photo.materialId]||24;
    const form=Math.round(10+clamp(craft.form,.35,1)*18);
    const decoration=Math.round(Math.min(12,clamp(craft.bands,0,100)*2)+Math.min(9,clamp(craft.strokes,0,100)*2)+clamp(craft.coverage,0,1)*12);
    const harmony=6;
    const interest=hash(photo.id)%9-4;
    const total=base+form+decoration+harmony+interest;
    return {base,form,decoration,harmony,interest,total};
  }
  function buildAuction(photo){
    const valuation=valuePhoto(photo),target=valuation.total;
    const opening=Math.max(10,Math.floor(target*.44));
    const fractions=[.55,.66,.75,.84,.92,1];
    let previous=opening;
    const bids=fractions.map((part,index)=>{
      const amount=index===fractions.length-1?target:Math.max(previous+1,Math.floor(target*part));
      previous=amount;
      return {amount,buyer:buyers[(hash(photo.id)+index*3+index%2)%buyers.length]};
    });
    return {opening,bids,valuation};
  }
  function loadEconomy(){
    try{
      const state=JSON.parse(localStorage.getItem(ECONOMY_KEY)||'null');
      if(state?.version===1&&Number.isSafeInteger(state.balance)&&state.balance>=0&&state.sales&&typeof state.sales==='object'&&!Array.isArray(state.sales))
        return {version:1,balance:state.balance,sales:state.sales,orders:state.orders&&typeof state.orders==='object'?state.orders:{},owned:state.owned&&typeof state.owned==='object'?state.owned:{},purchases:state.purchases&&typeof state.purchases==='object'?state.purchases:{},seen:!!state.seen};
    }catch(_){}
    return {version:1,balance:0,sales:{},orders:{},owned:{},purchases:{},seen:false};
  }
  function saleForPhoto(photo,state=loadEconomy()){
    if(state.sales[photo.id])return state.sales[photo.id];
    const workId=photo.craft?.workId;if(!workId)return null;
    const album=new Map((window.PotteryEngine.loadAlbum?.()||[]).map(item=>[item.id,item.craft?.workId]));
    return Object.values(state.sales).find(sale=>sale.workId===workId||album.get(sale.photoId)===workId)||null;
  }
  function settleAuction(photo,amount){
    if(!window.PotteryEngine.validPhoto(photo))throw new Error('作品照片无效');
    const expected=buildAuction(photo).valuation.total;
    if(amount!==expected)throw new Error('成交金额与估价不一致');
    const state=loadEconomy();
    if(state.sales[photo.id])return {sale:state.sales[photo.id],balance:state.balance,alreadySold:true};
    const workId=photo.craft?.workId;
    if(workId&&saleForPhoto(photo,state))throw new Error('这件陶器已通过另一张照片成交');
    if(workId&&Object.values(state.orders).some(order=>order.workId===workId&&['sent','replied'].includes(order.status)))throw new Error('寄出的订单作品不能拍卖');
    if(!Number.isSafeInteger(state.balance+amount))throw new Error('金币余额超出范围');
    const sale={photoId:photo.id,workId:workId||null,title:photo.title,amount,at:Date.now()};
    const next={...state,balance:state.balance+amount,sales:{...state.sales,[photo.id]:sale},seen:true};
    localStorage.setItem(ECONOMY_KEY,JSON.stringify(next));
    return {sale,balance:next.balance,alreadySold:false};
  }
  window.PotteryEngine={...(window.PotteryEngine||{}),ECONOMY_KEY,valuePhoto,buildAuction,loadEconomy,saleForPhoto,settleAuction};
}());
