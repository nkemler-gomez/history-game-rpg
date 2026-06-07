import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

const ERA_MUSIC = {
  intro: { label:"Intro Theme", bpm:58,
    build() {
      const rev = new Tone.Reverb({ decay:5, wet:0.5 }).toDestination();
      const pad = new Tone.PolySynth(Tone.Synth,{ oscillator:{type:"triangle"}, envelope:{attack:2,decay:1,sustain:0.8,release:3}, volume:-20 }).connect(rev);
      const mel = new Tone.Synth({ oscillator:{type:"sine"}, envelope:{attack:0.02,decay:0.4,sustain:0.2,release:1.2}, volume:-10 }).connect(rev);
      const bass = new Tone.Synth({ oscillator:{type:"triangle"}, envelope:{attack:0.1,decay:0.6,sustain:0.4,release:1.5}, volume:-16 }).toDestination();
      const padPart = new Tone.Part((t,n)=>pad.triggerAttackRelease(n,"2n",t),[[0,["C3","G3","E4"]],["2m",["C3","G3","Eb4"]],["4m",["Ab2","Eb3","G3"]],["6m",["C3","G3","E4"]]]);
      padPart.loop=true; padPart.loopEnd="8m";
      const melPart = new Tone.Part((t,n)=>mel.triggerAttackRelease(n,"8n",t),[[0,"E4"],["0:1","G4"],["0:2","A4"],["0:3","B4"],["1m","C5"],["1m:1","B4"],["1m:2","A4"],["1m:3","G4"],["2m","E4"],["2m:2","G4"],["3m","A4"],["3m:1","B4"],["3m:2","C5"],["3m:3","B4"],["4m","A4"],["4m:2","G4"],["5m","E4"],["5m:1","G4"],["5m:2","A4"],["5m:3","B4"],["6m","C5"],["6m:2","B4"],["6m:3","A4"],["7m","G4"],["7m:2","E4"]]);
      melPart.loop=true; melPart.loopEnd="8m";
      const bassPart = new Tone.Part((t,n)=>bass.triggerAttackRelease(n,"4n",t),[[0,"C2"],["2m","C2"],["4m","Ab2"],["6m","C2"]]);
      bassPart.loop=true; bassPart.loopEnd="8m";
      padPart.start(0); melPart.start(0); bassPart.start(0);
      return { parts:[padPart,melPart,bassPart], nodes:[pad,mel,bass,rev] };
    }
  },
  ancient: { label:"Ancient World", bpm:70,
    build() {
      const rev = new Tone.Reverb({ decay:4, wet:0.5 }).toDestination();
      const mel = new Tone.Synth({ oscillator:{type:"triangle"}, envelope:{attack:0.01,decay:0.35,sustain:0.1,release:0.9}, volume:-8 }).connect(rev);
      const pad = new Tone.PolySynth(Tone.Synth,{ oscillator:{type:"sine"}, envelope:{attack:1.5,decay:1,sustain:0.7,release:2}, volume:-22 }).toDestination();
      const drone = new Tone.Oscillator({frequency:"E2",type:"sine",volume:-30}).toDestination(); drone.start();
      const melPart = new Tone.Part((t,n)=>mel.triggerAttackRelease(n,"16n",t),[[0,"E4"],["0:1","F4"],["0:2","G4"],["0:3","E4"],["1m","A3"],["1m:1","B3"],["1m:2","A3"],["1m:3","G3"],["2m","F3"],["2m:1","E3"],["2m:2","F3"],["2m:3","G3"],["3m","A3"],["3m:1","G3"],["3m:2","E3"],["4m","E4"],["4m:2","D4"],["4m:3","C4"],["5m","B3"],["5m:1","A3"],["5m:2","G3"],["5m:3","F3"],["6m","E3"],["6m:2","G3"],["6m:3","A3"],["7m","B3"],["7m:2","E4"]]);
      melPart.loop=true; melPart.loopEnd="8m";
      const padPart = new Tone.Part((t,n)=>pad.triggerAttackRelease(n,"2n",t),[[0,["E3","B3"]],["2m",["A2","E3"]],["4m",["E3","G3"]],["6m",["E3","B3"]]]);
      padPart.loop=true; padPart.loopEnd="8m";
      melPart.start(0); padPart.start(0);
      return { parts:[melPart,padPart], nodes:[mel,pad,rev,drone] };
    }
  },
  medieval: { label:"Medieval Europe", bpm:64,
    build() {
      const rev = new Tone.Reverb({ decay:5.5, wet:0.65 }).toDestination();
      const organ = new Tone.PolySynth(Tone.Synth,{ oscillator:{type:"square",partialCount:3}, envelope:{attack:0.08,decay:0.2,sustain:0.85,release:0.5}, volume:-18 }).connect(rev);
      const chant = new Tone.Synth({ oscillator:{type:"sine"}, envelope:{attack:0.3,decay:0.5,sustain:0.7,release:0.8}, volume:-10 }).connect(rev);
      const chordPart = new Tone.Part((t,n)=>organ.triggerAttackRelease(n,"2n",t),[[0,["D3","F3","A3"]],["2m",["G2","Bb2","D3"]],["4m",["A2","C3","E3"]],["6m",["D3","F3","A3"]]]);
      chordPart.loop=true; chordPart.loopEnd="8m";
      const melPart = new Tone.Part((t,n)=>chant.triggerAttackRelease(n,"8n",t),[[0,"D4"],["0:2","E4"],["0:3","F4"],["1m","G4"],["1m:2","F4"],["1m:3","E4"],["2m","D4"],["2m:2","C4"],["3m","D4"],["3m:2","E4"],["4m","F4"],["4m:1","G4"],["4m:2","A4"],["4m:3","G4"],["5m","F4"],["5m:2","E4"],["6m","D4"],["6m:2","F4"],["7m","A4"],["7m:2","G4"],["7m:3","F4"]]);
      melPart.loop=true; melPart.loopEnd="8m";
      chordPart.start(0); melPart.start(0);
      return { parts:[chordPart,melPart], nodes:[organ,chant,rev] };
    }
  },
  renaissance: { label:"Renaissance", bpm:82,
    build() {
      const delay = new Tone.FeedbackDelay({delayTime:"8n",feedback:0.18,wet:0.2}).toDestination();
      const lute = new Tone.Synth({ oscillator:{type:"triangle"}, envelope:{attack:0.005,decay:0.22,sustain:0.04,release:0.5}, volume:-7 }).connect(delay);
      const bass = new Tone.Synth({ oscillator:{type:"sine"}, envelope:{attack:0.05,decay:0.3,sustain:0.4,release:0.6}, volume:-13 }).toDestination();
      const melPart = new Tone.Part((t,n)=>lute.triggerAttackRelease(n,"8n",t),[[0,"G4"],["0:1","A4"],["0:2","B4"],["0:3","C5"],["1m","D5"],["1m:1","C5"],["1m:2","B4"],["1m:3","A4"],["2m","G4"],["2m:2","B4"],["3m","C5"],["3m:1","B4"],["3m:2","A4"],["3m:3","G4"],["4m","D4"],["4m:1","E4"],["4m:2","F#4"],["4m:3","G4"],["5m","A4"],["5m:2","G4"],["6m","F#4"],["6m:1","G4"],["6m:2","A4"],["6m:3","B4"],["7m","G4"],["7m:2","D4"]]);
      melPart.loop=true; melPart.loopEnd="8m";
      const bassPart = new Tone.Part((t,n)=>bass.triggerAttackRelease(n,"4n",t),[[0,"G2"],["2m","C3"],["4m","D3"],["5m","G2"],["6m","C3"],["7m","D3"]]);
      bassPart.loop=true; bassPart.loopEnd="8m";
      melPart.start(0); bassPart.start(0);
      return { parts:[melPart,bassPart], nodes:[lute,delay,bass] };
    }
  },
  revolution: { label:"Age of Revolution", bpm:96,
    build() {
      const fife = new Tone.Synth({ oscillator:{type:"square",partialCount:2}, envelope:{attack:0.01,decay:0.08,sustain:0.6,release:0.15}, volume:-9 }).toDestination();
      const drum = new Tone.MembraneSynth({ pitchDecay:0.04,octaves:3, envelope:{attack:0.001,decay:0.22,sustain:0,release:0.1}, volume:-13 }).toDestination();
      const melPart = new Tone.Part((t,n)=>fife.triggerAttackRelease(n,"8n",t),[[0,"C5"],["0:1","C5"],["0:2","G4"],["0:3","G4"],["1m","A4"],["1m:1","A4"],["1m:2","G4"],["2m","F4"],["2m:1","F4"],["2m:2","E4"],["2m:3","E4"],["3m","D4"],["3m:2","C4"],["4m","C5"],["4m:1","D5"],["5m","E5"],["5m:2","C5"],["6m","D5"],["6m:2","B4"],["7m","C5"],["7m:2","G4"]]);
      melPart.loop=true; melPart.loopEnd="8m";
      const drumPart = new Tone.Part((t,n)=>drum.triggerAttackRelease(n,"8n",t),[["1m:2","C1"],["3m:2","C1"],["5m:2","C1"],["7m:2","C1"]]);
      drumPart.loop=true; drumPart.loopEnd="8m";
      melPart.start(0); drumPart.start(0);
      return { parts:[melPart,drumPart], nodes:[fife,drum] };
    }
  },
  industrial: { label:"Industrial Age", bpm:104,
    build() {
      const filt = new Tone.Filter({frequency:1400,type:"lowpass"}).toDestination();
      const lead = new Tone.Synth({ oscillator:{type:"sawtooth",partialCount:3}, envelope:{attack:0.02,decay:0.12,sustain:0.5,release:0.25}, volume:-11 }).connect(filt);
      const piston = new Tone.MetalSynth({ frequency:300, envelope:{attack:0.001,decay:0.07,release:0.04}, harmonicity:3.1,modulationIndex:16,resonance:3000,octaves:0.5, volume:-22 }).toDestination();
      const melPart = new Tone.Part((t,n)=>lead.triggerAttackRelease(n,"16n",t),[[0,"A3"],["0:2","C4"],["0:3","D4"],["1m","E4"],["1m:2","D4"],["1m:3","C4"],["2m","A3"],["2m:2","G3"],["3m","F3"],["3m:1","G3"],["3m:2","A3"],["3m:3","C4"],["4m","E4"],["4m:1","D4"],["4m:2","C4"],["4m:3","A3"],["5m","G3"],["5m:2","A3"],["6m","C4"],["6m:1","E4"],["6m:2","D4"],["6m:3","C4"],["7m","A3"],["7m:2","E3"]]);
      melPart.loop=true; melPart.loopEnd="8m";
      const pistonPart = new Tone.Part((t,n)=>piston.triggerAttackRelease(n,"8n",t),[["0:0","C1"],["0:2","C1"],["1m:0","C1"],["1m:2","C1"],["2m:0","C1"],["2m:2","C1"],["3m:0","C1"],["3m:2","C1"],["4m:0","C1"],["4m:2","C1"],["5m:0","C1"],["5m:2","C1"],["6m:0","C1"],["6m:2","C1"],["7m:0","C1"],["7m:2","C1"]]);
      pistonPart.loop=true; pistonPart.loopEnd="8m";
      melPart.start(0); pistonPart.start(0);
      return { parts:[melPart,pistonPart], nodes:[lead,filt,piston] };
    }
  },
  modern: { label:"Modern Era", bpm:54,
    build() {
      const rev = new Tone.Reverb({decay:7,wet:0.65}).toDestination();
      const filt = new Tone.Filter({frequency:800,type:"lowpass"}).connect(rev);
      const strings = new Tone.PolySynth(Tone.Synth,{ oscillator:{type:"sawtooth",partialCount:2}, envelope:{attack:1.4,decay:0.5,sustain:0.8,release:2.5}, volume:-18 }).connect(filt);
      const piano = new Tone.Synth({ oscillator:{type:"triangle"}, envelope:{attack:0.02,decay:1.4,sustain:0.15,release:2}, volume:-10 }).connect(rev);
      const chordPart = new Tone.Part((t,n)=>strings.triggerAttackRelease(n,"2n",t),[[0,["D3","F3","A3"]],["2m",["C3","Eb3","G3"]],["4m",["Bb2","D3","F3"]],["6m",["A2","C3","E3"]]]);
      chordPart.loop=true; chordPart.loopEnd="8m";
      const pianoPart = new Tone.Part((t,n)=>piano.triggerAttackRelease(n,"4n",t),[[0,"D4"],["1m","C4"],["2m","Bb3"],["3m","A3"],["4m","F3"],["5m","G3"],["6m","A3"],["7m","D4"]]);
      pianoPart.loop=true; pianoPart.loopEnd="8m";
      chordPart.start(0); pianoPart.start(0);
      return { parts:[chordPart,pianoPart], nodes:[strings,piano,filt,rev] };
    }
  },
};

