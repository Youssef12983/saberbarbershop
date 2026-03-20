/* ════════════════════════════════════════
   SABER BARBER — booking.js
════════════════════════════════════════ */
'use strict';

let selectedSlot = null;
let currentDate  = DateHelper.today();
let activeBarber = null;

function initBookingPage(){
  // Read barber from URL param e.g. booking.html?barber=saber
  const params = new URLSearchParams(window.location.search);
  const bid    = params.get('barber');
  activeBarber = BARBERS.find(b=>b.id===bid) || BARBERS[0];

  document.getElementById('bookAvatar').textContent   = activeBarber.initials;
  document.getElementById('bookName').textContent     = activeBarber.name.toUpperCase();
  renderDate(); renderSlots();
}

function renderDate(){
  document.getElementById('curDate').textContent = DateHelper.formatShort(currentDate);
}

function changeDay(delta){
  currentDate.setDate(currentDate.getDate()+delta);
  const today=DateHelper.today();
  if(currentDate<today) currentDate=today;
  selectedSlot=null; renderDate(); renderSlots();
}

function isBooked(t){ return !!Bookings.get(activeBarber.id)[Bookings.key(currentDate,t)]; }
function isPast(t){
  const[h,m]=t.split(':').map(Number), d=new Date(currentDate);
  d.setHours(h,m,0,0); return d<=new Date();
}
function isOffOrClosed(){
  const s=Schedule.get(activeBarber.id), ds=DateHelper.isoDate(currentDate);
  if(s.offDays&&s.offDays.includes(ds)) return true;
  return !s.activeDays.includes((currentDate.getDay()+6)%7);
}

function renderSlots(){
  const g=document.getElementById('slotsGrid'); g.innerHTML='';
  if(isOffOrClosed()){
    g.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:28px;font-size:0.78rem;font-style:italic;">Ce barbier n\'est pas disponible ce jour-là.</div>';
    return;
  }
  const s=Schedule.get(activeBarber.id);
  generateSlots(s.startTime||'08:00',s.endTime||'21:00').forEach(t=>{
    const btn=document.createElement('button'); btn.className='slot'; btn.textContent=t;
    if(isBooked(t)||isPast(t)) btn.classList.add('booked');
    else{
      if(selectedSlot===t) btn.classList.add('selected');
      btn.onclick=()=>{ selectedSlot=t; renderSlots(); };
    }
    g.appendChild(btn);
  });
}

function confirmBooking(){
  const name=document.getElementById('cName').value.trim();
  const phone=document.getElementById('cPhone').value.trim();
  const email=document.getElementById('cEmail').value.trim();
  const service=document.getElementById('cService').value;
  if(!name||!phone||!email||!service){ alert('Veuillez remplir tous les champs.'); return; }
  if(!selectedSlot){ alert('Veuillez sélectionner un créneau.'); return; }

  const bk=Bookings.get(activeBarber.id);
  bk[Bookings.key(currentDate,selectedSlot)]={name,phone,email,service};
  Bookings.save(activeBarber.id,bk);

  document.getElementById('bookFormWrap').style.display='none';
  document.getElementById('bookSuccess').classList.add('show');
  document.getElementById('successMsg').textContent=
    `${name}, votre rendez-vous pour "${service}" avec ${activeBarber.name} le ${DateHelper.formatLong(currentDate)} à ${selectedSlot} est confirmé. À bientôt !`;

  setTimeout(()=>{
    document.getElementById('bookSuccess').classList.remove('show');
    document.getElementById('bookFormWrap').style.display='block';
    ['cName','cPhone','cEmail'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('cService').value='';
    selectedSlot=null; renderSlots();
  },9000);
}