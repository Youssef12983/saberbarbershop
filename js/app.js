/* ════════════════════════════════════════
   SABER BARBER — app.js
════════════════════════════════════════ */
'use strict';

/* ── 🔧 BARBIERS — modifie ici ────────────────────────────── */
const BARBERS = [
  {
    id:'saber', name:'Saber', initials:'S', password:'saber123',
    exp:"8 ans d'expérience",
    bio:"Fondateur de Saber Barber. Spécialisé dans les coupes classiques et les rasages traditionnels. Sa précision lui vaut une clientèle fidèle.",
photo: 'assets/images/saber.png',  },
  {
    id:'qqn', name:'Qqn', initials:'Q', password:'saber123',
    exp:"5 ans d'expérience",
    bio:"Expert en dégradés modernes et tailles de barbe. Il apporte une touche contemporaine à chaque coupe.",
    photo: null,
  },
  {
    id:'qq2', name:'Qq2', initials:'Q2', password:'saber123',
    exp:"3 ans d'expérience",
    bio:"Passionné par la coiffure, il excelle dans les styles tendance et prend le temps d'écouter chaque client.",
    photo: null,
  },
];

/* ── RENDER TEAM ─────────────────────────────────────────── */
function renderTeam(gridId){
  const grid=document.getElementById(gridId);
  if(!grid) return;
  grid.innerHTML='';
  BARBERS.forEach(b=>{
    const s=Schedule.get(b.id), avail=s.available!==false;
    const card=document.createElement('div');
    card.className='team-card'+(avail?'':' unavailable');
    const photoHtml=b.photo
      ?`<img src="${b.photo}" alt="${b.name}"/>`
      :`<div class="team-photo-avatar">${b.initials}</div>`;
    const actionHtml=avail
      ?`<a class="btn-glow" href="booking.html?barber=${b.id}">
          <svg viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Prendre rendez-vous
        </a>`
      :`<div style="font-family:'Oswald',sans-serif;font-size:0.6rem;letter-spacing:0.15em;color:#2a2a2a;text-transform:uppercase;">Indisponible</div>`;
    card.innerHTML=`
      ${!avail?'<div class="unavail-badge">Indisponible</div>':''}
      <div class="team-photo">${photoHtml}</div>
      <div class="team-info">
        <div class="team-name">${b.name}</div>
        <div class="team-exp">${b.exp}</div>
        <div class="team-bio">${b.bio}</div>
        ${actionHtml}
      </div>`;
    grid.appendChild(card);
  });
}

/* ── INIT ────────────────────────────────────────────────── */
window.addEventListener('load',()=>{
  initStars();
  initNavbar();
  initFaq();
  initScrollReveal();
  hideLoading(1100);
  // Render team if grid exists on this page
  renderTeam('teamGrid');
  renderTeam('teamGrid2');
});