function useMusic() {
  const engineRef = useRef(null);
  const currentKey = useRef(null);
  const mutedRef = useRef(false);
  const volumeRef = useRef(0.65);
  const [playing, setPlaying] = useState(false);
  const [muted, setMutedSt] = useState(false);
  const [volume, setVolumeSt] = useState(0.65);

  function toDb(v) { return v <= 0 ? -Infinity : 20 * Math.log10(v); }

  function destroyEngine() {
    if (!engineRef.current) return;
    try {
      engineRef.current.parts.forEach(p => { try { p.stop(); p.dispose(); } catch(_) {} });
      engineRef.current.nodes.forEach(n => { try { n.dispose(); } catch(_) {} });
    } catch(_) {}
    engineRef.current = null;
    try { Tone.getTransport().stop(); Tone.getTransport().cancel(); } catch(_) {}
    currentKey.current = null;
    setPlaying(false);
  }

  useEffect(() => () => destroyEngine(), []);

  const play = useCallback(async (key) => {
    if (currentKey.current === key && playing) return;
    destroyEngine();
    try {
      await Tone.start();
      const cfg = ERA_MUSIC[key] || ERA_MUSIC.intro;
      Tone.getTransport().bpm.value = cfg.bpm;
      Tone.getDestination().volume.value = mutedRef.current ? -Infinity : toDb(volumeRef.current);
      engineRef.current = cfg.build();
      Tone.getTransport().start();
      currentKey.current = key;
      setPlaying(true);
    } catch(e) { console.warn("Music error:", e); }
  }, [playing]);

  const stop = useCallback(() => destroyEngine(), []);

  const setMuted = useCallback((m) => {
    mutedRef.current = m;
    setMutedSt(m);
    Tone.getDestination().volume.value = m ? -Infinity : toDb(volumeRef.current);
  }, []);

  const setVolume = useCallback((v) => {
    volumeRef.current = v;
    setVolumeSt(v);
    if (!mutedRef.current) Tone.getDestination().volume.value = toDb(v);
  }, []);

  return { playing, muted, volume, play, stop, setMuted, setVolume };
}

