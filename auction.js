(function(){
  'use strict';
  const engine=window.PotteryEngine,flow=window.PotteryWorkflow;
  const $=id=>document.getElementById(id),scene=document.querySelector('.auction-scene');
  const work=flow.current(),requested=new URLSearchParams(location.search).get('photo');
  const album=engine.loadAlbum(),photo=album.find(item=>item.id===requested);
  if(!work||work.stage!=='finish'||work.purpose!=='free'||!photo||work.photoId!==photo.id||photo.craft?.workId!==work.workId){location.replace('./index.html');return;}
  const plan=engine.buildAuction(photo),state=engine.loadEconomy();
  $('lotNumber').textContent=String(album.indexOf(photo)+1).padStart(2,'0');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let displayedPrice=0,priceFrame=0,finished=false,impactTimer=0;
  function error(message){const panel=$('auctionError');panel.querySelector('p').textContent=message;panel.hidden=false;}
  function price(amount){
    cancelAnimationFrame(priceFrame);const from=displayedPrice,start=performance.now(),duration=reduced?0:630;
    $('priceDisplay').classList.remove('pulse');void $('priceDisplay').offsetWidth;$('priceDisplay').classList.add('pulse');
    function tick(now){const t=duration?Math.min(1,(now-start)/duration):1;displayedPrice=Math.round(from+(amount-from)*(1-Math.pow(1-t,3)));
      $('currentPrice').textContent=displayedPrice.toLocaleString('zh-CN');if(t<1)priceFrame=requestAnimationFrame(tick);
    }priceFrame=requestAnimationFrame(tick);
  }
  function tap(final=false){const stage=$('gavelStage');stage.classList.remove('tap','final');void stage.offsetWidth;stage.classList.add(final?'final':'tap');
    clearTimeout(impactTimer);impactTimer=setTimeout(()=>window.PotteryAudio.play('gavel'),reduced?0:Math.round((final?860:780)*.35));}
  function call(text){const label=$('stageStatus');label.classList.remove('is-count');void label.offsetWidth;label.textContent=text;label.classList.add('is-count');tap(text.startsWith('第三'));
  }
  function coinFlight(){
    window.PotteryAudio.play('coin');
    const canvas=$('coinCanvas'),ctx=canvas.getContext('2d'),box=scene.getBoundingClientRect(),bank=$('piggy').getBoundingClientRect();
    const dpr=Math.min(devicePixelRatio||1,2),w=box.width,h=box.height;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.scale(dpr,dpr);
    const targetX=bank.left-box.left+bank.width*.6,targetY=bank.top-box.top+bank.height*.18;
    const coins=Array.from({length:19},(_,i)=>({delay:i*(reduced?40:115),duration:reduced?340:820+Math.random()*280,startX:w*(.24+Math.random()*.27),startY:h*(.69+Math.random()*.09),arc:32+Math.random()*80,r:6+Math.random()*3,spin:Math.random()*6}));
    const start=performance.now();
    function frame(now){const elapsed=now-start;ctx.clearRect(0,0,w,h);
      for(const coin of coins){const t=Math.min(1,Math.max(0,(elapsed-coin.delay)/coin.duration));if(t<=0||t>=1)continue;
        const eased=t*t*(3-2*t),x=coin.startX+(targetX-coin.startX)*eased,y=coin.startY+(targetY-coin.startY)*eased-Math.sin(Math.PI*t)*coin.arc;
        const size=coin.r*(1-.58*t),face=.5+.5*Math.abs(Math.cos(coin.spin+t*11));ctx.save();ctx.translate(x,y);ctx.rotate(t*2.2+coin.spin);ctx.scale(face,1);
        ctx.shadowColor='#ffbd55a8';ctx.shadowBlur=7;const gold=ctx.createRadialGradient(-size*.3,-size*.3,1,0,0,size);
        gold.addColorStop(0,'#fff1b3');gold.addColorStop(.38,'#e5b45f');gold.addColorStop(.8,'#a66a2e');gold.addColorStop(1,'#52331a');
        ctx.fillStyle=gold;ctx.beginPath();ctx.arc(0,0,size,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#fff0b8c9';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,size*.72,0,Math.PI*2);ctx.stroke();ctx.restore();
      }
      if(elapsed<3300)requestAnimationFrame(frame);else ctx.clearRect(0,0,w,h);
    }requestAnimationFrame(frame);
  }
  function settle(){
    if(finished)return;finished=true;
    try{
      const result=engine.settleAuction(photo,plan.valuation.total);
      price(result.sale.amount);$('stageStatus').textContent='落槌成交';scene.classList.add('is-settled');window.PotteryAudio.play('auctionResolve');
      $('saleGain').textContent=`金币 +${result.alreadySold?0:result.sale.amount}`;
      $('newBalance').textContent=`现有 ${result.balance.toLocaleString('zh-CN')} 金币`;
      if(flow.current()?.workId===work.workId)flow.finish(work.workId);
      setTimeout(coinFlight,reduced?0:460);
      setTimeout(()=>$('settlement').hidden=false,reduced?300:1850);
      setTimeout(()=>{if(!window.PotteryNavigate?.('./index.html'))location.replace('./index.html');},reduced?3400:5900);
    }catch(cause){finished=false;error(`结算未完成：${cause.message}`);}
  }
  function play(){
    if(engine.saleForPhoto(photo,state)){settle();return;}
    $('stageStatus').textContent='竞价中';price(plan.opening);window.PotteryAudio.play('bid');
    const bids=plan.bids;
    const beat=reduced?.58:1;
    const at=(ms,action)=>setTimeout(action,Math.round(ms*beat));
    const bid=(index,late=false)=>{if(!bids[index])return;
      price(bids[index].amount);window.PotteryAudio.play('bid');
      const label=$('stageStatus');label.classList.remove('is-count');label.textContent=late?'又有出价':'竞价中';
    };
    // The count is interrupted twice. A sale happens only after three consecutive unanswered calls.
    [650,1190,1730].forEach((ms,index)=>at(ms,()=>bid(index)));
    at(2920,()=>call('第一次'));
    at(3900,()=>call('第二次'));
    at(4640,()=>bid(3,true));
    at(5900,()=>call('第一次'));
    at(6850,()=>bid(4,true));
    at(8150,()=>call('第一次'));
    at(9070,()=>call('第二次'));
    at(9800,()=>bid(5,true));
    at(11200,()=>call('第一次'));
    at(12300,()=>call('第二次'));
    at(13400,()=>call('第三次'));
    at(14400,settle);
  }
  window.PotteryAuctionStage.ready.then(play).catch(cause=>error(cause.message));
}());
