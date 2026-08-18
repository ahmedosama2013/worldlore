import { asiaData } from "./asia.js";
import { africaData } from "./africa.js";
import { europeData } from "./europe.js";
import { northAmericaData } from "./northAmerica.js";
import { southAmericaData } from "./southAmerica.js";
import { oceaniaData } from "./oceania.js";

const continentSources=[
 {key:"asia",label:"Asia",data:asiaData},
 {key:"africa",label:"Africa",data:africaData},
 {key:"europe",label:"Europe",data:europeData},
 {key:"northAmerica",label:"North America",data:northAmericaData},
 {key:"southAmerica",label:"South America",data:southAmericaData},
 {key:"oceania",label:"Oceania",data:oceaniaData}
];
const allCountries=continentSources.flatMap(({key,label,data})=>data.map(country=>({...country,continentKey:key,continent:label})));
const el={html:document.documentElement,searchInput:document.getElementById("searchInput"),themeToggle:document.getElementById("themeToggle"),themeIcon:document.getElementById("themeIcon"),continentPicker:document.getElementById("continentPicker"),continentButton:document.getElementById("continentButton"),continentLabel:document.getElementById("continentLabel"),continentMenu:document.getElementById("continentMenu"),surpriseButton:document.getElementById("surpriseButton"),initialState:document.getElementById("initialState"),noResultsState:document.getElementById("noResultsState"),noResultsMessage:document.getElementById("noResultsMessage"),historyCard:document.getElementById("historyCard"),countryContinent:document.getElementById("countryContinent"),countryName:document.getElementById("countryName"),countryCapital:document.getElementById("countryCapital"),formationYear:document.getElementById("formationYear"),independenceInfo:document.getElementById("independenceInfo"),historyParagraphs:document.getElementById("historyParagraphs")};
let selectedContinent="all", menuOpen=false;
const normalize=v=>v.toLocaleLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").trim();
const activeDataset=()=>selectedContinent==="all"?allCountries:allCountries.filter(c=>c.continentKey===selectedContinent);
function applyTheme(theme){const t=theme==="light"?"light":"dark";el.html.dataset.theme=t;el.themeIcon.textContent=t==="dark"?"☼":"◐";el.themeToggle.setAttribute("aria-label",t==="dark"?"Switch to light mode":"Switch to dark mode");el.themeToggle.title=t==="dark"?"Switch to light mode":"Switch to dark mode";try{localStorage.setItem("worldlore-theme",t)}catch{}}
function initTheme(){let t=null;try{t=localStorage.getItem("worldlore-theme")}catch{}applyTheme(t||"dark");}
function buildMenu(){const opts=[{key:"all",label:"All Continents"},...continentSources.map(c=>({key:c.key,label:c.label}))];el.continentMenu.innerHTML="";opts.forEach(o=>{const b=document.createElement("button");b.type="button";b.className="picker-option";b.setAttribute("role","option");b.dataset.value=o.key;b.textContent=o.label;b.setAttribute("aria-selected",String(o.key===selectedContinent));b.addEventListener("click",()=>{selectedContinent=o.key;el.continentLabel.textContent=o.label;updateMenu();closeMenu();runSearch()});el.continentMenu.appendChild(b)})}
function updateMenu(){el.continentMenu.querySelectorAll(".picker-option").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.value===selectedContinent)))}
function openMenu(){menuOpen=true;el.continentMenu.hidden=false;el.continentButton.setAttribute("aria-expanded","true")}
function closeMenu(){menuOpen=false;el.continentMenu.hidden=true;el.continentButton.setAttribute("aria-expanded","false")}
function setState(s){el.initialState.classList.toggle("is-hidden",s!=="initial");el.noResultsState.classList.toggle("is-hidden",s!=="empty");el.historyCard.classList.toggle("is-hidden",s!=="active")}
function render(c){el.countryContinent.textContent=c.continent;el.countryName.textContent=c.name;el.countryCapital.textContent=`Capital: ${c.capital}`;el.formationYear.textContent=c.formationYear;el.independenceInfo.textContent=c.independenceInfo;el.historyParagraphs.replaceChildren(...c.historicalOverview.split(/\n{2,}/).map(t=>{const p=document.createElement("p");p.textContent=t.trim();return p}));setState("active");document.title=`${c.name} | WorldLore`}
function runSearch(){const q=normalize(el.searchInput.value);if(!q&&selectedContinent==="all"){setState("initial");document.title="WorldLore";return}const pool=activeDataset();const exact=pool.find(c=>normalize(c.name)===q);const matches=pool.filter(c=>normalize([c.name,c.capital,c.independenceInfo,c.historicalOverview].join(" ")).includes(q));if(exact){render(exact)}else if(matches.length){render(matches[0])}else{const r=selectedContinent==="all"?"all continents":(continentSources.find(c=>c.key===selectedContinent)?.label||"this continent");el.noResultsMessage.textContent=q?`No country matched "${el.searchInput.value.trim()}" in ${r}. Try a broader search.`:`No country is available in ${r}.`;setState("empty");document.title="No Results | WorldLore"}}
function surpriseMe(){const pool=activeDataset();if(!pool.length)return;const c=pool[Math.floor(Math.random()*pool.length)];el.searchInput.value=c.name;render(c)}
el.themeToggle.addEventListener("click",()=>applyTheme((el.html.dataset.theme||"dark")==="dark"?"light":"dark"));el.continentButton.addEventListener("click",()=>menuOpen?closeMenu():openMenu());el.searchInput.addEventListener("input",runSearch);el.surpriseButton.addEventListener("click",surpriseMe);document.addEventListener("click",e=>{if(!el.continentPicker.contains(e.target))closeMenu()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});initTheme();buildMenu();setState("initial");