function MusicPlayer({ music, trackLabel }) {
  const [showVol, setShowVol] = useState(false);
  const { playing, muted, volume, setMuted, setVolume } = music;
  return (
    <div style={{ position:"fixed", bottom:18, right:18, zIndex:999, display:"flex", alignItems:"center", gap:8, background:"rgba(10,6,2,0.9)", border:"1px solid rgba(184,134,11,0.55)", borderRadius:8, padding:"8px 12px", backdropFilter:"blur(8px)", boxShadow:"0 4px 20px rgba(0,0,0,0.55)" }}>
      <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:16, marginRight:2 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width:3, borderRadius:2, background: muted||!playing ? "rgba(184,134,11,0.25)" : "#e0aa3e", height: playing&&!muted ? "100%" : "30%", animation: playing&&!muted ? `barBounce ${0.55+i*0.13}s ease-in-out ${i*0.08}s infinite alternate` : "none", transition:"height 0.3s" }} />
        ))}
      </div>
      <div style={{ fontSize:"0.6rem", color:"rgba(224,170,62,0.65)", letterSpacing:"1px", fontFamily:"Cinzel,serif", maxWidth:108, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {playing ? trackLabel : "♪ MUSIC"}
      </div>
      <button onClick={() => setMuted(!muted)} style={{ background:"none", border:"none", cursor:"pointer", color: muted ? "rgba(184,134,11,0.35)" : "#e0aa3e", fontSize:"1rem", padding:"0 2px", lineHeight:1 }} title={muted?"Unmute":"Mute"}>
        {muted ? "🔇" : "🔊"}
      </button>
      <button onClick={() => setShowVol(v => !v)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(184,134,11,0.5)", fontSize:"0.75rem", padding:"0 2px", lineHeight:1 }} title="Volume">⚙</button>
      {showVol && (
        <input type="range" min={0} max={1} step={0.02} value={volume} onChange={e => setVolume(Number(e.target.value))}
          style={{ width:70, accentColor:"#e0aa3e", cursor:"pointer" }} />
      )}
    </div>
  );
}

const MUSEUMS = { met:{name:"The Met",short:"MET",color:"#c41230"}, cleveland:{name:"Cleveland Museum of Art",short:"CMA",color:"#0a4c8a"}, chicago:{name:"Art Institute of Chicago",short:"ARTIC",color:"#8a0000"} };
const ERA_QUERIES = {
  ancient:     { met:["ancient roman marble","greek pottery","egyptian pharaoh"],     cleveland:["ancient egypt","greek vase","roman sculpture"],            chicago:["ancient greek","ancient roman","egyptian artifact"] },
  medieval:    { met:["medieval illuminated manuscript","knight armor","crusades"],   cleveland:["medieval armor","illuminated manuscript","gothic"],          chicago:["medieval european","armor knight","gothic panel"] },
  renaissance: { met:["renaissance portrait painting","dutch master","italian renaissance"], cleveland:["renaissance painting","dutch golden age","flemish portrait"], chicago:["renaissance painting","italian old master","northern renaissance"] },
  revolution:  { met:["american revolution","french revolution","napoleon"],          cleveland:["american founding","french revolution","colonial portrait"],  chicago:["american revolution","colonial america","portrait eighteenth century"] },
  industrial:  { met:["industrial revolution factory","victorian england","workers"], cleveland:["industrial workers","victorian painting","nineteenth century labor"], chicago:["american industrial","realism workers","urban nineteenth century"] },
  modern:      { met:["world war soldiers","propaganda poster 1940","trench warfare"],cleveland:["world war","twentieth century soldiers","war painting"],      chicago:["world war","american modernism","twentieth century"] },
};
function withTimeout(p,ms=8000){return Promise.race([p,new Promise((_,r)=>setTimeout(()=>r(new Error("t")),ms))]);}
async function fetchMet(q){try{const s=await withTimeout(fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(q)}&hasImages=true&isPublicDomain=true`).then(r=>r.json()));if(!s.objectIDs?.length)return null;const pool=s.objectIDs.slice(0,60).sort(()=>Math.random()-0.5).slice(0,20);for(const id of pool){const o=await withTimeout(fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(r=>r.json()));if(o.primaryImageSmall&&o.isPublicDomain)return{url:o.primaryImageSmall,title:o.title||"Untitled",artist:o.artistDisplayName||"",date:o.objectDate||"",medium:(o.medium||"").slice(0,70),culture:o.culture||"",museumKey:"met",museumName:MUSEUMS.met.name,objectUrl:o.objectURL||""};}return null;}catch{return null;}}
async function fetchCleveland(q){try{const s=await withTimeout(fetch(`https://openaccess-api.clevelandart.org/api/artworks/?q=${encodeURIComponent(q)}&has_image=1&cc0=1&limit=30`).then(r=>r.json()));const items=(s.data||[]).filter(o=>o.images?.web?.url);if(!items.length)return null;const o=items[Math.floor(Math.random()*items.length)];return{url:o.images.web.url,title:o.title||"Untitled",artist:o.creators?.[0]?.description||"",date:o.creation_date||"",medium:(o.technique||o.medium||"").slice(0,70),culture:o.culture||"",museumKey:"cleveland",museumName:MUSEUMS.cleveland.name,objectUrl:o.url||`https://www.clevelandart.org/art/${o.accession_number}`};}catch{return null;}}
async function fetchChicago(q){try{const s=await withTimeout(fetch(`https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(q)}&fields=id,title,artist_display,date_display,medium_display,place_of_origin,image_id&query[term][is_public_domain]=true&limit=30`).then(r=>r.json()));const items=(s.data||[]).filter(o=>o.image_id);if(!items.length)return null;const o=items[Math.floor(Math.random()*items.length)];return{url:`https://www.artic.edu/iiif/2/${o.image_id}/full/843,/0/default.jpg`,title:o.title||"Untitled",artist:o.artist_display||"",date:o.date_display||"",medium:(o.medium_display||"").slice(0,70),culture:o.place_of_origin||"",museumKey:"chicago",museumName:MUSEUMS.chicago.name,objectUrl:`https://www.artic.edu/artworks/${o.id}`};}catch{return null;}}
async function fetchArtwork(eraId,scenarioQuery){const eq=ERA_QUERIES[eraId]||ERA_QUERIES.ancient;async function race(q){return new Promise(res=>{let n=0;const done=r=>{if(r)res(r);else if(++n===3)res(null);};fetchMet(q).then(done).catch(()=>done(null));fetchCleveland(q).then(done).catch(()=>done(null));fetchChicago(q).then(done).catch(()=>done(null));});}if(scenarioQuery){const r=await race(scenarioQuery);if(r)return r;}const max=Math.max(eq.met.length,eq.cleveland.length,eq.chicago.length);for(let i=0;i<max;i++){const res=await Promise.all([eq.met[i]?fetchMet(eq.met[i]):null,eq.cleveland[i]?fetchCleveland(eq.cleveland[i]):null,eq.chicago[i]?fetchChicago(eq.chicago[i]):null]);const hit=res.find(r=>r);if(hit)return hit;}return null;}

const DB_HAIR=[{id:"long01",label:"Long Wavy"},{id:"long02",label:"Long Straight"},{id:"long03",label:"Long Curly"},{id:"long04",label:"Long Braid"},{id:"long05",label:"Long Swept"},{id:"short01",label:"Short Neat"},{id:"short02",label:"Short Tousled"},{id:"short03",label:"Short Spiky"},{id:"short04",label:"Short Side"},{id:"short05",label:"Short Wavy"},{id:"bun01",label:"Top Bun"},{id:"bun02",label:"Low Bun"}];
const DB_HAIR_COLORS=[{id:"0e0e0e",label:"Black",bg:"#0e0e0e"},{id:"3b1f0a",label:"Dark Brown",bg:"#3b1f0a"},{id:"6c3526",label:"Auburn",bg:"#6c3526"},{id:"a55728",label:"Brown",bg:"#a55728"},{id:"b58143",label:"Golden",bg:"#b58143"},{id:"d6b370",label:"Blonde",bg:"#d6b370"},{id:"c93305",label:"Red",bg:"#c93305"},{id:"9c9c9c",label:"Grey",bg:"#9c9c9c"},{id:"e8e8e8",label:"White",bg:"#e8e8e8",border:true}];
const DB_SKIN_COLORS=[{id:"fddbb4",label:"Fair"},{id:"f1c27d",label:"Light"},{id:"e0ac69",label:"Warm"},{id:"c68642",label:"Medium"},{id:"8d5524",label:"Tan"},{id:"5c3317",label:"Deep"},{id:"3b1f0a",label:"Rich"}];
const DB_EYES=[{id:"variant01",label:"Round"},{id:"variant02",label:"Almond"},{id:"variant03",label:"Wide"},{id:"variant04",label:"Squint"},{id:"variant05",label:"Wink"},{id:"variant06",label:"Closed"}];
const DB_EYEBROWS=[{id:"variant01",label:"Arched"},{id:"variant02",label:"Curved"},{id:"variant03",label:"Flat"},{id:"variant04",label:"Raised"},{id:"variant05",label:"Bushy"}];
const DB_MOUTH=[{id:"variant01",label:"Smile"},{id:"variant02",label:"Grin"},{id:"variant03",label:"Open"},{id:"variant04",label:"Smirk"},{id:"variant05",label:"Frown"},{id:"variant06",label:"Serious"}];
const DB_FEATURES=[{id:"none",label:"None"},{id:"blush",label:"Blush"},{id:"freckles",label:"Freckles"},{id:"birthmark",label:"Birthmark"}];
const DB_GLASSES=[{id:"none",label:"None"},{id:"variant01",label:"Round"},{id:"variant02",label:"Square"},{id:"variant03",label:"Small"},{id:"variant04",label:"Rimless"}];
const DB_BG_COLORS=[{id:"b6e3f4",label:"Sky",bg:"#b6e3f4"},{id:"c0aede",label:"Lavender",bg:"#c0aede"},{id:"ffd5dc",label:"Blush",bg:"#ffd5dc"},{id:"ffdfbf",label:"Peach",bg:"#ffdfbf"},{id:"e8d5b0",label:"Parchment",bg:"#e8d5b0"},{id:"c7e6c7",label:"Sage",bg:"#c7e6c7"},{id:"d1d4f9",label:"Periwinkle",bg:"#d1d4f9"}];
const DEFAULT_CHARACTER={name:"",hair:"short01",hairColor:"3b1f0a",skinColor:"f1c27d",eyes:"variant01",eyebrows:"variant01",mouth:"variant01",features:"none",glasses:"none",bgColor:"e8d5b0"};

function buildAvatarUrl(char,size=200){const p=new URLSearchParams();p.set("seed",char.name||"hero");p.set("size",String(size));p.set("hair",char.hair||"short01");p.set("hairColor",char.hairColor||"3b1f0a");p.set("skinColor",char.skinColor||"f1c27d");p.set("eyes",char.eyes||"variant01");p.set("eyebrows",char.eyebrows||"variant01");p.set("mouth",char.mouth||"variant01");if(char.features&&char.features!=="none"){p.set("features",char.features);p.set("featuresProbability","100");}else{p.set("featuresProbability","0");}if(char.glasses&&char.glasses!=="none"){p.set("glasses",char.glasses);p.set("glassesProbability","100");}else{p.set("glassesProbability","0");}p.set("backgroundColor",char.bgColor||"e8d5b0");p.set("backgroundType","solid");return `https://api.dicebear.com/10.x/adventurer/svg?${p.toString()}`;}
function DiceBearAvatar({character,size=200}){const[svg,setSvg]=useState(null);const[loading,setLoading]=useState(true);const url=buildAvatarUrl(character,size);useEffect(()=>{setLoading(true);setSvg(null);fetch(url).then(r=>r.text()).then(t=>{setSvg(t);setLoading(false);}).catch(()=>setLoading(false));},[url]);return(<div style={{width:size,height:size,borderRadius:8,overflow:"hidden",background:"#e8d5b0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>{loading&&<div style={{width:30,height:30,border:"3px solid rgba(184,134,11,.2)",borderTopColor:"#e0aa3e",borderRadius:"50%",animation:"spin .9s linear infinite"}}/>}{svg&&<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}} dangerouslySetInnerHTML={{__html:svg}}/>}</div>);}

async function callClaude(messages,sys){const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages})});const d=await r.json();return d.content.map(b=>b.text||"").join("");}
async function generateScenario(eraId,role,num){const EN={ancient:"Ancient World",medieval:"Medieval Europe",renaissance:"Renaissance",revolution:"Age of Revolution",industrial:"Industrial Age",modern:"Modern Era"};const raw=await callClaude([{role:"user",content:`Generate a rich historical scenario for a student playing as a "${role}" in the "${EN[eraId]||eraId}" era (question ${num}/5). Require critical thinking, empathy, problem solving.\n\nReturn EXACTLY this JSON (no markdown):\n{\n  "setting": "2-sentence vivid scene",\n  "situation": "3-sentence dilemma",\n  "artSearchQuery": "3-5 word museum search term",\n  "thinkDeeperPrompt": "One open-ended philosophical/ethical question",\n  "choices": [{"text":"...","quality":"best"},{"text":"...","quality":"good"},{"text":"...","quality":"poor"},{"text":"...","quality":"worst"}],\n  "correctIndex": 0,\n  "feedbackCorrect": "2 sentences why this was wise",\n  "feedbackWrong": "2 sentences what this leads to",\n  "historicalFact": "One surprising real fact"\n}\nShuffle quality so correctIndex varies.`}],"You are a creative history education game master. Respond ONLY with valid JSON.");try{return JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g,"").trim());}catch{return null;}}
async function evaluateFreeResponse(response,scenario,role){const raw=await callClaude([{role:"user",content:`Student playing as "${role}" answered: "${scenario.thinkDeeperPrompt}"\nAnswer: "${response}"\nReturn EXACTLY: {"critical":7,"creative":6,"feedback":"2 encouraging sentences"}`}],"You are a history teacher. Respond ONLY with valid JSON.");try{return JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g,"").trim());}catch{return{critical:7,creative:7,feedback:"Thoughtful response! Consider how different perspectives shaped this moment in history."};}}

