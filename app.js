const state={year:1968,water:42,land:18,people:12,choice:null};
const $=s=>document.querySelector(s);
const intro=$("#introPanel"), game=$("#game");
$("#startBtn").onclick=()=>intro.classList.add("open");
$("#enterBtn").onclick=()=>{intro.classList.remove("open");game.classList.remove("hidden");renderMap()};
$("#closeGame").onclick=()=>game.classList.add("hidden");

function renderMap(){
 const plots=$("#plotsGame"), workers=$("#workers");
 plots.innerHTML="";
 workers.innerHTML="";
 for(let i=0;i<5;i++){
   const x=250+i*115,y=405-(i%2)*42;
   const p=document.createElementNS("http://www.w3.org/2000/svg","path");
   p.setAttribute("d",`M${x} ${y} L${x+92} ${y-22} L${x+108} ${y+42} L${x+15} ${y+62}Z`);
   p.setAttribute("fill",i<2?"#9c895d":"#a58f64");p.setAttribute("stroke","#c2ad7e");p.setAttribute("stroke-width","2");p.setAttribute("opacity",".8");plots.appendChild(p);
 }
 for(let i=0;i<state.people;i++){
   const c=document.createElementNS("http://www.w3.org/2000/svg","circle");
   c.setAttribute("cx",120+(i*73)%850);c.setAttribute("cy",580-(i%5)*38);c.setAttribute("r",i%3?3:4);c.setAttribute("fill","#e0c98f");c.setAttribute("opacity",".75");workers.appendChild(c);
 }
 $("#year").textContent=state.year;
 $("#waterStat").textContent=state.water;
 $("#landStat").textContent=state.land;
 $("#peopleStat").textContent=state.people;
}

document.querySelectorAll(".choice").forEach(btn=>btn.onclick=()=>{
 const c=btn.dataset.choice; state.choice=c;
 let title="",msg="";
 if(c==="water"){state.water+=28;state.land-=2;title="EL AGUA PRIMERO";msg="La capacidad hídrica crece. El territorio todavía espera, pero ahora existe una infraestructura capaz de sostener el próximo salto."}
 if(c==="land"){state.land+=15;state.water-=8;title="LA TIERRA PRIMERO";msg="Las parcelas avanzan. La producción potencial aumenta, pero la presión sobre el agua aparece antes de lo previsto."}
 if(c==="people"){state.people+=9;state.water-=4;title="LA GENTE PRIMERO";msg="Llegan trabajadores y familias. El territorio empieza a necesitar viviendas, caminos y una organización más permanente."}
 const canal=$("#canal");canal.style.opacity=c==="water"?"1":c==="land"?".45":".25";
 $("#feedback").innerHTML=`<strong>${title}</strong>${msg}<br><br>El mapa acaba de registrar tu primera decisión. Esta elección podrá tener consecuencias mucho después.`;
 renderMap();
});
