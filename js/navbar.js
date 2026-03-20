/* ════════════════════════════════════════
   SABER BARBER — navbar.js
════════════════════════════════════════ */
'use strict';

function initNavbar(){
  const navbar=document.getElementById('navbar');
  const navLinks=document.getElementById('navLinks');
  const hamburger=document.getElementById('hamburger');
  window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>60));
  hamburger.addEventListener('click',()=>{ hamburger.classList.toggle('open'); navLinks.classList.toggle('open'); });
}

function closeNav(){
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* Navigate between separate HTML pages */
function goTo(page){ window.location.href = page; }