const STYLE=`
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&display=swap');
  :root{--ink:#1a1208;--parch:#f5ead6;--gold:#b8860b;--gold2:#e0aa3e;--red:#8b1a1a;--teal:#2a6b6b;--met:#c41230;--cma:#0a4c8a;--artic:#8a0000;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Crimson Pro',Georgia,serif;background:var(--ink);color:var(--ink);min-height:100vh;}
  .game-wrap{min-height:100vh;background:radial-gradient(ellipse at 20% 10%,rgba(184,134,11,.12) 0%,transparent 55%),radial-gradient(ellipse at 80% 90%,rgba(42,107,107,.10) 0%,transparent 55%),linear-gradient(160deg,#1a1208 0%,#0f0a04 100%);display:flex;flex-direction:column;align-items:center;padding:0 12px 90px;}
  .game-header{width:100%;max-width:900px;text-align:center;padding:36px 0 20px;border-bottom:1px solid rgba(184,134,11,.3);margin-bottom:28px;}
  .game-title{font-family:'Cinzel',serif;font-weight:900;font-size:clamp(1.8rem,5vw,3rem);color:var(--gold2);text-shadow:0 2px 18px rgba(224,170,62,.35);letter-spacing:3px;}
  .game-subtitle{font-size:1rem;color:rgba(224,170,62,.6);letter-spacing:2px;font-style:italic;margin-top:4px;}
  .museum-sources{display:flex;gap:10px;align-items:center;justify-content:center;margin-top:10px;flex-wrap:wrap;}
  .src-chip{font-family:'Cinzel',serif;font-size:.62rem;letter-spacing:1.5px;padding:3px 10px;border-radius:3px;font-weight:700;border:1px solid currentColor;opacity:.75;}
  .src-chip.met{color:var(--met);}.src-chip.cma{color:var(--cma);}.src-chip.artic{color:var(--artic);}
  .src-label{font-size:.7rem;color:rgba(224,170,62,.45);font-style:italic;letter-spacing:1px;}
  .stat-bar{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:24px;}
  .stat-pill{background:rgba(245,234,214,.07);border:1px solid rgba(184,134,11,.35);border-radius:99px;padding:5px 16px;font-family:'Cinzel',serif;font-size:.78rem;color:var(--gold2);letter-spacing:1px;display:flex;align-items:center;gap:7px;}
  .stat-pill span{color:#fff;font-weight:600;}
  .scroll{background:linear-gradient(180deg,#f5ead6 0%,#ede0c4 100%);border:2.5px solid var(--gold);border-radius:6px;box-shadow:0 0 0 1px rgba(184,134,11,.2),0 8px 48px rgba(0,0,0,.55),inset 0 0 60px rgba(184,134,11,.06);padding:32px 36px;width:100%;max-width:900px;position:relative;}
  .scroll::before,.scroll::after{content:'';position:absolute;left:18px;right:18px;height:6px;background:linear-gradient(90deg,transparent,rgba(184,134,11,.25),transparent);border-radius:3px;}
  .scroll::before{top:10px;}.scroll::after{bottom:10px;}
  .museum-panel{width:100%;border-radius:6px;overflow:hidden;margin-bottom:22px;border:1.5px solid rgba(184,134,11,.35);background:#1a1208;position:relative;}
  .museum-img-wrap{width:100%;overflow:hidden;display:flex;align-items:center;justify-content:center;}
  .museum-img-wrap img{width:100%;height:100%;object-fit:cover;transition:opacity .5s;filter:sepia(15%) contrast(1.04);}
  .museum-img-wrap img.img-hidden{opacity:0;}.museum-img-wrap img.img-shown{opacity:1;}
  .museum-img-placeholder{width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1208,#0f0a04);color:rgba(224,170,62,.3);font-family:'Cinzel',serif;font-size:.78rem;letter-spacing:2px;gap:12px;}
  .ph-icon{font-size:2.5rem;}
  .museum-caption{background:rgba(245,234,214,.95);border-top:2px solid var(--gold);padding:9px 16px;display:flex;flex-wrap:wrap;gap:3px 16px;}
  .museum-caption-title{font-family:'Cinzel',serif;font-size:.78rem;font-weight:600;color:var(--ink);flex:1 1 100%;}
  .museum-caption-meta{font-size:.73rem;color:rgba(26,18,8,.5);font-style:italic;}
  .museum-caption-link{font-family:'Cinzel',serif;font-size:.67rem;color:var(--teal);text-decoration:none;}
  .museum-caption-link:hover{text-decoration:underline;}
  .museum-src-badge{position:absolute;top:10px;left:10px;font-family:'Cinzel',serif;font-size:.62rem;letter-spacing:1.5px;padding:3px 9px;border-radius:3px;font-weight:700;color:#fff;}
  .museum-src-badge.met{background:var(--met);}.museum-src-badge.cma{background:var(--cma);}.museum-src-badge.artic{background:var(--artic);}
  .museum-loading-bar{width:100%;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold2),var(--gold));background-size:200% 100%;animation:shimmer 1.4s infinite;}
  .era-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-top:8px;}
  .era-card{border:1.5px solid rgba(184,134,11,.4);border-radius:6px;cursor:pointer;transition:all .2s;overflow:hidden;position:relative;}
  .era-card:hover,.era-card.active{border-color:var(--gold);transform:translateY(-3px);box-shadow:0 6px 24px rgba(184,134,11,.25);}
  .era-card.active{box-shadow:0 0 0 2px var(--gold2),0 6px 24px rgba(184,134,11,.35);}
  .era-thumb{width:100%;height:110px;object-fit:cover;display:block;filter:sepia(25%) contrast(1.05);transition:filter .3s;}
  .era-card:hover .era-thumb,.era-card.active .era-thumb{filter:sepia(8%) contrast(1.1);}
  .era-thumb-placeholder{width:100%;height:110px;background:linear-gradient(135deg,#1a1208,#2a1a08);display:flex;align-items:center;justify-content:center;font-size:2rem;}
  .era-info{padding:10px 12px;background:rgba(245,234,214,.96);}
  .era-name{font-family:'Cinzel',serif;font-size:.8rem;font-weight:600;color:var(--ink);letter-spacing:1px;}
  .era-years{font-size:.75rem;color:rgba(26,18,8,.5);font-style:italic;}
  .era-src-dot{position:absolute;top:6px;left:6px;font-family:'Cinzel',serif;font-size:.55rem;letter-spacing:1px;padding:2px 6px;border-radius:2px;font-weight:700;color:#fff;opacity:.85;}
  .era-src-dot.met{background:var(--met);}.era-src-dot.cma{background:var(--cma);}.era-src-dot.artic{background:var(--artic);}
  .era-check{position:absolute;top:8px;right:8px;background:var(--gold2);color:var(--ink);border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;}
  .customizer{background:rgba(26,18,8,.04);border:1.5px solid rgba(184,134,11,.3);border-radius:8px;padding:22px 20px;margin-top:20px;}
  .custom-layout{display:grid;grid-template-columns:220px 1fr;gap:28px;align-items:start;}
  @media(max-width:600px){.custom-layout{grid-template-columns:1fr;}.avatar-col{align-items:center;}}
  .avatar-col{display:flex;flex-direction:column;align-items:center;gap:12px;}
  .avatar-frame{border:2.5px solid var(--gold);border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.3);}
  .char-name-input{font-family:'Cinzel',serif;font-size:.9rem;letter-spacing:1.5px;text-align:center;width:100%;border:1.5px solid rgba(184,134,11,.45);border-radius:6px;background:rgba(245,234,214,.9);color:var(--ink);padding:9px 12px;outline:none;}
  .char-name-input:focus{border-color:var(--gold);}.char-name-input::placeholder{color:rgba(26,18,8,.4);font-style:italic;}
  .dicebear-credit{font-size:.62rem;color:rgba(26,18,8,.4);text-align:center;font-style:italic;line-height:1.5;}
  .dicebear-credit a{color:var(--teal);text-decoration:none;}.dicebear-credit a:hover{text-decoration:underline;}
  .custom-sections{display:flex;flex-direction:column;gap:14px;}
  .cs-label{font-family:'Cinzel',serif;font-size:.68rem;color:var(--gold);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;}
  .swatch-row{display:flex;flex-wrap:wrap;gap:7px;}
  .swatch{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2.5px solid transparent;transition:all .15s;flex-shrink:0;}
  .swatch:hover{transform:scale(1.2);}.swatch.sel{border-color:#1a1208;box-shadow:0 0 0 2.5px var(--gold2);}
  .chip-row{display:flex;flex-wrap:wrap;gap:5px;}
  .chip{font-family:'Cinzel',serif;font-size:.65rem;letter-spacing:.8px;padding:4px 9px;border-radius:4px;cursor:pointer;border:1.5px solid rgba(184,134,11,.3);color:rgba(26,18,8,.65);background:rgba(245,234,214,.6);transition:all .15s;white-space:nowrap;}
  .chip:hover{border-color:var(--gold);}.chip.sel{background:var(--gold);border-color:var(--gold);color:var(--ink);font-weight:700;}
  .char-sheet{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:start;margin-bottom:22px;}
  @media(max-width:560px){.char-sheet{grid-template-columns:1fr;}}
  .char-info{display:flex;flex-direction:column;gap:10px;}
  .char-name-display{font-family:'Cinzel',serif;font-size:1.4rem;font-weight:900;color:var(--gold2);letter-spacing:2px;border-bottom:2px solid rgba(184,134,11,.3);padding-bottom:8px;margin-bottom:4px;}
  .char-stat-row{display:flex;align-items:center;gap:10px;border-bottom:1px dotted rgba(184,134,11,.25);padding-bottom:8px;}
  .cs-stat-label{font-family:'Cinzel',serif;font-size:.68rem;color:var(--gold);letter-spacing:1.5px;min-width:86px;}
  .cs-stat-val{font-size:.95rem;color:#2a1f0e;}
  .xp-bar{height:8px;background:rgba(26,18,8,.1);border-radius:99px;overflow:hidden;flex:1;}
  .xp-fill{height:100%;border-radius:99px;transition:width .6s;}
  .section-heading{font-family:'Cinzel',serif;font-size:1rem;font-weight:600;color:var(--red);letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
  .section-heading::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(139,26,26,.4),transparent);}
  .scenario-text{font-size:1.08rem;line-height:1.75;color:#2a1f0e;margin-bottom:22px;font-style:italic;border-left:3px solid rgba(184,134,11,.4);padding-left:18px;}
  .role-badge{display:inline-flex;align-items:center;gap:8px;background:var(--red);color:#f5ead6;border-radius:4px;padding:4px 14px;font-family:'Cinzel',serif;font-size:.8rem;letter-spacing:1.5px;margin-bottom:18px;}
  .choices-list{display:flex;flex-direction:column;gap:10px;margin-bottom:22px;}
  .choice-btn{background:rgba(26,18,8,.04);border:1.5px solid rgba(184,134,11,.35);border-radius:6px;padding:13px 18px;text-align:left;cursor:pointer;font-family:'Crimson Pro',serif;font-size:1rem;color:var(--ink);transition:all .18s;line-height:1.5;display:flex;gap:12px;align-items:flex-start;}
  .choice-btn:hover:not(:disabled){background:rgba(184,134,11,.12);border-color:var(--gold);transform:translateX(4px);}
  .choice-btn:disabled{opacity:.5;cursor:default;}
  .choice-btn.good{background:rgba(42,107,107,.15);border-color:var(--teal);}
  .choice-btn.bad{background:rgba(139,26,26,.1);border-color:var(--red);}
  .choice-letter{font-family:'Cinzel',serif;font-size:.78rem;font-weight:600;color:var(--gold);min-width:22px;padding-top:2px;}
  .feedback-box{background:rgba(42,107,107,.08);border:1.5px solid rgba(42,107,107,.35);border-radius:6px;padding:18px 20px;margin-bottom:18px;animation:fadeIn .4s;}
  .feedback-box.wrong{background:rgba(139,26,26,.07);border-color:rgba(139,26,26,.35);}
  .feedback-title{font-family:'Cinzel',serif;font-size:.85rem;font-weight:600;letter-spacing:1.5px;color:var(--teal);margin-bottom:8px;}
  .feedback-box.wrong .feedback-title{color:var(--red);}
  .feedback-text{font-size:.98rem;line-height:1.65;color:#2a1f0e;}
  .think-deeper{background:rgba(184,134,11,.07);border:1px dashed rgba(184,134,11,.45);border-radius:6px;padding:14px 18px;margin-bottom:18px;}
  .think-label{font-family:'Cinzel',serif;font-size:.75rem;color:var(--gold);letter-spacing:2px;margin-bottom:6px;}
  .think-text{font-size:.95rem;font-style:italic;color:#3a2a12;line-height:1.6;}
  .btn{font-family:'Cinzel',serif;font-size:.85rem;font-weight:600;letter-spacing:1.5px;border:none;border-radius:4px;padding:11px 24px;cursor:pointer;transition:all .18s;}
  .btn-gold{background:linear-gradient(135deg,#b8860b,#e0aa3e);color:var(--ink);box-shadow:0 2px 12px rgba(184,134,11,.35);}
  .btn-gold:hover{transform:translateY(-1px);box-shadow:0 4px 18px rgba(184,134,11,.5);}
  .btn-ghost{background:transparent;border:1.5px solid rgba(184,134,11,.4);color:var(--gold2);}
  .btn-ghost:hover{border-color:var(--gold2);background:rgba(224,170,62,.08);}
  .btn:disabled{opacity:.45;cursor:default;transform:none!important;}
  .loading-wrap{text-align:center;padding:32px 0;}
  .spinner{width:38px;height:38px;border:3px solid rgba(184,134,11,.2);border-top-color:var(--gold2);border-radius:50%;animation:spin .9s linear infinite;margin:0 auto 14px;}
  .loading-text{font-family:'Cinzel',serif;font-size:.8rem;color:var(--gold2);letter-spacing:2px;}
  .journal-entry{border-bottom:1px solid rgba(184,134,11,.2);padding:14px 0;font-size:.95rem;line-height:1.6;color:#2a1f0e;}
  .journal-entry:last-child{border-bottom:none;}
  .journal-meta{font-family:'Cinzel',serif;font-size:.72rem;color:var(--gold);letter-spacing:1.5px;margin-bottom:6px;}
  .journal-thumb-wrap{position:relative;margin-bottom:8px;}
  .journal-thumb{width:100%;height:150px;object-fit:cover;border-radius:4px;filter:sepia(18%);border:1px solid rgba(184,134,11,.3);display:block;}
  .journal-thumb-badge{position:absolute;top:6px;left:6px;font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:1px;padding:2px 7px;border-radius:2px;font-weight:700;color:#fff;}
  .journal-thumb-badge.met{background:var(--met);}.journal-thumb-badge.cma{background:var(--cma);}.journal-thumb-badge.artic{background:var(--artic);}
  .free-input{width:100%;border:1.5px solid rgba(184,134,11,.4);border-radius:6px;background:rgba(26,18,8,.04);font-family:'Crimson Pro',serif;font-size:1rem;color:var(--ink);padding:12px 16px;resize:vertical;min-height:90px;transition:border-color .18s;outline:none;margin-bottom:12px;}
  .free-input:focus{border-color:var(--gold);}
  .tabs{display:flex;gap:4px;margin-bottom:22px;border-bottom:1.5px solid rgba(184,134,11,.25);}
  .tab-btn{font-family:'Cinzel',serif;font-size:.75rem;letter-spacing:1.5px;padding:8px 18px;border:none;background:transparent;color:rgba(224,170,62,.5);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1.5px;transition:all .15s;}
  .tab-btn.active{color:var(--gold2);border-bottom-color:var(--gold2);}
  .tab-btn:hover:not(.active){color:var(--gold2);}
  .progress-track{width:100%;height:6px;background:rgba(26,18,8,.12);border-radius:99px;margin:10px 0 22px;overflow:hidden;}
  .progress-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--gold),var(--gold2));transition:width .4s;}
  .score-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:18px;}
  .score-card{background:rgba(26,18,8,.05);border:1px solid rgba(184,134,11,.25);border-radius:6px;padding:14px 12px;text-align:center;}
  .score-value{font-family:'Cinzel',serif;font-size:1.6rem;font-weight:900;color:var(--gold2);}
  .score-label{font-size:.78rem;color:rgba(26,18,8,.55);letter-spacing:1px;}
  .ornament{text-align:center;color:rgba(184,134,11,.35);font-size:1.3rem;margin:10px 0;letter-spacing:8px;}
  .art-strip{display:flex;gap:10px;margin:14px 0 6px;overflow-x:auto;padding-bottom:4px;}
  .art-strip-item{flex:0 0 150px;border-radius:5px;overflow:hidden;border:1px solid rgba(184,134,11,.3);position:relative;}
  .art-strip-item img{width:150px;height:105px;object-fit:cover;display:block;filter:sepia(18%);}
  .art-strip-badge{position:absolute;top:5px;left:5px;font-family:'Cinzel',serif;font-size:.55rem;letter-spacing:1px;padding:2px 6px;border-radius:2px;font-weight:700;color:#fff;}
  .art-strip-badge.met{background:var(--met);}.art-strip-badge.cma{background:var(--cma);}.art-strip-badge.artic{background:var(--artic);}
  .art-strip-caption{padding:5px 7px;background:rgba(245,234,214,.97);font-size:.63rem;color:rgba(26,18,8,.6);font-style:italic;line-height:1.35;}
  .legend-row{display:flex;gap:14px;flex-wrap:wrap;margin:10px 0;}
  .legend-item{display:flex;align-items:center;gap:6px;font-size:.75rem;color:rgba(26,18,8,.6);font-style:italic;}
  .legend-dot{width:10px;height:10px;border-radius:2px;flex-shrink:0;}
  .legend-dot.met{background:var(--met);}.legend-dot.cma{background:var(--cma);}.legend-dot.artic{background:var(--artic);}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  @keyframes barBounce{from{transform:scaleY(0.25)}to{transform:scaleY(1)}}
`;

