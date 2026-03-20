/* ════════════════════════════════════════
   SABER BARBER — utils.js
════════════════════════════════════════ */
'use strict';

const Bookings = {
  get:  id  => JSON.parse(localStorage.getItem('bk_'+id)||'{}'),
  save: (id,d) => localStorage.setItem('bk_'+id,JSON.stringify(d)),
  key:  (date,time) => date.toISOString().split('T')[0]+'|'+time,
};

const Schedule = {
  defaults:{ activeDays:[0,1,2,3,4,5,6], startTime:'09:00', endTime:'00:00', offDays:[], available:true },
  get:  id  => JSON.parse(localStorage.getItem('sc_'+id)||'null') || {...Schedule.defaults},
  save: (id,d) => localStorage.setItem('sc_'+id,JSON.stringify(d)),
};

const DateHelper = {
  today(){ const d=new Date(); d.setHours(0,0,0,0); return d; },
  isoDate: d => d.toISOString().split('T')[0],
  formatShort: d => d.toLocaleDateString('fr-CA',{weekday:'short',month:'short',day:'numeric'}).toUpperCase(),
  formatLong:  d => d.toLocaleDateString('fr-CA',{weekday:'long',month:'long',day:'numeric'}),
  formatTag:   d => d.toLocaleDateString('fr-CA',{weekday:'short',month:'short',day:'numeric'}),
};

function generateSlots(start, end, interval=45){
  const slots=[], toM=t=>{const[h,m]=t.split(':').map(Number);return h*60+m;};
  const fmt=m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
  for(let m=toM(start); m<toM(end); m+=interval) slots.push(fmt(m));
  return slots;
}

function initScrollReveal(){
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

function initFaq(){
  document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click',()=>{
      const item=q.parentElement, ans=item.querySelector('.faq-a'), open=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i=>{i.classList.remove('open');i.querySelector('.faq-a').style.maxHeight='0';});
      if(!open){ item.classList.add('open'); ans.style.maxHeight=ans.scrollHeight+'px'; }
    });
  });
}

function hideLoading(delay=1200){
  setTimeout(()=>{
    const el=document.getElementById('loading');
    if(!el) return;
    el.classList.add('hide');
    setTimeout(()=>el.style.display='none',700);
  }, delay);
}