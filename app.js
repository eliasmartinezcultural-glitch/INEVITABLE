const KEY="inevitable-save-v02";
const $=s=>document.querySelector(s);
const NS="http://www.w3.org/2000/svg";
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const uid=()=>Math.random().toString(36).slice(2,8);
const freshState=()=>({
 version:2,year:1968,month:3,phase:"EXPLORACIÓN",tool:"inspect",money:100,water:42,land:18,people:12,trust:62,
 homes:0,food:0,production:0,roads:0,canals:0,services:0,maintenance:0,waterDemand:8,waterCoverage:0,
 selectedZone:null,pending:null,history:[],memory:[],events:[],flags:{explored:false,waterPlan:false,firstBuild:false,settled:false},
 zones:[
  {id:"alto",name:"TERRENO ALTO",x:280,y:315,w:220,h:105,potential:7,risk:2,waterNeed:5,desc:"Suelo con buen potencial para una expansión ordenada, pero llevar agua hasta aquí exige más obra."},
  {id:"bajo",name:"BAJO RIBEREÑO",x:520,y:430,w:250,h:95,potential:9,risk:6,waterNeed:3,desc:"Más cercano al agua y atractivo para producción, aunque la cercanía al río aumenta las restricciones y el cuidado necesario."},
  {id:"monte",name:"MONTE",x:760,y:245,w:220,h:120,potential:4,risk:1,waterNeed:2,desc:"Territorio menos preparado. Transformarlo abre posibilidades, pero exige trabajo antes de producir."},
  {id:"asiento",name:"FUTURO ASIENTO",x:430,y:540,w:240,h:90,potential:6,risk:3,waterNeed:4,desc:"Zona útil para concentrar población y servicios. Si llega gente antes que infraestructura, la presión crece rápido."}
 ]
});
let state=freshState(), zoom=1, toolPoints=[];

