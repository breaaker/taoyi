(function(){
  'use strict';
  const KEY='clay-and-flame-language-v1';
  const english={
    '泥与火':'Clay & Flame','从一块泥，做到一件作品。':'From a lump of clay to a finished piece.',
    '开始制作':'Start creating','继续制作':'Continue creating','寄出这件作品':'Send this piece','进入拍卖':'Go to auction',
    '商店':'Shop','来信':'Letters','返回工坊':'Back to workshop','← 返回工坊':'← Back to workshop','回到工坊':'Back to workshop',
    '设置':'Settings','关闭设置':'Close settings','声音':'Sound','音乐':'Music','环境音':'Ambience','音效':'Effects','语言':'Language','简体中文':'简体中文',
    '塑形':'Shaping','窑火':'Firing','曲面装饰':'Decoration','自动保存':'Saved automatically','装饰草稿':'Decoration draft',
    '选择自由创作或订单':'Choose free work or an order','选择泥料':'Choose clay','撤销':'Undo','复原':'Redo','完成塑形':'Finish shaping',
    '涂底色':'Paint base','贴花纹':'Add pattern','手绘':'Freehand','清空装饰':'Clear decoration','完成装饰':'Finish decoration',
    '自由创作':'Free creation','阿蘅订单':'A-Heng’s order','烧制完成，进入装饰':'Continue to decoration','收起选择栏':'Close palette',
    '泥料':'Clay','色料':'Pigments','条纹与纹样':'Bands & patterns','工坊商店':'Workshop shop','金币':'Coins',
    '01 / 塑形':'01 / Shape','03 / 装饰':'03 / Decorate','湿泥 · 转盘旋转中':'Wet clay · wheel turning',
    '空白处拖动可转动视角':'Drag empty space to rotate the view','手中的泥':'Clay in your hands',
    '每次拖动只会小幅改变触点附近；重复手势可以继续塑形。':'Each drag gently changes the nearby clay. Repeat to keep shaping.',
    '创作方式':'Creation mode','转台速度':'Wheel speed','手势':'Gesture','查看':'View','重置器型':'Reset shape',
    '把这件陶坯送入窑炉 →':'Send this piece to the kiln →','01 / 光与角度':'01 / Light & angle',
    '预热':'Preheat','升温':'Heating','烧成':'Firing','冷却':'Cooling','完成':'Complete',
    '烧制进度':'Firing progress','湿泥':'Wet clay','火旺':'Full fire','陶坯泥料':'Clay body',
    '点火烧制':'Fire the kiln','重新烧制':'Fire again','烧制中':'Firing','烧制完成':'Firing complete','继续烧制':'Continue firing',
    '继续装饰这件陶器 →':'Continue decorating →','窑温缓缓升起':'The kiln warms up','窑火退去 · 陶坯已成':'The fire recedes · the piece is fired',
    '底色 · 雾蓝':'Base color · mist blue','给陶器添一笔':'Decorate your piece','类型':'Type','花纹':'Patterns',
    '手绘线':'Freehand line','我的花纹':'My patterns','绘制新花纹 ↗':'Create a pattern ↗',
    '汐湾原创':'Tide Bay originals','首批馆藏改绘':'Museum inspired','各地新纹样':'New motifs from afar',
    '点开查看':'Tap to view','连波':'Rolling waves','花瓣':'Petals','曲面手绘':'Surface drawing',
    '最近一笔修顺':'Smooth last stroke','笔触 / 环带宽度':'Stroke / band width','放置':'Place','清空装饰':'Clear decoration',
    '完成装饰 · 去取景拍照 →':'Finish decoration · take a photo →','尚未上色':'Unpainted','载入纹样中…':'Loading patterns…',
    '成品取景台 / E4':'Photo studio / E4','准备取景':'Ready to shoot','灯光方向':'Light direction',
    '灯光强度':'Light strength','取景远近':'Camera distance','作品名称':'Title','作品照':'Portrait',
    '拍照':'Take photo','拍摄当前陶器':'Photograph this piece','轻触照片，继续':'Tap the photo to continue',
    '继续送往下一步':'Continue to the next step','我的作品照':'My photos','下载照片 ↓':'Download photo ↓','关闭':'Close',
    '当前出价':'Current bid','汐湾拍卖场':'Tide Bay Auction','现有 0 金币':'Balance: 0 coins',
    '工坊入口':'Workshop entrance','当前步骤操作':'Current actions','订单参照图':'Order reference',
    '商品分类':'Shop categories','订单进度':'Order progress','器型相似度':'Shape match','装饰相似度':'Decoration match',
    '去拉坯':'Shape clay','去装饰':'Decorate','去拍照':'Take photo','接下这封信 →':'Accept this letter →',
    '点击展开':'Tap to open','随信的参照图':'Reference photo','制作记录':'Work record','尚未接单':'Not accepted yet'
  };
  const originals=new WeakMap(),attributeOriginals=new WeakMap();
  let current='zh-CN';try{current=localStorage.getItem(KEY)==='en'?'en':'zh-CN';}catch(_){}
  Object.assign(english,window.PotteryEnglishUI||{});
  const story=window.PotteryEnglishStories||{};
  for(const order of window.PotteryOrderCatalog?.orders||[]){
    const en=story.orders?.[order.id];if(!en)continue;
    for(const key of ['title','letter','techniqueBrief'])if(order[key]&&en[key])english[order[key]]=en[key];
    if(order.customer?.name)english[order.customer.name]=en.name;
    if(order.reference?.description)english[order.reference.description]=en.description;
    for(const tier of ['basic','close','excellent'])if(order.replies?.[tier])english[order.replies[tier]]=en.replies[tier];
  }
  for(const [i,letter] of (window.PotteryOrderCatalog?.dailyLetters||[]).entries())if(story.daily?.[i])english[letter.text]=story.daily[i];
  const templates=[
    [/^现有 ([\d,]+) 金币$/,(_,n)=>`Balance: ${n} coins`],
    [/^金币 \+([\d,]+)$/,(_,n)=>`Coins +${n}`],
    [/^器高 (.+)% · 器宽 (.+)%$/,(_,h,w)=>`Height ${h}% · Width ${w}%`],
    [/^(.+?)的来信(.*)$/,(_,name,tail)=>`${translate(name)}’s letter${translate(tail)}`],
    [/^✉ (.+?)的来信$/,(_,name)=>`✉ ${translate(name)}’s letter`],
    [/^(.+?)的回信$/,(_,name)=>`${translate(name)}’s reply`],
    [/^(.+?)的?订单$/,(_,name)=>`${translate(name)}’s order`],
    [/^寄件人\s*·\s*(.+)$/,(_,name)=>`From · ${translate(name)}`],
    [/^底色 (.+?) · 花纹 (\d+) 圈 · 手绘 (\d+) 笔$/,(_,color,bands,strokes)=>`Base: ${translate(color)} · ${bands} bands · ${strokes} strokes`],
    [/^已成交 · (.+) 金币 →$/,(_,n)=>`Sold · ${n} coins →`],
    [/^(\d+) 张$/,(_,n)=>`${n} photos`],
    [/^(.+?)订单陶器的参照照片。单指移动，双指缩放$/,(_,name)=>`${translate(name)}’s reference photo. Drag to move; pinch to zoom.`],
    [/^寄出门槛：器型和装饰各至少 (\d+) 星，合计至少 (\d+) 星。未达标的作品会进入拍卖，再取新泥胚重做。$/,(_,each,total)=>`To send: at least ${each} stars each for shape and decoration, ${total} stars combined. Pieces below this score go to auction. Start again with fresh clay.`],
    [/^器型 (.+) 星 · 装饰 (.+) 星$/,(_,shape,decor)=>`Shape ${shape} stars · Decoration ${decor} stars`],
    [/^已完成 (\d+) \/ (\d+) 件其他陶器。每件新作品都从选泥开始，拍照保存后记一次。$/,(_,n,total)=>`Finished ${n} / ${total} other pieces. Each new piece starts with clay selection and counts once after its photo is saved.`],
    [/^报酬 (.+) 金币 · 已入账$/,(_,n)=>`Payment: ${n} coins · added to your balance`],
    [/^阅读下一封来信：(.+) →$/,(_,name)=>`Read the next letter: ${translate(name)} →`],
    [/^对照照片调整轮廓，目标器高约 (.+)。$/,(_,h)=>`Match the silhouette in the photo. Target height: about ${h}.`],
    [/^已成交 (\d+) 件不同作品 · 当前余额 (.+) 金币$/,(_,n,b)=>`${n} pieces sold · Balance: ${b} coins`],
    [/^成交 (\d+) 件作品后开放$/,(_,n)=>`Available after selling ${n} pieces`],
    [/^作品使用后可提升拍卖估价 · 参考贡献 (.+) 金币$/,(_,n)=>`Raises a piece’s auction value · estimated contribution: ${n} coins`],
    [/^已获得(.+)，剩余 (.+) 金币$/,(_,name,n)=>`Purchased ${translate(name)} · ${n} coins remaining`],
    [/^还需完成 (\d+) 件拍卖作品$/,(_,n)=>`Sell ${n} more pieces at auction`],
    [/^还差 (.+) 金币$/,(_,n)=>`You need ${n} more coins`],
    [/^正在载入(.+)…$/,(_,name)=>`Loading ${translate(name)}…`],
    [/^(.+)载入失败$/,(_,name)=>`Could not load ${translate(name)}`],
    [/^(.+)·(素环|细线|珠点|短刻|弧纹|菱格|叶链|绳波)(\d+)$/,(_,name,type,n)=>`${translate(name)} · ${translate(type)} ${n}`],
    [/^请先在商店获得：(.+)$/,(_,list)=>`First buy in the shop: ${translate(list)}`],
    [/^(.+)（(.+) 金币，成交 (\d+) 件解锁）$/,(_,name,price,n)=>`${translate(name)} (${price} coins, unlocks after ${n} sales)`]
  ];
  // A single pass over longest keys translates composite labels without touching IDs or saves.
  const keys=Object.keys(english).sort((a,b)=>b.length-a.length);
  const escaped=keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  const tokenPattern=new RegExp(escaped.join('|'),'g');
  function translate(value){
    if(typeof value!=='string')return value;
    const trimmed=value.trim();if(!trimmed)return value;
    let result=english[trimmed];
    if(!result)for(const [pattern,render] of templates){if(pattern.test(trimmed)){result=trimmed.replace(pattern,render);break;}}
    if(!result)result=trimmed.replace(tokenPattern,key=>english[key]);
    return value.replace(trimmed,result);
  }
  function translated(value){const result=translate(value);return result!==value?result:null;}
  function excluded(node){return node.parentElement?.closest('script,style,noscript,textarea,[contenteditable],[data-i18n="off"]');}
  function textNode(node){
    if(excluded(node))return;
    const value=node.nodeValue,original=originals.get(node);
    if(current==='en'){
      if(original&&value===translated(original))return;
      const next=translated(value);if(next&&next!==value){originals.set(node,value);node.nodeValue=next;}
    }else if(original&&value===translated(original)){node.nodeValue=original;}
  }
  function attribute(element,name){
    const value=element.getAttribute(name);if(!value)return;
    let saved=attributeOriginals.get(element);if(!saved){saved={};attributeOriginals.set(element,saved);}
    if(current==='en'){
      if(saved[name]&&value===translated(saved[name]))return;
      const next=translated(value);if(next&&next!==value){saved[name]=value;element.setAttribute(name,next);}
    }else if(saved[name]&&value===translated(saved[name]))element.setAttribute(name,saved[name]);
  }
  function applyNode(root){
    if(root.nodeType===3){textNode(root);return;}
    if(root.nodeType!==1||['SCRIPT','STYLE','NOSCRIPT'].includes(root.tagName))return;
    for(const name of ['aria-label','title','alt','placeholder','data-error'])attribute(root,name);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
    while(walker.nextNode()){
      const node=walker.currentNode;
      if(node.nodeType===3&&!['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement?.tagName))textNode(node);
      else if(node.nodeType===1)for(const name of ['aria-label','title','alt','placeholder','data-error'])attribute(node,name);
    }
  }
  function apply(){document.documentElement.lang=current;if(document.body)applyNode(document.body);if(document.head)applyNode(document.head);}
  function setLocale(value){current=value==='en'?'en':'zh-CN';try{localStorage.setItem(KEY,current);}catch(_){}apply();}
  window.PotteryI18n={locale:()=>current,setLocale,apply,t:value=>current==='en'?translate(value):value,translateEnglish:translate};
  window.addEventListener('storage',event=>{if(event.key===KEY){current=event.newValue==='en'?'en':'zh-CN';apply();}});
  if(document.body)apply();else document.addEventListener('DOMContentLoaded',apply,{once:true});
  const observer=new MutationObserver(records=>{
    for(const record of records){
      if(record.type==='characterData')textNode(record.target);
      else if(record.type==='attributes')attribute(record.target,record.attributeName);
      else for(const node of record.addedNodes)applyNode(node);
    }
  });
  const observe=()=>{if(document.documentElement instanceof Node)observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt','placeholder','data-error']});};
  if(document.body)observe();else document.addEventListener('DOMContentLoaded',observe,{once:true});
})();
