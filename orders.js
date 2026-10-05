(function () {
  'use strict';
  const E=window.PotteryEngine,$=id=>document.getElementById(id);
  const flow=window.PotteryWorkflow;
  const make=document.createElement('a');make.className='order-create';make.href='./shaping-preview.html?purpose=order';make.textContent='选泥制作这件订单 →';$('primary').after(make);
  const nextLetter=document.createElement('button');nextLetter.type='button';nextLetter.className='primary';nextLetter.hidden=true;$('replyPanel').append(nextLetter);
  const letter=document.querySelector('.letter');
  letter.addEventListener('toggle',()=>{letter.querySelector('summary span').textContent=letter.open?'点击收起':'点击展开';if(letter.open)window.PotteryAudio.play('paper');});
  window.PotteryReferenceViewer.mountOrderReference($('referencePhoto'),{floating:$('referencePhoto').parentElement});
  let selected=null;
  function syncContent(){
    const order=E.orderContent();if(!order)return;
    document.title=`${order.customer.name}的来信 · 泥与火`;
    document.querySelector('.top strong small').textContent=`潮线 · 来信 ${String(order.sequence).padStart(2,'0')}`;
    document.querySelector('.intro span').textContent=`THE LETTER / ${String(order.sequence).padStart(2,'0')}`;
    document.querySelector('.intro h1').textContent=order.title;
    document.querySelector('.intro p').textContent=order.techniqueBrief;
    const summary=letter.querySelector('summary');summary.firstChild.textContent=`✉ ${order.customer.name}的来信 `;
    letter.querySelector('.card-top span:first-child').textContent=`寄件人 · ${order.customer.name}`;
    const paragraphs=letter.querySelectorAll('p');paragraphs[0].textContent=order.letter;paragraphs[1].hidden=true;
    letter.querySelector('.signature').textContent=order.customer.name;
    $('referencePhoto').src=E.getReferencePhoto(order.id);
    $('referencePhoto').alt=`${order.customer.name}订单陶器的参照照片。单指移动，双指缩放`;
    const requirements=document.querySelectorAll('.requirements span');
    requirements[0].textContent=window.PotteryEconomyCatalog.find('material',order.reference.materialId)?.name||order.reference.materialId;
    requirements[1].textContent=({vase:'花瓶','shallow-bowl':'浅碗','straight-cup':'直身杯','short-neck-jar':'短颈罐','small-shallow-bowl':'小浅碗','small-cup':'小杯','thick-bowl':'厚壁碗','wide-shallow-bowl':'宽浅碗','tall-neck-vase':'长颈瓶','water-jar':'水罐','rice-bowl':'饭碗','straight-bowl':'直壁碗','low-cup':'矮杯','wide-plate':'宽盘','large-rice-bowl':'开席碗'})[order.reference.shapeFamily]||order.reference.shapeFamily;
    requirements[2].textContent=order.techniqueBrief;
    document.querySelector('.ref-note').textContent=order.reference.description;
    document.querySelector('.threshold').textContent=`寄出门槛：器型和装饰各至少 ${order.scoring.minimumShapeStars} 星，合计至少 ${order.scoring.minimumTotalStars} 星。未达标的作品会进入拍卖，再取新泥胚重做。`;
    $('shapeScore').textContent='— / 5';$('decorationScore').textContent='— / 5';
    $('shapeHint').textContent='接单后可查看当前器型。';
    $('decorationHint').textContent=order.techniqueBrief;
    document.querySelector('#replyPanel .card-top span:first-child').textContent=`${order.customer.name}的回信`;
  }
  function showScore(score){$('shapeScore').textContent=`${score.shape} / 5`;$('decorationScore').textContent=`${score.decoration} / 5`;$('shapeHint').textContent=score.shapeHint;$('decorationHint').textContent=score.decorationHint;}
  function render(){
    syncContent();
    const album=E.loadAlbum(),economy=E.loadEconomy();let order=E.orderState();
    $('balance').textContent=economy.balance;
    document.querySelector('.threshold').hidden=!!order&&order.status!=='accepted';
    if(order?.status==='sent'&&E.replyProgress(order,album)>=E.orderContent().replyDelay.otherWorks){try{E.claimReply(album);order=E.orderState();}catch(error){$('message').textContent=error.message;}}
    const choices=$('photoChoices');choices.replaceChildren();
    make.hidden=true;$('primary').hidden=false;$('replyPanel').hidden=true;nextLetter.hidden=true;
    if(!order){
      $('phase').textContent='尚未接单';$('primary').textContent='接下这封信 →';
      const missing=window.PotteryOrderRegistry.missingSupplies(E.orderContent(),economy);
      $('primary').disabled=missing.length>0;
      if(missing.length){$('message').textContent='请先在商店获得：'+missing.map(item=>`${item.name}（${item.price} 金币，成交 ${item.gate} 件解锁）`).join('、');make.hidden=false;make.href='./shop.html';make.textContent='前往商店准备材料 →';}
      return;
    }
    const draft=E.currentDraftScore();if(draft)showScore(draft);
    if(order.status==='accepted'){
      $('phase').textContent='制作中';
      const active=flow.current();
      if(!active){make.hidden=false;make.href='./shaping-preview.html?purpose=order';make.textContent='选泥制作这件订单 →';}
      else if(active.purpose==='order'&&active.stage!=='finish'){make.hidden=false;make.href='./index.html';make.textContent='继续这件订单作品 →';}
      const photos=album.filter(photo=>photo.createdAt>=order.acceptedAt&&!economy.sales[photo.id]&&active?.purpose==='order'&&active.workId===photo.craft?.workId&&active.photoId===photo.id);
      for(const photo of photos.slice().reverse()){
        const score=E.scoreCraft(photo.craft,photo.materialId),button=document.createElement('button');button.type='button';button.className='photo-choice';button.setAttribute('aria-pressed',String(selected===photo.id));
        button.dataset.photoId=photo.id;const image=document.createElement('img');image.src=photo.dataUrl;image.alt='';
        const label=document.createElement('span');const title=document.createElement('b');title.setAttribute('data-i18n','off');title.textContent=photo.title;label.append(title,`器型 ${score.shape} 星 · 装饰 ${score.decoration} 星`);button.append(image,label);
        button.addEventListener('click',()=>{selected=photo.id;showScore(score);renderChoices();window.PotteryAudio.play('select');});choices.appendChild(button);
      }
      function renderChoices(){for(const button of choices.children)button.setAttribute('aria-pressed',String(button.dataset.photoId===selected));}
      $('primary').textContent='寄出选中的作品 →';$('primary').disabled=!selected;
      if(!photos.length)$('message').textContent='接单后制作并拍一张新作品照，就能在这里选择寄出。';
      return;
    }
    const score=order.score;showScore({...score,shapeHint:'寄出时的器型分',decorationHint:'寄出时的装饰分'});
    if(order.status==='sent'){
      const count=E.replyProgress(order,album),needed=E.orderContent().replyDelay.otherWorks;$('phase').textContent='已寄出 · 等待回信';$('primary').hidden=true;
      $('message').textContent=`已完成 ${count} / ${needed} 件其他陶器。每件新作品都从选泥开始，拍照保存后记一次。`;
      return;
    }
    $('phase').textContent='已收到回信';$('primary').hidden=true;$('message').textContent='这封信与报酬已经收入档案。';
    $('replyPanel').hidden=false;$('replyText').textContent=E.orderContent().replies[order.tier];$('reward').textContent=`报酬 ${order.reward} 金币 · 已入账`;
    const upcoming=E.nextAvailableOrder();if(upcoming){nextLetter.hidden=false;nextLetter.textContent=`阅读下一封来信：${upcoming.customer.name} →`;}
  }
  nextLetter.addEventListener('click',()=>{const upcoming=E.nextAvailableOrder();if(!upcoming||!E.selectOrder(upcoming.id))return;selected=null;$('message').textContent='';render();window.PotteryAudio.play('paper');});
  $('primary').addEventListener('click',()=>{
    try{
      const order=E.orderState();
      if(!order){E.acceptOrder();window.PotteryAudio.play('paper');window.PotteryAudio.play('save');}
      else if(order.status==='accepted'){
        const photo=E.loadAlbum().find(item=>item.id===selected);
        E.sendOrder(photo,E.loadAlbum());flow.finish(photo.craft.workId);window.PotteryAudio.play('envelope');window.PotteryAudio.play('complete');
      }
      $('message').textContent='';render();
    }catch(error){$('message').textContent=error.message;}
  });
  render();
  const requested=new URLSearchParams(location.search).get('photo'),active=flow.current();
  if(requested&&active?.purpose==='order'&&active.stage==='finish'&&active.photoId===requested){
    const photo=E.loadAlbum().find(item=>item.id===requested&&item.craft?.workId===active.workId);
    if(photo){selected=photo.id;const score=E.scoreCraft(photo.craft,photo.materialId);showScore(score);render();
      if(E.grade(score)){$('primary').click();}
      else {flow.patch(active.workId,{purpose:'free',failedOrder:true});location.replace(`./auction.html?photo=${encodeURIComponent(photo.id)}`);}
    }
  }
}());
