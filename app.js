import {PHASES} from "./data.js";

const SAVE_KEY="inevitable-v2";
const state={phase:0,water:42,production:18,community:24,services:8,population:0,trust:50,food:0,money:100,history:[],missions:[],character:""};
const $=s=>document.querySelector(s);
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(state))}
function load(){try{Object.assign(state,JSON.parse(localStorage.getItem(SAVE_KEY)||"{}"))}catch(e){}}
function clamp(n){return Math.max(0,Math.min(100,n))}
function addHistory(title,text,type="decision"){state.history.push({title,text,type});if(state.history.length>10)state.history.shift()}
const characters=[
 {id:"gasparri",name:"Gasparri",role:"PIONERO PRODUCTIVO",desc:"Representa la escala productiva que comienza a transformar el territorio.",tone:"tierra"},
 {id:"riego",name:"El agua",role:"SISTEMA VITAL",desc:"No es una persona: es el sistema que condiciona toda la partida.",tone:"agua"},
 {id:"trabajador",name:"La familia agrícola",role:"COMUNIDAD",desc:"La producción necesita personas, vivienda, servicios y organización.",tone:"comunidad"},
 {id:"institucion",name:"La Comisión de Fomento",role:"ORGANIZACIÓN",desc:"Cuando el territorio crece, aparece la necesidad de institucionalizarlo.",tone:"institucion"}
];
const missions=[
 {id:"m1",phase:0,title:"ENTENDER EL TERRITORIO",text:"Antes de decidir, reconocé qué elementos condicionan la futura localidad.",goal:"Elegí una prioridad inicial."},
 {id:"m2",phase:1,title:"HACER POSIBLE EL RIEGO",text:"La transformación productiva depende de infraestructura y organización.",goal:"Tomá una decisión sobre el sistema de agua."},
 {id:"m3",phase:2,title:"CONVERTIR TIERRA EN PRODUCCIÓN",text:"La escala productiva cambia el problema: ya no alcanza con disponer de tierra.",goal:"Equilibrá producción y comunidad."},
 {id:"m4",phase:3,title:"HACER LUGAR A LA GENTE",text:"El crecimiento productivo genera la necesidad de un núcleo para quienes trabajan.",goal:"Elegí qué priorizar al organizar el núcleo."},
 {id:"m5",phase:4,title:"NACE UNA LOCALIDAD",text:"Llegaste al hito fundacional. Desde aquí la historia institucional debe continuar.",goal:"Prepará la siguiente etapa."}
];
function intro(){
 $("screen").innerHTML='<section class="hero"><div class="kicker">SIMULACIÓN HISTÓRICA · SAN PATRICIO DEL CHAÑAR</div><h1>INEVITABLE</h1><h2>Construí la historia.</h2><p>Una experiencia de decisiones donde el territorio, el agua, la producción y la comunidad se afectan entre sí.</p><div class="hero-actions"><button class="primary" id="start">NUEVA PARTIDA</button><button class="secondary" id="continue">CONTINUAR</button></div><div class="law"><b>REGLA FUNDAMENTAL</b><span>La historia documentada es fija. Tus decisiones crean una línea alternativa alrededor de ella.</span></div></section>';
 $("start").onclick=()=>{Object.assign(state,{phase:0,water:42,production:18,community:24,services:8,population:0,trust:50,food:0,money:100,history:[],missions:[]});render();save()};
 $("continue").onclick=()=>render();
}
function render(){
 const p=PHASES[state.phase]||PHASES[PHASES.length-1];
 const m=missions.find(x=>x.phase===state.phase)||missions[missions.length-1];
 $("screen").innerHTML='<section class="game"><div class="game-head"><div><div class="kicker">'+p.year+' · '+(p.type||"HISTORIA")+'</div><h1>'+p.title+'</h1><p>'+p.text+'</p></div><button class="secondary small" id="people">PERSONAJES</button></div><div class="world"><div class="sun"></div><div class="river"></div><div class="road road1"></div><div class="road road2"></div><div class="zone zone1">TERRITORIO</div><div class="zone zone2">AGUA</div><div class="zone zone3">CHACRAS</div><div class="zone zone4">NÚCLEO</div><div class="scale">MAPA DE JUEGO · '+(state.phase+1)+'/5</div></div><div class="columns"><aside class="mission"><span class="tag">MISIÓN '+(state.phase+1)+'</span><h2>'+m.title+'</h2><p>'+m.text+'</p><b>OBJETIVO</b><p>'+m.goal+'</p></aside><section class="decisions"><div class="section-label">DECISIÓN</div><button class="choice" data-choice="water"><b>01 · AGUA</b><span>Invertir en riego, drenaje y capacidad territorial.</span><i>+ agua · + producción · costo económico</i></button><button class="choice" data-choice="production"><b>02 · PRODUCCIÓN</b><span>Acelerar la transformación de tierra en actividad productiva.</span><i>+ producción · presión sobre agua</i></button><button class="choice" data-choice="community"><b>03 · COMUNIDAD</b><span>Preparar vivienda, organización y condiciones para las familias.</span><i>+ comunidad · + confianza · costo de expansión</i></button></section></div><div class="history-strip"><b>HISTORIA</b><span>'+state.history.slice(-1).map(x=>x.text).join("")+'</span></div></section>';
 document.querySelectorAll(".choice").forEach(b=>b.onclick=()=>decision(b.dataset.choice));
 $("people").onclick=showPeople;updateHud();
}
function decision(kind){
 const effects={water:{water:12,production:5,money:-14},production:{production:12,water:-6,money:-10},community:{community:12,trust:8,money:-12,services:5}};
 const e=effects[kind];for(const k in e)state[k]=k==="money"?state[k]+e[k]:clamp(state[k]+e[k]);
 state.population=state.phase>=3?Math.max(state.population,state.community*7):state.population;
 addHistory("Decisión",kind==="water"?"Se priorizó el sistema de agua.":kind==="production"?"Se priorizó la producción.":"Se priorizó la comunidad.");
 if(state.phase<PHASES.length-1)state.phase++;
 save();render();
}
function showPeople(){
 $("screen").innerHTML='<section class="people"><div class="kicker">SISTEMA DE PERSONAJES</div><h1>Las personas hacen al pueblo.</h1><p>Los personajes todavía no son biografías inventadas: son roles del sistema. Las biografías reales se incorporarán solamente con fuentes.</p><div class="people-grid">'+characters.map(c=>'<article><div class="avatar '+c.tone+'">'+c.name.slice(0,1)+'</div><small>'+c.role+'</small><h2>'+c.name+'</h2><p>'+c.desc+'</p></article>').join("")+'</div><button class="primary" id="back">VOLVER AL MUNDO</button></section>';
 $("back").onclick=render;
}
function updateHud(){
 const p=PHASES[state.phase]||PHASES[0];
 $("year").textContent=p.year;$("water").textContent=state.water+"%";$("production").textContent=state.production+"%";$("community").textContent=state.community+"%";$("population").textContent=state.population?Math.round(state.population):"—";$("money").textContent=state.money+" u.";$("eraLabel").textContent=p.title;
}
$("reset").onclick=()=>{localStorage.removeItem(SAVE_KEY);location.reload()};load();intro();