const ERAS=[{id:"ancient",name:"Ancient World",years:"3000 BCE – 500 CE",icon:"🏛️",artQuery:"ancient roman marble forum"},{id:"medieval",name:"Medieval Europe",years:"500 – 1400 CE",icon:"⚔️",artQuery:"medieval illuminated manuscript knights"},{id:"renaissance",name:"Renaissance",years:"1400 – 1600 CE",icon:"🎨",artQuery:"renaissance portrait painting italian"},{id:"revolution",name:"Age of Revolution",years:"1750 – 1850 CE",icon:"🔥",artQuery:"american revolution colonial portrait"},{id:"industrial",name:"Industrial Age",years:"1800 – 1900 CE",icon:"⚙️",artQuery:"victorian industrial workers painting"},{id:"modern",name:"Modern Era",years:"1900 – 1945 CE",icon:"🌍",artQuery:"world war soldiers painting"}];
const ROLES={ancient:["Roman Senator","Egyptian Scribe","Greek Philosopher"],medieval:["Knight","Merchant","Abbess"],renaissance:["Court Advisor","Artist's Apprentice","Diplomat"],revolution:["Colonial Leader","Revolutionary","Loyalist Journalist"],industrial:["Factory Owner","Labor Organizer","Inventor"],modern:["Field Commander","War Correspondent","Resistance Spy"]};
const CHOICE_LETTERS=["A","B","C","D"];

