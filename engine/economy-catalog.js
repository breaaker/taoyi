(function () {
  'use strict';
  const materials=[
    {id:'warm-earth',name:'暖陶土',price:0,value:45,gate:0},
    {id:'red-earth',name:'红陶土',price:180,value:110,gate:2},
    {id:'coarse-earthenware',name:'夹砂粗陶',price:460,value:255,gate:5},
    {id:'stoneware',name:'砂泥',price:1250,value:650,gate:10},
    {id:'porcelain',name:'白瓷',price:3600,value:1900,gate:20}
  ];
  const pigmentValues={0:8,90:25,180:65,360:145,750:350,1500:750,2600:1400,4200:2300};
  const pigments=(window.PotteryPigments||[]).map(item=>({...item,value:pigmentValues[item.price],gate:item.price>=4200?24:item.price>=2600?18:item.price>=1500?12:item.price>=750?7:item.price>=360?4:item.price>=180?2:0}));
  const patternRows=[
    ['wave','连波',0,0],['petal','花瓣',0,0],
    ['W04','缆绳影',0,0],['W06','回潮',0,0],
    ['W10','鱼尾水纹',230,1],['W11','晚归鸟',280,2],['W12','檐雨',330,2],
    ['W05','雾点',380,3],['W02','船板刻',520,4],['W01','三潮线',720,6],
    ['W19','曲岸',850,7],['W20','石阶',950,8],['W21','窑星',1100,9],
    ['W09','盐草芽',1300,10],['W23','旧砖缝',1500,12],['W24','白线回环',1800,14],
    ['W22','昼夜交错',2200,16],['W03','盐格',2600,18],['W07','芦叶',3200,20],['W08','窗台菊影',3700,22],
    ['R04','梳划泥浆',4200,24],['R01','粉青印菊',4800,26],['R03','代尔夫特蓝绘',5400,28],
    ['R02','伊兹尼克花叶',6100,30],['R05','景德镇莲池',7200,34]
  ];
  const expandedPatterns=[
    {"id":"P-EG-01","name":"蓝莲密瓣","price":1250,"gate":10,"value":675,"cultureLabel":"埃及莲纹","bandHeight":0.22},
    {"id":"P-EG-02","name":"彩带垂瓣","price":1250,"gate":10,"value":675,"cultureLabel":"埃及莲纹","bandHeight":0.26},
    {"id":"P-EG-03","name":"疏瓣水点","price":750,"gate":6,"value":405,"cultureLabel":"埃及莲纹","bandHeight":0.21},
    {"id":"P-CN-01","name":"马家窑大涡","price":2100,"gate":16,"value":1134,"cultureLabel":"中国史前彩陶","bandHeight":0.4},
    {"id":"P-CN-02","name":"旋纹网格","price":1250,"gate":10,"value":675,"cultureLabel":"中国史前彩陶","bandHeight":0.22},
    {"id":"P-CN-03","name":"错列菱格","price":750,"gate":6,"value":405,"cultureLabel":"中国史前彩陶","bandHeight":0.21},
    {"id":"P-CZ-01","name":"磁州牡丹","price":2100,"gate":16,"value":1134,"cultureLabel":"中国磁州窑","bandHeight":0.4},
    {"id":"P-CZ-02","name":"磁州剔叶","price":1250,"gate":10,"value":675,"cultureLabel":"中国磁州窑","bandHeight":0.33},
    {"id":"P-JD-01","name":"康熙缠枝莲","price":4600,"gate":26,"value":2484,"cultureLabel":"中国景德镇","bandHeight":0.37},
    {"id":"P-JD-02","name":"蓝地白莲","price":3200,"gate":21,"value":1728,"cultureLabel":"中国景德镇","bandHeight":0.38},
    {"id":"P-JD-03","name":"蓝黄缠枝","price":4600,"gate":26,"value":2484,"cultureLabel":"中国景德镇","bandHeight":0.35},
    {"id":"P-CX-01","name":"青白刻涡","price":2100,"gate":16,"value":1134,"cultureLabel":"中国青白瓷","bandHeight":0.35},
    {"id":"P-CX-02","name":"青花釉里红莲瓣","price":3200,"gate":21,"value":1728,"cultureLabel":"中国青花釉里红","bandHeight":0.26},
    {"id":"P-CG-01","name":"永乐缠枝莲","price":6400,"gate":32,"value":3456,"cultureLabel":"中国宫廷瓷","bandHeight":0.35},
    {"id":"P-CG-02","name":"赏瓶分带","price":4600,"gate":26,"value":2484,"cultureLabel":"中国宫廷瓷","bandHeight":0.4},
    {"id":"P-CG-03","name":"夔龙衔花","price":8800,"gate":40,"value":4752,"cultureLabel":"中国宫廷瓷","bandHeight":0.4},
    {"id":"P-CG-04","name":"斗彩折枝花","price":6400,"gate":32,"value":3456,"cultureLabel":"中国宫廷瓷","bandHeight":0.34},
    {"id":"P-CG-05","name":"粉彩团蝶","price":6400,"gate":32,"value":3456,"cultureLabel":"中国宫廷瓷","bandHeight":0.16},
    {"id":"P-CG-06","name":"五彩蝶群","price":6400,"gate":32,"value":3456,"cultureLabel":"中国宫廷瓷","bandHeight":0.26},
    {"id":"P-CG-07","name":"胭脂红团花","price":4600,"gate":26,"value":2484,"cultureLabel":"中国宫廷瓷","bandHeight":0.33},
    {"id":"P-CG-08","name":"粉彩双枝","price":4600,"gate":26,"value":2484,"cultureLabel":"中国宫廷瓷","bandHeight":0.3},
    {"id":"P-KR-01","name":"粉青剔花卷叶","price":3200,"gate":21,"value":1728,"cultureLabel":"朝鲜粉青陶","bandHeight":0.32},
    {"id":"P-KR-02","name":"粉青浸白","price":2100,"gate":16,"value":1134,"cultureLabel":"朝鲜粉青陶","bandHeight":0.16},
    {"id":"P-IZ-01","name":"伊兹尼克浪泡","price":2100,"gate":16,"value":1134,"cultureLabel":"土耳其伊兹尼克","bandHeight":0.28},
    {"id":"P-IZ-02","name":"伊兹尼克花枝","price":3200,"gate":21,"value":1728,"cultureLabel":"土耳其伊兹尼克","bandHeight":0.32},
    {"id":"P-DF-01","name":"代尔夫特垂花","price":3200,"gate":21,"value":1728,"cultureLabel":"荷兰代尔夫特","bandHeight":0.29},
    {"id":"P-DF-02","name":"代尔夫特散枝","price":2100,"gate":16,"value":1134,"cultureLabel":"荷兰代尔夫特","bandHeight":0.2},
    {"id":"P-SL-01","name":"梳划泥浆竖纹","price":1250,"gate":10,"value":675,"cultureLabel":"英国泥浆彩陶","bandHeight":0.28},
    {"id":"P-SL-02","name":"泥浆流线","price":1250,"gate":10,"value":675,"cultureLabel":"英国泥浆彩陶","bandHeight":0.27},
    {"id":"P-MO-01","name":"短刷墨痕","price":750,"gate":6,"value":405,"cultureLabel":"汐湾工艺原创","bandHeight":0.19},
    {"id":"P-MO-02","name":"釉落散点","price":450,"gate":4,"value":243,"cultureLabel":"汐湾工艺原创","bandHeight":0.22},
    {"id":"P-WY-01","name":"旧渡绳扣","price":750,"gate":6,"value":405,"cultureLabel":"汐湾生活纹样","bandHeight":0.22},
    {"id":"P-WY-02","name":"食摊汤汽","price":450,"gate":4,"value":243,"cultureLabel":"汐湾生活纹样","bandHeight":0.19},
    {"id":"W25","name":"渡绳结","price":750,"gate":6,"value":405,"cultureLabel":"汐湾原创","bandHeight":0.12},
    {"id":"W26","name":"花摊小枝","price":450,"gate":4,"value":243,"cultureLabel":"汐湾原创","bandHeight":0.16},
    {"id":"W27","name":"热汤白汽","price":450,"gate":4,"value":243,"cultureLabel":"汐湾原创","bandHeight":0.17},
    {"id":"W28","name":"水位短记","price":750,"gate":6,"value":405,"cultureLabel":"汐湾原创","bandHeight":0.4},
    {"id":"W29","name":"窑灰散点","price":450,"gate":4,"value":243,"cultureLabel":"汐湾原创","bandHeight":0.17},
    {"id":"W30","name":"回岸双波","price":750,"gate":6,"value":405,"cultureLabel":"汐湾原创","bandHeight":0.17},
    {"id":"CN-DRAGON-01","name":"青花龙纹章","price":8800,"gate":40,"value":4752,"cultureLabel":"中国青花瓷","bandHeight":0.4},
    {"id":"CN-LOTUS-01","name":"青花仰莲瓣","price":6400,"gate":32,"value":3456,"cultureLabel":"中国青花瓷","bandHeight":0.26},
    {"id":"CN-CLOUD-01","name":"青花卷云","price":6400,"gate":32,"value":3456,"cultureLabel":"中国青花瓷","bandHeight":0.31}
  ];
  const patterns=[...patternRows.map(([id,name,price,gate])=>({id,name,price,gate,value:price?Math.round(price*.54):8})),...expandedPatterns,...(window.PotteryOrderPatterns||[]).map(p=>({...p,value:2,bundledDetail:true,hideFromShop:true}))];
  const features=[
    {id:'handle',name:'把手工具',price:2400,gate:16,available:false},
    {id:'lid',name:'盖子工具',price:4400,gate:24,available:false},
    {id:'piercing',name:'镂空工具',price:7200,gate:34,available:false}
  ];
  // One-time story commissions. Keep the first order's saved reward amounts unchanged.
  const orderRewards=Object.freeze({
    'ahan-vase-01':{basic:50,close:60,excellent:70},
    'tang-soup-bowl-02':{basic:180,close:210,excellent:235},
    'shen-ferry-cup-03':{basic:300,close:345,excellent:390},
    'wen-ledger-jar-04':{basic:220,close:255,excellent:285},
    'xu-seed-bowl-05':{basic:380,close:435,excellent:495},
    'lin-recording-cup-06':{basic:450,close:520,excellent:585},
    'gu-comparison-bowl-07':{basic:1150,close:1320,excellent:1500},
    'he-welcome-bowl-08':{basic:550,close:635,excellent:715},
    'yan-exhibition-vase-09':{basic:1050,close:1210,excellent:1365},
    'ye-kiln-water-jar-10':{basic:1130,close:1300,excellent:1470},
    'mei-rice-bowl-11':{basic:1150,close:1325,excellent:1495},
    'cen-tide-bowl-12':{basic:850,close:980,excellent:1105},
    'shen-trial-cup-13':{basic:2200,close:2530,excellent:2860},
    'lin-shared-plate-14':{basic:4300,close:4945,excellent:5590},
    'neighbors-feast-bowl-15':{basic:1450,close:1670,excellent:1885}
  });
  for(const rewards of Object.values(orderRewards))Object.freeze(rewards);
  function orderReward(orderId,tier){
    const rewards=orderRewards[orderId];
    return rewards&&Object.hasOwn(rewards,tier)?rewards[tier]:null;
  }
  const tools=[{id:'ring-eraser',name:'橡皮擦',price:120,gate:0,value:0,description:'擦掉固定高度一圈的底色和花纹，恢复泥料本色。永久使用。'}];
  const all={material:materials,pigment:pigments,pattern:patterns,feature:features,tool:tools};
  const find=(type,id)=>(all[type]||[]).find(item=>item.id===id);
  const salesCount=state=>{
    const album=new Map((window.PotteryEngine.loadAlbum?.()||[]).map(photo=>[photo.id,photo.craft?.workId]));
    return new Set(Object.entries(state.sales||{}).map(([id,sale])=>sale.workId||album.get(id)||id)).size;
  };
  function isOwned(type,id,state=window.PotteryEngine.loadEconomy()){
    const item=find(type,id);
    return !!item&&(item.price===0||!!state.owned?.[`${type}:${id}`]||(type==='pattern'&&id==='W05'&&state.orders?.['ahan-vase-01']?.status==='replied'));
  }
  function canBuy(type,id,state=window.PotteryEngine.loadEconomy()){
    const item=find(type,id);
    return !!item&&item.available!==false&&!isOwned(type,id,state)&&salesCount(state)>=item.gate&&state.balance>=item.price;
  }
  function purchase(type,id){
    const item=find(type,id),engine=window.PotteryEngine,state=engine.loadEconomy();
    if(!item||item.available===false)throw new Error('该物品尚未开放');
    if(isOwned(type,id,state))return {alreadyOwned:true,balance:state.balance,item};
    if(salesCount(state)<item.gate)throw new Error(`还需完成 ${item.gate} 件拍卖作品`);
    if(state.balance<item.price)throw new Error(`还差 ${item.price-state.balance} 金币`);
    const key=`${type}:${id}`;
    const next={...state,balance:state.balance-item.price,owned:{...state.owned,[key]:true},purchases:{...state.purchases,[key]:{price:item.price,at:Date.now()}}};
    localStorage.setItem(engine.ECONOMY_KEY,JSON.stringify(next));
    return {alreadyOwned:false,balance:next.balance,item};
  }
  window.PotteryEconomyCatalog={materials,pigments,patterns,features,tools,orderRewards,orderReward,all,find,salesCount,isOwned,canBuy,purchase};
}());
