/* ════════════════════════════════════════
   SABER BARBER — admin.js
════════════════════════════════════════ */
'use strict';

let loggedInBarber=null, adminActiveDays=[0,1,2,3,4,5,6], adminOffDays=[];
const JOURS=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

function doLogin(){
  const u=document.getElementById('loginUser').value.trim().toLowerCase();
  const p=document.getElementById('loginPass').value;
  const b=BARBERS.find(x=>x.id===u&&x.password===p);
  if(!b){ document.getElementById('loginErr').classList.add('show'); return; }
  document.getElementById('loginErr').classList.remove('show');
  loggedInBarber=b;
  // Store session and redirect to admin dashboard
  sessionStorage.setItem('adminBarber', b.id);
  loadDashboard(b);
  document.getElementById('loginSection').style.display='none';
  document.getElementById('dashSection').style.display='block';
}

function doLogout(){
  loggedInBarber=null;
  sessionStorage.removeItem('adminBarber');
  document.getElementById('loginSection').style.display='flex';
  document.getElementById('dashSection').style.display='none';
  document.getElementById('loginUser').value='';
  document.getElementById('loginPass').value='';
}

function checkSession(){
  const bid=sessionStorage.getItem('adminBarber');
  if(!bid) return;
  const b=BARBERS.find(x=>x.id===bid);
  if(!b) return;
  loggedInBarber=b;
  loadDashboard(b);
  document.getElementById('loginSection').style.display='none';
  document.getElementById('dashSection').style.display='block';
}

function loadDashboard(b){
  document.getElementById('dashGreeting').textContent=`Bonjour, ${b.name} !`;
  const s=Schedule.get(b.id);
  adminActiveDays=s.activeDays||[0,1,2,3,4,5,6];
  adminOffDays=s.offDays||[];
  document.getElementById('startTime').value=s.startTime||'08:00';
  document.getElementById('endTime').value=s.endTime||'21:00';
  document.getElementById('availToggle').checked=s.available!==false;
  updateAvailLabel(); renderDaysGrid(); renderOffTags(); switchTab('schedule');
}

function updateAvailLabel(){
  document.getElementById('availLabel').textContent=
    document.getElementById('availToggle').checked?'Je suis disponible':'Je suis indisponible';
}

function renderDaysGrid(){
  const g=document.getElementById('daysGrid'); g.innerHTML='';
  JOURS.forEach((j,i)=>{
    const on=adminActiveDays.includes(i), d=document.createElement('div');
    d.className='day-btn'+(on?' on':'');
    d.innerHTML=`<div class="dn">${j}</div><div class="dc">${on?'✓':'–'}</div>`;
    d.onclick=()=>{ if(adminActiveDays.includes(i)) adminActiveDays=adminActiveDays.filter(x=>x!==i); else{adminActiveDays.push(i);adminActiveDays.sort();} renderDaysGrid(); };
    g.appendChild(d);
  });
}

function addOffDay(){
  const v=document.getElementById('offDayInput').value;
  if(!v||adminOffDays.includes(v)) return;
  adminOffDays.push(v); adminOffDays.sort();
  document.getElementById('offDayInput').value='';
  renderOffTags();
}
function removeOffDay(d){ adminOffDays=adminOffDays.filter(x=>x!==d); renderOffTags(); }
function renderOffTags(){
  const c=document.getElementById('offTags'); c.innerHTML='';
  if(!adminOffDays.length){ c.innerHTML='<span style="color:#222;font-size:0.7rem;font-style:italic;">Aucun congé planifié.</span>'; return; }
  adminOffDays.forEach(d=>{
    const tag=document.createElement('div'); tag.className='off-tag';
    const dt=new Date(d+'T00:00:00');
    tag.innerHTML=`${DateHelper.formatTag(dt)} <button onclick="removeOffDay('${d}')">×</button>`;
    c.appendChild(tag);
  });
}

function saveSchedule(){
  if(!loggedInBarber) return;
  Schedule.save(loggedInBarber.id,{
    activeDays:adminActiveDays,
    startTime:document.getElementById('startTime').value,
    endTime:document.getElementById('endTime').value,
    offDays:adminOffDays,
    available:document.getElementById('availToggle').checked,
  });
  const m=document.getElementById('saveMsg'); m.style.display='block';
  setTimeout(()=>m.style.display='none',3000);
}

function switchTab(tab){
  document.querySelectorAll('.dash-tab').forEach((t,i)=>t.classList.toggle('active',i===(tab==='schedule'?0:1)));
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  if(tab==='appointments'&&loggedInBarber) renderAppointments();
}

function renderAppointments(){
  const tbody=document.getElementById('apptsBody'), today=DateHelper.today();
  const bk=Bookings.get(loggedInBarber.id);
  const entries=Object.entries(bk)
    .map(([k,v])=>{const[ds,t]=k.split('|');return{...v,ds,t};})
    .filter(e=>new Date(e.ds+'T00:00:00')>=today)
    .sort((a,b)=>a.ds.localeCompare(b.ds)||a.t.localeCompare(b.t));
  tbody.innerHTML='';
  if(!entries.length){ tbody.innerHTML='<tr><td colspan="6" class="no-appts">Aucun rendez-vous à venir.</td></tr>'; return; }
  entries.forEach(e=>{
    const dt=new Date(e.ds+'T00:00:00'), tr=document.createElement('tr');
    tr.innerHTML=`<td>${DateHelper.formatTag(dt)}</td><td>${e.t}</td><td>${e.name}</td><td>${e.phone}</td><td>${e.email}</td><td>${e.service}</td>`;
    tbody.appendChild(tr);
  });
}