function MuseumImage({artwork,loading:al,height=260}){const[shown,setShown]=useState(false);useEffect(()=>{setShown(false);},[artwork?.url]);if(al)return(<div className="museum-panel"><div style={{height}}><div className="museum-loading-bar"/><div className="museum-img-placeholder" style={{height:height-3}}><div className="ph-icon">🖼️</div><div>SEARCHING MUSEUM ARCHIVES…</div></div></div></div>);if(!artwork)return(<div className="museum-panel"><div className="museum-img-placeholder" style={{height}}><div className="ph-icon">🏛️</div><div>NO ARTWORK FOUND</div></div></div>);const mk=artwork.museumKey||"met";return(<div className="museum-panel"><div className={`museum-src-badge ${mk}`}>{MUSEUMS[mk]?.short}</div><div className="museum-img-wrap" style={{height}}><img src={artwork.url} alt={artwork.title} className={shown?"img-shown":"img-hidden"} onLoad={()=>setShown(true)} onError={()=>setShown(true)}/>{!shown&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#1a1208",color:"rgba(224,170,62,.35)",fontFamily:"Cinzel,serif",fontSize:".75rem",letterSpacing:"2px",gap:10}}><div style={{fontSize:"2rem"}}>🖼️</div><div>LOADING…</div></div>}</div><div className="museum-caption"><div className="museum-caption-title">{artwork.title}</div><span className="museum-caption-meta">{[artwork.artist,artwork.date,artwork.culture].filter(Boolean).join(" · ")}</span>{artwork.medium&&<span className="museum-caption-meta">{artwork.medium}</span>}<span className="museum-caption-meta" style={{fontStyle:"normal",fontWeight:600,color:mk==="met"?"var(--met)":mk==="cleveland"?"var(--cma)":"var(--artic)"}}>{artwork.museumName}</span>{artwork.objectUrl&&<a className="museum-caption-link" href={artwork.objectUrl} target="_blank" rel="noopener noreferrer">VIEW IN COLLECTION ↗</a>}</div></div>);}

export default function HistoryRPG(){
  const[screen,setScreen]=useState("home");
  const[era,setEra]=useState(null);
  const[role,setRole]=useState(null);
  const[character,setCharacter]=useState(DEFAULT_CHARACTER);
  const[tab,setTab]=useState("scenario");
  const[scenario,setScenario]=useState(null);
  const[loading,setLoading]=useState(false);
  const[selected,setSelected]=useState(null);
  const[showFeedback,setShowFeedback]=useState(false);
  const[freeAnswer,setFreeAnswer]=useState("");
  const[freeEval,setFreeEval]=useState(null);
  const[evalLoading,setEvalLoading]=useState(false);
  const[questionNum,setQuestionNum]=useState(1);
  const[journal,setJournal]=useState([]);
  const[score,setScore]=useState({correct:0,critical:0,creative:0,total:0});
  const[eraArtworks,setEraArtworks]=useState({});
  const[scenarioArtwork,setScenarioArtwork]=useState(null);
  const[artLoading,setArtLoading]=useState(false);
  const music=useMusic();
  const upd=(k,v)=>setCharacter(p=>({...p,[k]:v}));

  useEffect(()=>{ERAS.forEach(async e=>{const art=await fetchArtwork(e.id,e.artQuery);if(art)setEraArtworks(p=>({...p,[e.id]:art}));});},[]);

  useEffect(()=>{
    if(screen==="home"||screen==="summary") music.play("intro");
    else if(screen==="game"&&era) music.play(era.id);
  },[screen,era?.id]);

  async function startGame(){if(!era||!role||!character.name.trim())return;setScreen("game");setQuestionNum(1);setJournal([]);setScore({correct:0,critical:0,creative:0,total:0});await loadScenario(1);}
  async function loadScenario(num){setLoading(true);setScenario(null);setSelected(null);setShowFeedback(false);setFreeAnswer("");setFreeEval(null);setScenarioArtwork(null);setArtLoading(true);const s=await generateScenario(era.id,role,num);setScenario(s);setLoading(false);const art=await fetchArtwork(era.id,s?.artSearchQuery);setScenarioArtwork(art);setArtLoading(false);}
  function handleChoice(idx){if(selected!==null)return;setSelected(idx);setShowFeedback(true);setScore(p=>({...p,correct:p.correct+(idx===scenario.correctIndex?1:0),total:p.total+1}));}
  async function handleEvalFree(){if(!freeAnswer.trim()||evalLoading)return;setEvalLoading(true);const ev=await evaluateFreeResponse(freeAnswer,scenario,role);setFreeEval(ev);setScore(p=>({...p,critical:p.critical+(ev.critical||0),creative:p.creative+(ev.creative||0)}));setJournal(p=>[...p,{question:questionNum,setting:scenario.setting,answer:freeAnswer,feedback:ev.feedback,role,eraName:era.name,artwork:scenarioArtwork}]);setEvalLoading(false);}
  async function nextQuestion(){const next=questionNum+1;if(next>5){setScreen("summary");return;}setQuestionNum(next);await loadScenario(next);}

  const trackLabel=screen==="game"&&era?(ERA_MUSIC[era.id]?.label||era.name):"Intro Theme";

  function renderCustomizer(){return(<div className="customizer"><h2 className="section-heading">Forge Your Character</h2><div className="custom-layout"><div className="avatar-col"><div className="avatar-frame"><DiceBearAvatar character={character} size={200}/></div><input className="char-name-input" placeholder="Enter your name…" maxLength={22} value={character.name} onChange={e=>upd("name",e.target.value)}/><div className="dicebear-credit">Avatar · <a href="https://www.dicebear.com/styles/adventurer/" target="_blank" rel="noopener noreferrer">DiceBear Adventurer</a><br/>Art by Lisa Wischofsky · CC BY 4.0</div></div><div className="custom-sections"><div><div className="cs-label">Skin Tone</div><div className="swatch-row">{DB_SKIN_COLORS.map(s=><div key={s.id} className={`swatch ${character.skinColor===s.id?"sel":""}`} style={{background:`#${s.id}`}} title={s.label} onClick={()=>upd("skinColor",s.id)}/>)}</div></div><div><div className="cs-label">Hair Style</div><div className="chip-row">{DB_HAIR.map(h=><div key={h.id} className={`chip ${character.hair===h.id?"sel":""}`} onClick={()=>upd("hair",h.id)}>{h.label}</div>)}</div></div><div><div className="cs-label">Hair Color</div><div className="swatch-row">{DB_HAIR_COLORS.map(h=><div key={h.id} className={`swatch ${character.hairColor===h.id?"sel":""}`} style={{background:h.bg,border:h.border?"2.5px solid rgba(184,134,11,.5)":undefined}} title={h.label} onClick={()=>upd("hairColor",h.id)}/>)}</div></div><div><div className="cs-label">Eyes</div><div className="chip-row">{DB_EYES.map(e=><div key={e.id} className={`chip ${character.eyes===e.id?"sel":""}`} onClick={()=>upd("eyes",e.id)}>{e.label}</div>)}</div></div><div><div className="cs-label">Eyebrows</div><div className="chip-row">{DB_EYEBROWS.map(e=><div key={e.id} className={`chip ${character.eyebrows===e.id?"sel":""}`} onClick={()=>upd("eyebrows",e.id)}>{e.label}</div>)}</div></div><div><div className="cs-label">Mouth</div><div className="chip-row">{DB_MOUTH.map(m=><div key={m.id} className={`chip ${character.mouth===m.id?"sel":""}`} onClick={()=>upd("mouth",m.id)}>{m.label}</div>)}</div></div><div><div className="cs-label">Face Features</div><div className="chip-row">{DB_FEATURES.map(f=><div key={f.id} className={`chip ${character.features===f.id?"sel":""}`} onClick={()=>upd("features",f.id)}>{f.label}</div>)}</div></div><div><div className="cs-label">Glasses</div><div className="chip-row">{DB_GLASSES.map(g=><div key={g.id} className={`chip ${character.glasses===g.id?"sel":""}`} onClick={()=>upd("glasses",g.id)}>{g.label}</div>)}</div></div><div><div className="cs-label">Background</div><div className="swatch-row">{DB_BG_COLORS.map(b=><div key={b.id} className={`swatch ${character.bgColor===b.id?"sel":""}`} style={{background:b.bg,borderRadius:4}} title={b.label} onClick={()=>upd("bgColor",b.id)}/>)}</div></div></div></div></div>);}

  function renderHome(){return(<div className="scroll"><div className="ornament">✦ ✦ ✦</div><div style={{marginBottom:20,padding:"12px 16px",background:"rgba(26,18,8,.04)",border:"1px solid rgba(184,134,11,.2)",borderRadius:6}}><div style={{fontFamily:"Cinzel,serif",fontSize:".72rem",letterSpacing:"2px",color:"rgba(26,18,8,.5)",marginBottom:8}}>ARTWORK SOURCED FROM</div><div className="legend-row"><div className="legend-item"><div className="legend-dot met"/>The Metropolitan Museum of Art</div><div className="legend-item"><div className="legend-dot cma"/>Cleveland Museum of Art</div><div className="legend-item"><div className="legend-dot artic"/>Art Institute of Chicago</div></div><div style={{fontSize:".7rem",color:"rgba(26,18,8,.4)",fontStyle:"italic",marginTop:4}}>All works public domain / CC0 open access</div></div><h2 className="section-heading">Choose Your Era</h2><div className="era-grid">{ERAS.map(e=>{const thumb=eraArtworks[e.id];const mk=thumb?.museumKey;return(<div key={e.id} className={`era-card ${era?.id===e.id?"active":""}`} onClick={()=>{setEra(e);setRole(null);}}>{thumb?<><img className="era-thumb" src={thumb.url} alt={thumb.title}/>{mk&&<div className={`era-src-dot ${mk}`}>{MUSEUMS[mk]?.short}</div>}</>:<div className="era-thumb-placeholder">{e.icon}</div>}{era?.id===e.id&&<div className="era-check">✓</div>}<div className="era-info"><div className="era-name">{e.name}</div><div className="era-years">{e.years}</div></div></div>);})}</div>{era&&(<><div style={{marginTop:22}}>{eraArtworks[era.id]&&<><h2 className="section-heading">From the Archives</h2><MuseumImage artwork={eraArtworks[era.id]} loading={false} height={200}/></>}</div><h2 className="section-heading" style={{marginTop:20}}>Choose Your Role</h2><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:8}}>{ROLES[era.id].map(r=><button key={r} className={`choice-btn ${role===r?"good":""}`} style={{flex:"1 1 160px"}} onClick={()=>setRole(r)}><span className="choice-letter">▶</span>{r}</button>)}</div>{renderCustomizer()}</>)}<div style={{marginTop:28,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>{era&&role&&!character.name.trim()&&<p style={{fontFamily:"Cinzel,serif",fontSize:".75rem",color:"var(--red)",letterSpacing:"1px"}}>↑ Enter your character's name to begin</p>}<button className="btn btn-gold" disabled={!era||!role||!character.name.trim()} onClick={startGame}>BEGIN YOUR CHRONICLE</button></div><div className="ornament" style={{marginTop:18}}>✦ ✦ ✦</div></div>);}
  function renderGame(){return(<div className="scroll"><div className="tabs">{["scenario","journal","character"].map(t=><button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t.toUpperCase()}</button>)}</div>{tab==="scenario"&&renderScenarioTab()}{tab==="journal"&&renderJournalTab()}{tab==="character"&&renderCharacterTab()}</div>);}
  function renderScenarioTab(){if(loading)return<div className="loading-wrap"><div className="spinner"/><div className="loading-text">THE CHRONICLE UNFOLDS…</div></div>;if(!scenario)return null;const isCorrect=selected===scenario.correctIndex;return(<><div style={{display:"flex",justifyContent:"space-between",fontSize:".8rem",color:"var(--gold)",fontFamily:"Cinzel,serif",letterSpacing:"1px"}}><span>CHAPTER {questionNum} OF 5</span><span>{era?.name} · {character.name||role}</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${((questionNum-1)/5)*100}%`}}/></div><h2 className="section-heading">From the Archives</h2><MuseumImage artwork={scenarioArtwork} loading={artLoading} height={240}/><div className="role-badge">⚔ {character.name||role} · {role}</div><h2 className="section-heading">The Scene</h2><p className="scenario-text">{scenario.setting}</p><h2 className="section-heading">Your Dilemma</h2><p className="scenario-text">{scenario.situation}</p><h2 className="section-heading">Your Decision</h2><div className="choices-list">{scenario.choices.map((c,i)=><button key={i} className={`choice-btn ${selected===i?(i===scenario.correctIndex?"good":"bad"):""}`} disabled={selected!==null} onClick={()=>handleChoice(i)}><span className="choice-letter">{CHOICE_LETTERS[i]}</span>{c.text}</button>)}</div>{showFeedback&&(<div className={`feedback-box ${isCorrect?"":"wrong"}`}><div className="feedback-title">{isCorrect?"✦ WISE COUNSEL":"✦ A LESSON IN HISTORY"}</div><p className="feedback-text">{isCorrect?scenario.feedbackCorrect:scenario.feedbackWrong}</p>{!isCorrect&&<p className="feedback-text" style={{marginTop:8,fontStyle:"italic"}}><strong>What would have worked: </strong>{scenario.choices[scenario.correctIndex].text}. {scenario.feedbackCorrect}</p>}<div style={{marginTop:12,padding:"8px 12px",background:"rgba(184,134,11,.08)",borderRadius:4,fontSize:".9rem",fontStyle:"italic",color:"#3a2a12"}}>📜 <strong>Did you know?</strong> {scenario.historicalFact}</div></div>)}{showFeedback&&(<><div className="think-deeper"><div className="think-label">✦ THINK DEEPER</div><p className="think-text">{scenario.thinkDeeperPrompt}</p></div><textarea className="free-input" placeholder="Write your reflection here — there are no wrong answers…" value={freeAnswer} onChange={e=>setFreeAnswer(e.target.value)}/>{!freeEval&&<button className="btn btn-ghost" disabled={!freeAnswer.trim()||evalLoading} onClick={handleEvalFree} style={{marginBottom:16}}>{evalLoading?"THINKING…":"SUBMIT REFLECTION"}</button>}{freeEval&&(<div className="feedback-box"><div className="feedback-title">✦ SCHOLAR'S ASSESSMENT</div><p className="feedback-text">{freeEval.feedback}</p><div style={{display:"flex",gap:16,marginTop:12}}><span style={{fontFamily:"Cinzel,serif",fontSize:".8rem",color:"var(--teal)"}}>Critical Thinking: <strong>{freeEval.critical}/10</strong></span><span style={{fontFamily:"Cinzel,serif",fontSize:".8rem",color:"var(--gold)"}}>Creative Insight: <strong>{freeEval.creative}/10</strong></span></div></div>)}{freeEval&&<div style={{textAlign:"right",marginTop:12}}><button className="btn btn-gold" onClick={nextQuestion}>{questionNum>=5?"VIEW YOUR CHRONICLE":"NEXT CHAPTER →"}</button></div>}</>)}</>);}
  function renderJournalTab(){if(!journal.length)return<div style={{textAlign:"center",padding:"36px 0",color:"rgba(26,18,8,.4)",fontStyle:"italic"}}>Your journal is empty. Submit a reflection to add entries.</div>;return(<><h2 className="section-heading">Chronicle of Decisions</h2>{journal.map((j,i)=>{const mk=j.artwork?.museumKey;return(<div key={i} className="journal-entry"><div className="journal-meta">CHAPTER {j.question} · {j.role} · {j.eraName}</div>{j.artwork&&<div className="journal-thumb-wrap"><img className="journal-thumb" src={j.artwork.url} alt={j.artwork.title}/>{mk&&<div className={`journal-thumb-badge ${mk}`}>{MUSEUMS[mk]?.short}</div>}</div>}{j.artwork&&<div style={{fontSize:".7rem",color:"rgba(26,18,8,.45)",fontStyle:"italic",marginBottom:8}}>{j.artwork.title}{j.artwork.artist?` · ${j.artwork.artist}`:""} — {j.artwork.museumName}</div>}<p style={{fontStyle:"italic",marginBottom:6,fontSize:".92rem"}}>{j.setting}</p><p style={{marginBottom:6}}><strong>Your reflection:</strong> {j.answer}</p><p style={{color:"var(--teal)",fontSize:".9rem"}}>Scholar: {j.feedback}</p></div>);})}</>);}
  function renderCharacterTab(){const critAvg=journal.length>0?Math.round(score.critical/journal.length):0;const creaAvg=journal.length>0?Math.round(score.creative/journal.length):0;const pct=score.total>0?Math.round((score.correct/score.total)*100):0;const rank=pct>=80&&critAvg>=7?"Master Chronicler":pct>=60?"Seasoned Advisor":"Apprentice Scholar";const eraArt=era?eraArtworks[era.id]:null;return(<><h2 className="section-heading">Character Sheet</h2><div className="char-sheet"><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><div className="avatar-frame"><DiceBearAvatar character={character} size={200}/></div></div><div className="char-info"><div className="char-name-display">{character.name||"Unnamed Hero"}</div><div className="char-stat-row"><span className="cs-stat-label">ROLE</span><span className="cs-stat-val">{role}</span></div><div className="char-stat-row"><span className="cs-stat-label">ERA</span><span className="cs-stat-val">{era?.name} <span style={{fontSize:".8rem",color:"rgba(26,18,8,.5)"}}>{era?.years}</span></span></div><div className="char-stat-row"><span className="cs-stat-label">RANK</span><span className="cs-stat-val" style={{color:"var(--red)",fontWeight:600}}>{rank}</span></div><div className="char-stat-row"><span className="cs-stat-label">DECISIONS</span><span className="cs-stat-val">{score.correct} correct / {score.total} total</span></div><div><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:"Cinzel,serif",fontSize:".67rem",color:"var(--teal)",letterSpacing:"1.5px"}}>CRITICAL THINKING</span><span style={{fontFamily:"Cinzel,serif",fontSize:".67rem",color:"var(--teal)"}}>{critAvg}/10</span></div><div className="xp-bar"><div className="xp-fill" style={{width:`${critAvg*10}%`,background:"linear-gradient(90deg,var(--teal),#3a9b9b)"}}/></div></div><div><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:"Cinzel,serif",fontSize:".67rem",color:"var(--gold)",letterSpacing:"1.5px"}}>CREATIVE INSIGHT</span><span style={{fontFamily:"Cinzel,serif",fontSize:".67rem",color:"var(--gold)"}}>{creaAvg}/10</span></div><div className="xp-bar"><div className="xp-fill" style={{width:`${creaAvg*10}%`,background:"linear-gradient(90deg,var(--gold),var(--gold2))"}}/></div></div></div></div>{eraArt&&<><h2 className="section-heading">Era Artwork</h2><MuseumImage artwork={eraArt} loading={false} height={180}/></>}<div style={{marginTop:20}}><button className="btn btn-ghost" onClick={()=>{setScreen("home");setEra(null);setRole(null);}}>← CHOOSE NEW ERA</button></div></>);}
  function renderSummary(){const critAvg=journal.length>0?Math.round(score.critical/journal.length):0;const creaAvg=journal.length>0?Math.round(score.creative/journal.length):0;const pct=Math.round((score.correct/5)*100);const rank=pct>=80&&critAvg>=7?"Master Chronicler":pct>=60?"Seasoned Advisor":"Apprentice Scholar";const artworks=journal.map(j=>j.artwork).filter(Boolean);const srcCounts=artworks.reduce((a,art)=>{a[art.museumKey]=(a[art.museumKey]||0)+1;return a;},{});return(<div className="scroll"><div className="ornament">✦ ✦ ✦</div><h2 className="section-heading" style={{justifyContent:"center"}}>Chronicle Complete</h2><div style={{display:"flex",flexWrap:"wrap",gap:24,justifyContent:"center",alignItems:"flex-start",marginBottom:24,padding:20,background:"rgba(26,18,8,.04)",border:"1.5px solid rgba(184,134,11,.25)",borderRadius:8}}><div className="avatar-frame"><DiceBearAvatar character={character} size={160}/></div><div style={{flex:"1 1 200px"}}><div style={{fontFamily:"Cinzel,serif",fontSize:"1.5rem",fontWeight:900,color:"var(--gold2)",letterSpacing:"2px",marginBottom:4}}>{character.name||"Hero"}</div><div style={{fontFamily:"Cinzel,serif",fontSize:".85rem",color:"var(--red)",letterSpacing:"2px",marginBottom:6}}>{rank}</div><div style={{fontStyle:"italic",color:"rgba(26,18,8,.6)",fontSize:".9rem",marginBottom:10}}>{role} · {era?.name}</div><div className="score-grid" style={{marginTop:0}}><div className="score-card"><div className="score-value">{score.correct}/5</div><div className="score-label">CORRECT</div></div><div className="score-card"><div className="score-value">{critAvg}/10</div><div className="score-label">CRITICAL</div></div><div className="score-card"><div className="score-value">{creaAvg}/10</div><div className="score-label">CREATIVE</div></div></div></div></div>{artworks.length>0&&(<><h2 className="section-heading">Artworks From Your Journey</h2><div className="art-strip">{artworks.map((art,i)=>{const mk=art.museumKey;return(<div key={i} className="art-strip-item"><img src={art.url} alt={art.title}/>{mk&&<div className={`art-strip-badge ${mk}`}>{MUSEUMS[mk]?.short}</div>}<div className="art-strip-caption">{art.title}{art.date?`, ${art.date}`:""}</div></div>);})}</div><div style={{display:"flex",gap:14,flexWrap:"wrap",margin:"6px 0 18px"}}>{Object.entries(srcCounts).map(([mk,count])=><div key={mk} style={{display:"flex",alignItems:"center",gap:5,fontSize:".72rem",color:"rgba(26,18,8,.55)"}}><div style={{width:8,height:8,borderRadius:2,background:mk==="met"?"var(--met)":mk==="cleveland"?"var(--cma)":"var(--artic)"}}/>{MUSEUMS[mk]?.name} ({count})</div>)}</div></>)}<h2 className="section-heading">Your Journal</h2>{!journal.length&&<p style={{color:"rgba(26,18,8,.5)",fontStyle:"italic",marginBottom:18}}>No reflections recorded.</p>}{journal.map((j,i)=><div key={i} className="journal-entry"><div className="journal-meta">CHAPTER {j.question}</div><p style={{fontStyle:"italic",marginBottom:4,fontSize:".9rem"}}>{j.setting}</p><p style={{fontSize:".92rem"}}>{j.answer}</p></div>)}<div style={{display:"flex",gap:12,marginTop:28,justifyContent:"center"}}><button className="btn btn-gold" onClick={()=>{setScreen("home");setEra(null);setRole(null);}}>PLAY AGAIN</button><button className="btn btn-ghost" onClick={()=>{setScreen("game");setTab("journal");}}>VIEW FULL JOURNAL</button></div><div className="ornament" style={{marginTop:22}}>✦ ✦ ✦</div></div>);}

  return(<><style>{STYLE}</style><div className="game-wrap"><header className="game-header"><div className="game-title">CHRONICLES OF HISTORY</div><div className="game-subtitle">An RPG Journey Through Time</div><div className="museum-sources"><span className="src-label">ARTWORKS FROM</span><span className="src-chip met">THE MET</span><span className="src-chip cma">CLEVELAND</span><span className="src-chip artic">ART INSTITUTE</span></div></header>{screen!=="home"&&screen!=="summary"&&(<div className="stat-bar"><div className="stat-pill">📜 Chapter <span>{questionNum}/5</span></div><div className="stat-pill">⚔ <span>{character.name||role}</span></div><div className="stat-pill">✦ Correct <span>{score.correct}/{score.total}</span></div><div className="stat-pill">🌍 <span>{era?.name}</span></div></div>)}{screen==="home"&&renderHome()}{screen==="game"&&renderGame()}{screen==="summary"&&renderSummary()}</div><MusicPlayer music={music} trackLabel={trackLabel}/></>);
}
