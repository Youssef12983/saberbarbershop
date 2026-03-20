/* ════════════════════════════════════════
   SABER BARBER — stars.js
════════════════════════════════════════ */
'use strict';

function initStars(){
  const canvas=document.getElementById('starsCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let W=canvas.width=window.innerWidth;
  let H=canvas.height=window.innerHeight;

  function mkStar(resetY=false){
    return{
      x:Math.random()*W, y:resetY?-2:Math.random()*H,
      size:Math.random()*1.5+0.2,
      op:Math.random()*0.7+0.1,
      speed:Math.random()*0.15+0.03,
      tSpeed:Math.random()*0.007+0.002,
      tDir:Math.random()>0.5?1:-1,
      gold:Math.random()<0.12,
    };
  }

  const stars=Array.from({length:200},()=>mkStar());
  const shoots=[];
  let shootTimer=0, nextShoot=randInterval();
  function randInterval(){ return Math.random()*240+180; }

  function mkShoot(){
    return{ x:Math.random()*W, y:Math.random()*H*0.5,
      len:Math.random()*110+50, speed:Math.random()*6+4,
      angle:Math.PI/4+(Math.random()-0.5)*0.4,
      op:1, life:0, maxLife:Math.random()*40+30 };
  }

  function draw(){
    ctx.clearRect(0,0,W,H);

    stars.forEach(s=>{
      s.op+=s.tSpeed*s.tDir;
      if(s.op>=0.82||s.op<=0.07) s.tDir*=-1;
      s.y+=s.speed;
      if(s.y>H+2) Object.assign(s,mkStar(true));
      ctx.beginPath(); ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
      ctx.fillStyle=s.gold?`rgba(201,168,76,${s.op*0.9})`:`rgba(245,240,232,${s.op})`;
      ctx.fill();
      if(s.size>1.15){
        const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.size*2.8);
        g.addColorStop(0,s.gold?`rgba(201,168,76,${s.op*0.28})`:`rgba(245,240,232,${s.op*0.18})`);
        g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(s.x,s.y,s.size*2.8,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
      }
    });

    shootTimer++;
    if(shootTimer>=nextShoot){ shoots.push(mkShoot()); shootTimer=0; nextShoot=randInterval(); }
    for(let i=shoots.length-1;i>=0;i--){
      const ss=shoots[i];
      ss.life++; ss.x+=Math.cos(ss.angle)*ss.speed; ss.y+=Math.sin(ss.angle)*ss.speed;
      ss.op=1-ss.life/ss.maxLife;
      const tx=ss.x-Math.cos(ss.angle)*ss.len, ty=ss.y-Math.sin(ss.angle)*ss.len;
      const g=ctx.createLinearGradient(tx,ty,ss.x,ss.y);
      g.addColorStop(0,'rgba(201,168,76,0)');
      g.addColorStop(0.6,`rgba(245,240,232,${ss.op*0.45})`);
      g.addColorStop(1,`rgba(255,255,255,${ss.op})`);
      ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(ss.x,ss.y);
      ctx.strokeStyle=g; ctx.lineWidth=1.4; ctx.stroke();
      if(ss.life>=ss.maxLife) shoots.splice(i,1);
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize',()=>{ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; });
}