function save(){localStorage.setItem(KEY,JSON.stringify(state)); flash("PARTIDA GUARDADA","Tu línea alternativa quedó almacenada en este dispositivo.","benefit")}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&x.version===2)state=x}catch(e){}}
function log(title,text,status="simulation"){
 state.history.push({id:uid(),year:state.year,title,text,status});
 if(state.history.length>80)state.history.shift();
}
function flash(title,text,kind=""){ $( "#feedback").innerHTML='<strong>'+title+'</strong><span class="'+kind+'">'+text+"</span>"; }
function money(n){state.money=clamp(Math.round(n),0,999)}
function updateHUD(){
 $("#year").textContent=state.year;
 $("#phase").textContent=state.phase;
 $("#waterStat").textContent=Math.round(state.water);
 $("#landStat").textContent=Math.max(0,Math.round(state.land));
 $("#peopleStat").textContent=Math.round(state.people);
 $("#moneyStat").textContent=Math.round(state.money);
 $("#trustStat").textContent=Math.round(state.trust);
 $("#homesStat").textContent=state.homes+"/"+Math.max(4,Math.ceil(state.people/5));
 $("#memoryCount").textContent=state.memory.length;
 $("#mapMode").textContent=state.tool==="inspect"?"EXPLORACIÓN":state.tool==="canal"?"TRAZADO DE AGUA":state.tool==="road"?"TRAZADO DE CAMINO":"ASENTAMIENTO";
}
function svgEl(tag,attrs={},text=""){const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text)e.textContent=text;return e}
function clearGroups(){["zones","plotsGame","canals","roads","buildings","services","workers","effects"].forEach(id=>{$("#"+id).innerHTML=""})}
function renderMap(){
 clearGroups();
 const zones=$("#zones");
 state.zones.forEach(z=>{
  const g=svgEl("g",{class:"zone",transform:"translate("+z.x+" "+z.y+")","data-zone":z.id});
  const p=svgEl("path",{d:"M0 18 L"+z.w+" 0 L"+(z.w+22)+" "+z.h+" L22 "+(z.h+15)+"Z",fill:z.id===state.selectedZone?"#b39a67":"#8d815d",opacity:z.id===state.selectedZone?".92":".55",stroke:z.id===state.selectedZone?"#f0d29a":"#b6a172","stroke-width":z.id===state.selectedZone?3:1.5});
  g.appendChild(p);
  if(state.flags.explored||z.id===state.selectedZone)g.appendChild(svgEl("text",{x:15,y:35,fill:"#eee",opacity:".8","font-size":"11","letter-spacing":"2"},z.name));
  g.addEventListener("click",e=>{e.stopPropagation();selectZone(z.id)});zones.appendChild(g);
 });
 for(let i=0;i<Math.min(12,state.production+2);i++){
  const x=300+(i*61)%650,y=390-(i%4)*38;
  $("#plotsGame").appendChild(svgEl("path",{d:"M"+x+" "+y+" l75 -18 l12 42 l-76 20z",fill:i<state.production?"#a99564":"#887b5a",stroke:"#c7b27d","stroke-width":"1",opacity:i<state.production?".9":".45"}));
 }
 for(let i=0;i<state.canals;i++){
  const y=430+i*23;
  $("#canals").appendChild(svgEl("path",{class:"canal-line",d:"M120 "+(600-i*18)+" C350 "+(535-i*20)+" 560 "+(455-i*25)+" 1030 "+(350-i*20),opacity:".9"}));
 }
 for(let i=0;i<state.roads;i++){
  const y=650-i*45;
  $("#roads").appendChild(svgEl("path",{class:"road-line",d:"M90 "+y+" C300 "+(y-55)+" 490 "+(y-90)+" 900 "+(y-180),opacity:".75"}));
 }
 for(let i=0;i<state.homes;i++){
  const x=450+(i*78)%300,y=545-(i%3)*38;
  const g=svgEl("g",{});g.appendChild(svgEl("rect",{class:"house",x,y,width:34,height:25,rx:2}));g.appendChild(svgEl("path",{d:"M"+(x-4)+" "+y+" l21 -17 l21 17z",fill:"#8e684e"}));$("#buildings").appendChild(g);
 }
 for(let i=0;i<state.services;i++){
  const x=510+i*85,y=505-(i%2)*35;$("#services").appendChild(svgEl("rect",{class:"service",x,y,width:28,height:34,rx:3}));
 }
 for(let i=0;i<Math.min(35,state.people);i++){
  const c=svgEl("circle",{class:"worker",cx:180+(i*73)%900,cy:560-(i%7)*35,r:i%4===0?4:3,opacity:".72"});$("#workers").appendChild(c);
 }
 updateHUD();
}
function selectZone(id){
 state.selectedZone=id;state.flags.explored=true;const z=state.zones.find(x=>x.id===id);
 if(state.tool==="inspect"){state.phase="DIAGNÓSTICO";renderMission(z);log("Exploraste "+z.name,z.desc,"simulation")}
 else if(state.tool==="house")buildHouse(z);
 else if(state.tool==="road")placeRoad(z);
 else if(state.tool==="canal")handleCanalZone(z);
 renderMap();
}
function renderMission(z){
 $("#missionType").textContent="LECTURA DEL TERRITORIO";
 $("#missionTitle").textContent=z.name;
 $("#missionText").textContent=z.desc+" Potencial "+z.potential+"/10 · presión/riesgo "+z.risk+"/10.";
 const choices=[];
 choices.push({id:"water",title:"PRIORIZAR EL AGUA",small:"Invertir 24 recursos · +18 capacidad · abre infraestructura futura",fn:()=>decisionWater()});
 choices.push({id:"land",title:"PREPARAR LA TIERRA",small:"Invertir 18 recursos · +8 tierra · +4 producción potencial · aumenta demanda",fn:()=>decisionLand()});
 choices.push({id:"people",title:"TRAER TRABAJADORES",small:"Invertir 12 recursos · +8 personas · acelera vivienda y caminos",fn:()=>decisionPeople()});
 if(state.flags.explored)choices.push({id:"hold",title:"OBSERVAR ANTES DE ACTUAR",small:"No gastás recursos. Ganás información y conservás margen.",fn:()=>observe()});
 drawChoices(choices);
}
function drawChoices(items){
 $("#decisionPanel").innerHTML="";
 items.forEach((it,i)=>{
  const b=document.createElement("button");b.className="choice";b.innerHTML='<i>0'+(i+1)+'</i><strong>'+it.title+'</strong><small>'+it.small+'</small><em>→</em>';b.onclick=it.fn;$("#decisionPanel").appendChild(b);
 });
}
function decisionWater(){
 if(state.money<24)return insufficient();
 money(state.money-24);state.water+=18;state.waterDemand+=2;state.flags.waterPlan=true;state.phase="INFRAESTRUCTURA";
 state.memory.push("1968: el agua fue priorizada antes que la expansión.");
 log("Primera apuesta: agua","La capacidad hídrica aumenta, pero ahora existe una obligación de construir y mantener la conducción.","hypothetical");
 flash("EL AGUA PRIMERO","Ganaste capacidad, pero el territorio ahora te exige construirla físicamente. La próxima misión será elegir cómo.","benefit");nextWaterMission();
}
function decisionLand(){
 if(state.money<18)return insufficient();
 money(state.money-18);state.land+=8;state.production+=4;state.waterDemand+=6;state.trust-=2;
 state.memory.push("1968: se preparó tierra antes de resolver toda la conducción.");
 log("La tierra se prepara","Aumenta el potencial productivo y también la presión sobre el agua.","hypothetical");
 flash("LA TIERRA RESPONDE","Ahora tenés más superficie productiva, pero cada parcela abierta reclama agua. El problema se hizo más grande.","risk");nextWaterMission();
}
function decisionPeople(){
 if(state.money<12)return insufficient();
 money(state.money-12);state.people+=8;state.trust+=4;state.flags.settled=true;state.waterDemand+=5;
 state.memory.push("1968: se priorizó la llegada de trabajadores.");
 log("Llegan trabajadores","La transformación deja de ser solamente territorial: aparecen necesidades humanas inmediatas.","hypothetical");
 flash("LA GENTE CAMBIA EL MAPA","La población genera demanda de vivienda, caminos y servicios. Ya no alcanza con pensar solo en parcelas.","benefit");nextSettlementMission();
}
function observe(){
 state.trust+=2;state.memory.push("1968: se decidió esperar y observar antes de comprometer recursos.");
 log("Esperar también fue una decisión","Conservaste recursos y mejoraste la lectura del territorio, pero el tiempo de transformación también cuenta.","hypothetical");
 flash("NO HACER NADA TAMBIÉN CAMBIA LA PARTIDA","Ganaste margen. Perdiste velocidad. El sistema conservará esta decisión.","");
 advanceMonth(2);renderMap();
}
function nextWaterMission(){
 $("#missionType").textContent="MISIÓN · INFRAESTRUCTURA";
 $("#missionTitle").textContent="LLEVAR EL AGUA";
 $("#missionText").textContent="Elegí TRAZAR AGUA y tocá dos puntos del mapa. La distancia, el costo y la cobertura dependerán de tu recorrido.";
 setTool("canal");drawChoices([{id:"canal",title:"TRAZAR EL CANAL",small:"Elegí origen y destino sobre el mapa. Un trazado directo es barato; uno largo puede servir mejor al territorio.",fn:()=>setTool("canal")} ,{id:"road",title:"ABRIR UN CAMINO PRIMERO",small:"Preparar circulación cuesta recursos, pero puede facilitar obras y asentamiento.",fn:()=>setTool("road")}]);
}
function nextSettlementMission(){
 $("#missionType").textContent="MISIÓN · COMUNIDAD";
 $("#missionTitle").textContent="DAR LUGAR A LA GENTE";
 $("#missionText").textContent="La población no es un contador. Sin vivienda y conexión, la presión aumenta.";
 drawChoices([{id:"house",title:"CONSTRUIR HOGARES",small:"20 recursos · capacidad para 5 personas · mejora confianza",fn:()=>setTool("house")},{id:"road",title:"CONECTAR EL ASIENTO",small:"14 recursos · abre circulación y reduce presión territorial",fn:()=>setTool("road")},{id:"delay",title:"ESPERAR",small:"No gastás ahora. La necesidad crecerá con el tiempo.",fn:()=>observe()}]);
}
function setTool(t){
 state.tool=t;toolPoints=[];updateHUD();
 document.querySelectorAll(".tool").forEach(b=>b.classList.toggle("active",b.dataset.tool===t));
 if(t==="inspect")flash("EXPLORACIÓN","Seleccioná una zona para leerla.","");
 if(t==="canal")flash("TRAZADO DE AGUA","Elegí dos puntos del mapa. Primero el origen, después el destino.","");
 if(t==="road")flash("TRAZADO DE CAMINO","Elegí dos puntos. El camino conectará necesidades, no una cuadrícula.","");
 if(t==="house")flash("VIVIENDA","Elegí una zona apta para asentamiento.","");
}
function handleCanalZone(z){if(toolPoints.length===0){toolPoints.push({x:z.x+z.w/2,y:z.y+z.h/2});flash("ORIGEN MARCADO","Ahora elegí el destino. La distancia importa.","");return} buildCanal(toolPoints[0],{x:z.x+z.w/2,y:z.y+z.h/2})}
function mapPoint(evt){const svg=$("#gameMap"),r=svg.getBoundingClientRect();return{x:(evt.clientX-r.left)/r.width*1200,y:(evt.clientY-r.top)/r.height*720}}
function mapClick(evt){
 if(evt.target.closest(".zone"))return;
 const p=mapPoint(evt);
 if(state.tool==="canal"){if(toolPoints.length===0){toolPoints=[p];flash("ORIGEN MARCADO","Ahora elegí el destino.","")}else buildCanal(toolPoints[0],p)}
 if(state.tool==="road"){if(toolPoints.length===0){toolPoints=[p];flash("ORIGEN MARCADO","Ahora elegí el destino.","")}else placeRoadAt(toolPoints[0],p)}
}
function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function buildCanal(a,b){
 const d=Math.round(distance(a,b)/22),cost=clamp(8+d*2,10,60);
 if(state.money<cost){insufficient(cost);toolPoints=[];return}
 money(state.money-cost);state.canals++;state.water+=Math.max(5,20-d);state.waterCoverage+=Math.max(4,16-d);state.waterDemand=Math.max(0,state.waterDemand-2);
 state.flags.firstBuild=true;state.phase="TRANSFORMACIÓN";state.memory.push("1968: se construyó una conducción de agua de longitud "+d+".");
 log("Canal construido","La obra conecta partes del territorio. Su costo depende del trazado elegido.","hypothetical");
 flash("EL MAPA CAMBIÓ","Canal construido. Ahora algunas tierras pueden pasar de potencial a producción. La longitud de tu trazado quedó registrada.","benefit");
 toolPoints=[];afterBuild();
}
function placeRoad(z){placeRoadAt({x:110,y:610},{x:z.x+z.w/2,y:z.y+z.h/2})}
function placeRoadAt(a,b){
 const d=Math.round(distance(a,b)/35),cost=clamp(8+d*2,10,42);
 if(state.money<cost){insufficient(cost);toolPoints=[];return}
 money(state.money-cost);state.roads++;state.trust+=3;state.memory.push("1968: se abrió un corredor de circulación.");
 log("Nuevo camino","La circulación conecta necesidades y reduce aislamiento.","hypothetical");
 flash("APARECE UN CAMINO","La conexión facilita futuras viviendas, producción y servicios. La próxima presión será decidir dónde concentrar el crecimiento.","benefit");
 toolPoints=[];afterBuild();
}
function buildHouse(z){
 if(state.money<20)return insufficient(20);
 if(state.homes>=Math.ceil(state.people/5))return flash("CAPACIDAD RESUELTA","Por ahora hay vivienda suficiente. Construir de más inmovilizaría recursos.","");
 money(state.money-20);state.homes++;state.trust+=8;state.maintenance+=2;state.memory.push("1968: se construyó vivienda para acompañar el asentamiento.");
 log("Primeros hogares","La población obtiene una base estable y el territorio empieza a concentrar vida cotidiana.","hypothetical");
 flash("APARECE UN HOGAR","La casa no es solo un objeto: aumenta mantenimiento, mejora confianza y atrae nuevos recorridos.","benefit");afterBuild();
}
function afterBuild(){
 if(state.flags.firstBuild&&state.flags.explored&&!state.flags.productionMission){
  state.flags.productionMission=true;state.phase="PRODUCCIÓN";
  $("#missionType").textContent="MISIÓN · PRODUCCIÓN";$("#missionTitle").textContent="HACER QUE EL AGUA PRODUZCA";
  $("#missionText").textContent="Ya existe infraestructura. Ahora decidí si usarla para producir, consolidar población o conservar capacidad.";
  drawChoices([{id:"prod",title:"ACTIVAR PRODUCCIÓN",small:"-6 agua · +10 producción · +5 recursos futuros",fn:activateProduction},{id:"settle",title:"CONSOLIDAR ASENTAMIENTO",small:"-4 recursos · +6 confianza · prepara servicios",fn:consolidate},{id:"reserve",title:"GUARDAR CAPACIDAD",small:"Sin gasto inmediato · +8 agua disponible · menos crecimiento",fn:reserveWater}]);
 }
 renderMap();
}
function activateProduction(){
 if(state.water<6)return flash("FALTA AGUA","La infraestructura existe, pero la demanda supera la capacidad disponible.","risk");
 state.water-=6;state.production+=10;state.money+=5;state.food+=8;state.trust+=2;state.memory.push("1968: el sistema de riego comenzó a sostener producción.");
 log("La producción despega","El agua se convierte en producción y la producción genera nuevos recursos. También aumenta la demanda futura.","hypothetical");
 flash("LA TIERRA EMPIEZA A RESPONDER","Más producción significa más transporte, más trabajadores y una nueva presión sobre infraestructura.","benefit");nextPressure();renderMap();
}
function consolidate(){
 if(state.money<4)return insufficient(4);money(state.money-4);state.trust+=6;state.people+=2;state.memory.push("1968: se consolidó el asentamiento antes de acelerar la producción.");
 log("Consolidar antes de crecer","La comunidad gana estabilidad, pero el crecimiento productivo queda temporalmente más lento.","hypothetical");
 flash("PRIMERO UNA COMUNIDAD","Ganaste estabilidad y población. Ahora habrá que decidir qué servicio aparece primero.","benefit");nextPressure();renderMap();
}
function reserveWater(){
 state.water+=8;state.trust+=1;state.memory.push("1968: se reservó capacidad hídrica para una expansión posterior.");
 log("Capacidad reservada","Menos crecimiento inmediato, más margen para responder a una crisis futura.","hypothetical");
 flash("MARGEN DE SEGURIDAD","No todo crecimiento tiene que ocurrir ahora. Guardaste capacidad para una decisión posterior.","");nextPressure();renderMap();
}
function nextPressure(){
 state.phase="PRESIÓN";$("#missionType").textContent="MISIÓN · CONSECUENCIA";$("#missionTitle").textContent="EL TERRITORIO PIDE OTRA COSA";
 $("#missionText").textContent="La primera cadena ya existe. Elegí qué presión querés resolver antes de cerrar 1968.";
 drawChoices([{id:"housing",title:"VIVIENDA",small:"Atender a la población antes de que aparezca déficit.",fn:()=>setTool("house")},{id:"transport",title:"TRANSPORTE",small:"Conectar producción con salida y evitar pérdidas.",fn:()=>setTool("road")},{id:"service",title:"PRIMER SERVICIO",small:"12 recursos · +5 confianza · abre una estructura comunitaria.",fn:buildService},{id:"year",title:"PASAR A 1969",small:"Cerrar el año con lo construido y dejar que el sistema calcule sus consecuencias.",fn:advanceYear}]);
}
function buildService(){
 if(state.money<12)return insufficient(12);money(state.money-12);state.services++;state.trust+=5;state.maintenance+=3;state.memory.push("1968: se priorizó un primer servicio comunitario.");
 log("Primer servicio","La comunidad empieza a necesitar estructuras que no son productivas, pero sostienen la vida cotidiana.","hypothetical");
 flash("LA LOCALIDAD GANA UNA PIEZA","El crecimiento ahora tiene una dimensión comunitaria. Más servicios también significan mantenimiento.","benefit");renderMap();nextPressure();
}
function advanceMonth(n=1){state.month+=n;while(state.month>12){state.month-=12;state.year++;annualTick()}}
function annualTick(){
 const pressure=state.waterDemand-(state.water+state.waterCoverage*.15);
 if(pressure>12){state.trust-=8;state.production=Math.max(0,state.production-3);state.events.push({year:state.year,title:"Presión hídrica",text:"La demanda superó la capacidad disponible."});}
 if(state.people>state.homes*5+4){state.trust-=7;state.events.push({year:state.year,title:"Déficit habitacional",text:"La población creció más rápido que la vivienda."});}
 state.money+=Math.round(state.production*.35)-state.maintenance;
 state.water=Math.max(0,state.water+state.waterCoverage*.05-state.waterDemand*.08);
 state.trust=clamp(state.trust,0,100);
}
function advanceYear(){
 advanceMonth(12-state.month+1);
 state.phase="1969 · CONSECUENCIAS";
 log("Cierre de 1968","El año terminó. El sistema trasladó tus decisiones a nuevas condiciones para 1969.","simulation");
 flash("1968 TERMINÓ","El territorio no volvió a cero. Agua, caminos, hogares, población, producción y confianza pasan a 1969.","benefit");
 $("#missionType").textContent="NUEVO AÑO";$("#missionTitle").textContent="1969 · LO QUE DEJÓ 1968";$("#missionText").textContent=summary();
 drawChoices([{id:"continue",title:"CONTINUAR LA PARTIDA",small:"Abrir la siguiente cadena de decisiones.",fn:continueYear},{id:"timeline",title:"REVISAR MEMORIA",small:"Ver las decisiones que ahora forman parte de tu línea alternativa.",fn:openTimeline}]);
 renderMap();
}
function continueYear(){
 state.phase="1969 · EXPANSIÓN";state.flags.year1969=true;state.waterDemand+=Math.ceil(state.people/8);
 log("Inicio de 1969","La nueva etapa hereda todas las condiciones producidas en 1968.","simulation");
 $("#missionType").textContent="1969 · NUEVA PRESIÓN";$("#missionTitle").textContent="CRECER SIN ROMPER EL EQUILIBRIO";
 $("#missionText").textContent="Elegí qué sistema recibe la próxima inversión. Cada uno fortalece algo y deja otra cosa más expuesta.";
 drawChoices([{id:"prod",title:"EXPANDIR PRODUCCIÓN",small:"30 recursos · +15 producción · +8 demanda hídrica",fn:expandProduction},{id:"homes",title:"EXPANDIR VIVIENDA",small:"25 recursos · +2 hogares · +6 confianza",fn:expandHousing},{id:"water",title:"AMPLIAR AGUA",small:"28 recursos · +22 capacidad · +4 mantenimiento",fn:expandWater},{id:"community",title:"FORTALECER COMUNIDAD",small:"15 recursos · +10 confianza · crecimiento más lento",fn:strengthenCommunity}]);
}
function expandProduction(){if(state.money<30)return insufficient(30);money(state.money-30);state.production+=15;state.waterDemand+=8;state.trust-=3;log("Expansión productiva","Más producción, más demanda de agua y transporte.","hypothetical");flash("CRECIMIENTO CON DEUDA","La producción subió. Ahora el sistema deberá absorber su propia escala.","risk");after1969()}
function expandHousing(){if(state.money<25)return insufficient(25);money(state.money-25);state.homes+=2;state.trust+=6;state.maintenance+=3;log("Más hogares","La expansión habitacional acompaña parte del crecimiento.","hypothetical");flash("LA VIDA SE ASIENTA","Más hogares estabilizan la población, pero agregan mantenimiento.","benefit");after1969()}
function expandWater(){if(state.money<28)return insufficient(28);money(state.money-28);state.water+=22;state.waterCoverage+=8;state.maintenance+=4;log("Ampliación hídrica","Más capacidad reduce presión futura, con una obligación permanente de mantenimiento.","hypothetical");flash("MÁS AGUA, MÁS RESPONSABILIDAD","La capacidad creció. El mantenimiento ahora importa cada año.","benefit");after1969()}
function strengthenCommunity(){if(state.money<15)return insufficient(15);money(state.money-15);state.trust+=10;state.people+=2;state.maintenance+=1;log("Comunidad primero","La cohesión mejora y atrae población, pero la expansión material se desacelera.","hypothetical");flash("LA COMUNIDAD TOMA PESO","La confianza puede sostener decisiones difíciles más adelante.","benefit");after1969()}
function after1969(){state.phase="1969 · RESULTADO";advanceMonth(1);$("#missionType").textContent="CONSECUENCIA REGISTRADA";$("#missionTitle").textContent="EL TERRITORIO RESPONDE";$("#missionText").textContent=summary();drawChoices([{id:"year",title:"PASAR AL SIGUIENTE CICLO",small:"Guardar este estado y seguir construyendo la línea alternativa.",fn:advanceYear},{id:"timeline",title:"ABRIR MEMORIA",small:"Revisar decisiones, costos y cambios acumulados.",fn:openTimeline}]);renderMap()}
function summary(){return "Agua "+Math.round(state.water)+" · producción "+Math.round(state.production)+" · personas "+Math.round(state.people)+" · hogares "+state.homes+" · confianza "+Math.round(state.trust)+" · recursos "+Math.round(state.money)+". El mapa conserva tus obras."}
function insufficient(cost=""){flash("RECURSOS INSUFICIENTES","Necesitás "+(cost||"más")+" recursos. Podés cambiar de prioridad, observar o esperar otra oportunidad.","risk")}
function openTimeline(){$("#timelinePanel").classList.add("open");const list=$("#timelineList");list.innerHTML="";const all=[...state.history].reverse();if(!all.length){list.innerHTML="<p>Tu memoria todavía está vacía.</p>";return}all.forEach(x=>{const d=document.createElement("div");d.className="timeline-item";d.innerHTML='<div class="time">'+x.year+'</div><div><div class="tag">'+x.status.toUpperCase()+'</div><h4>'+x.title+'</h4><p>'+x.text+'</p></div>';list.appendChild(d)})}
function closeTimeline(){$("#timelinePanel").classList.remove("open")}
function flashTimeline(){openTimeline()}
function setup(){
 load();
 $("#startBtn").onclick=()=>$("#introPanel").classList.add("open");
 $("#enterBtn").onclick=()=>{$("#introPanel").classList.remove("open");$("#game").classList.remove("hidden");renderMap();if(!state.history.length){log("Inicio","Entraste al territorio en 1968. El mapa todavía puede tomar muchas formas.","simulation");flash("BIENVENIDO AL TERRITORIO","No busques la opción correcta. Buscá entender qué produce cada decisión.","")}};
 $("#closeGame").onclick=()=>$("#game").classList.add("hidden");
 $("#closeTimeline").onclick=closeTimeline;
 $("#saveBtn").onclick=save;
 document.querySelectorAll(".tool").forEach(b=>b.onclick=()=>setTool(b.dataset.tool));
 $("#gameMap").addEventListener("click",mapClick);
 $("#zoomIn").onclick=()=>{zoom=clamp(zoom+.12,1,1.6);$("#gameMap").style.transform="scale("+zoom+")"};
 $("#zoomOut").onclick=()=>{zoom=clamp(zoom-.12,1,1.6);$("#gameMap").style.transform="scale("+zoom+")"};
 $("#resetView").onclick=()=>{zoom=1;$("#gameMap").style.transform="scale(1)"};
 window.addEventListener("keydown",e=>{if(e.key==="Escape")closeTimeline();if(e.key==="1")setTool("inspect");if(e.key==="2")setTool("canal");if(e.key==="3")setTool("road");if(e.key==="4")setTool("house")});
 updateHUD();
}
setup();