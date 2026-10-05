(function () {
  'use strict';
  const sections=[
    ['绘制',document.querySelector('.editor-section')],
    ['预览',document.querySelector('.preview-section')],
    ['主题',document.querySelector('.assist-section')],
    ['保存',document.querySelector('.save-section')]
  ];
  const nav=document.createElement('nav');nav.className='pattern-mobile-nav';nav.setAttribute('aria-label','花纹工作步骤');
  let active=0;
  function update(){sections.forEach(([,section],index)=>{section.classList.toggle('mobile-active',index===active);section.inert=index!==active;});[...nav.children].forEach((button,index)=>button.setAttribute('aria-current',index===active?'step':'false'));}
  sections.forEach(([name],index)=>{const button=document.createElement('button');button.type='button';button.textContent=name;button.addEventListener('click',()=>{active=index;update();});nav.append(button);});
  document.body.append(nav);update();
}());
