import { useState, useEffect, useRef } from "react";

const TIERS = { free:{label:"Explorer",color:"#6B7C8A",f:["dv","ev","cv"]}, paid:{label:"Member",color:"#2A7D5F",f:["df","msg","opp","ai","er","cf"]}, corporate:{label:"Partner",color:"#B8862D",f:["df","msg","opp","ai","er","cf","feat","post","pipe","ana"]}, admin:{label:"Admin",color:"#8B4513",f:["all"]} };
const can = (u,f) => !u ? false : (TIERS[u.tier]||TIERS.free).f.includes("all") || (TIERS[u.tier]||TIERS.free).f.includes(f);
const C = { bg:"#F6F4EF",bgD:"#EDEAE2",bgW:"#FAF8F4",cd:"#FFF",fg:"#1A2B23",fs:"#3A4F43",fm:"#7A897F",fl:"#A3AFA7",fo:"#1A3C2E",fm2:"#2A5E45",fg2:"#358360",hs:"#0D1F17",hm:"#162E23",br:"#B08D3A",bl:"#D4B85C",bd:"rgba(176,141,58,.1)",ok:"#2A7D5F",wn:"#B08D3A",er:"#9B3A3A",inf:"#2D6A8A",b:"#DCD8CE",bs:"#E8E5DD",bf:"#F0EDE7" };
const FT = "'Cormorant Garamond',Georgia,serif", FB = "'Karla','Helvetica Neue',sans-serif";

const STY = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Karla:wght@300;400;500;600;700&display=swap');*{box-sizing:border-box;margin:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#DCD8CE;border-radius:2px}@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fu .4s ease-out both}`;

const ini = n => n.split(" ").map(w=>w[0]).filter(Boolean).slice(0,2).join("").toUpperCase();

// Storage using localStorage (works on any website)
const LS = {
  async get(k) { try { const v = localStorage.getItem("ghbn:" + k); return v ? JSON.parse(v) : null; } catch { return null; } },
  async set(k, v) { try { localStorage.setItem("ghbn:" + k, JSON.stringify(v)); } catch {} },
  async del(k) { try { localStorage.removeItem("ghbn:" + k); } catch {} },
};

const MEMBERS = [
  {id:"s1",name:"GHBN Admin",email:"info@ghbn.org",role:"Executive Director & Founder",org:"Ghana Health & Biotech Network",location:"Texas / Accra",type:"Diaspora",tier:"admin",expertise:["Supply Chain","Biotech Logistics"],bio:"Founder of GHBN. Connecting diaspora and local talent to advance healthcare and biotech in Ghana.",av:"GA",verified:true,founding:true,featured:false,joined:"2026-01"},
  {id:"s2",name:"Dr. Kwame Asante",email:"kwame@uog.edu.gh",role:"Biomedical Researcher",org:"Univ. of Ghana",location:"Accra, Ghana",type:"Ghana-Based",tier:"paid",expertise:["Genomics","Precision Medicine"],bio:"Leading genomics research for West African populations.",av:"KA",verified:true,founding:true,featured:false,joined:"2026-01"},
  {id:"s3",name:"Dr. Ama Mensah",email:"ama@novartis.com",role:"Pharma Scientist",org:"Novartis",location:"Basel, Switzerland",type:"Diaspora",tier:"paid",expertise:["Drug Development","Regulatory"],bio:"15 years in pharma focused on tropical diseases.",av:"AM",verified:true,founding:true,featured:false,joined:"2026-01"},
  {id:"s4",name:"Kofi Osei-Bonsu",email:"kofi@afridiag.com",role:"CEO & Founder",org:"AfriDiagnostics",location:"Kumasi, Ghana",type:"Ghana-Based",tier:"paid",expertise:["Diagnostics","Devices"],bio:"Building rapid diagnostics for rural West Africa.",av:"KO",verified:true,founding:true,featured:false,joined:"2026-01"},
  {id:"s5",name:"Yaw Boateng",email:"yaw@ahv.com",role:"VC Partner",org:"Africa Health Ventures",location:"London, UK",type:"Diaspora",tier:"corporate",expertise:["Healthcare VC","Investment"],bio:"$45M fund investing in African healthcare and biotech.",av:"YB",verified:true,founding:true,featured:true,joined:"2026-01"},
  {id:"s6",name:"Dr. Abena Darkwa",email:"abena@korlebu.gh",role:"Clinical Pharmacist",org:"Korle-Bu Hospital",location:"Accra, Ghana",type:"Ghana-Based",tier:"free",expertise:["Pharmacy","Drug Safety"],bio:"Clinical pharmacist at Ghana's largest teaching hospital.",av:"AD",verified:true,founding:false,featured:false,joined:"2026-02"},
  {id:"s7",name:"Dr. Nana Agyeman",email:"nana@lonza.com",role:"Biologics Lead",org:"Lonza",location:"Houston, TX",type:"Diaspora",tier:"paid",expertise:["Biologics","Cold Chain"],bio:"18 years in biologics manufacturing.",av:"NA",verified:true,founding:true,featured:false,joined:"2026-01"},
];
const EVENTS = [
  {id:"e1",title:"GHBN Founding Roundtable",desc:"First founding cohort gathering.",date:"Mar 28",time:"15:00 GMT",type:"Roundtable"},
  {id:"e2",title:"Biologics in West Africa",desc:"Panel on cold chain and biologics.",date:"Apr 10",time:"16:00 GMT",type:"Panel"},
  {id:"e3",title:"Startup Pitch Night",desc:"Startups pitch to investors.",date:"Apr 25",time:"18:00 GMT",type:"Pitch"},
  {id:"e4",title:"Diaspora Talent Connect",desc:"Matching diaspora with local orgs.",date:"May 8",time:"14:00 GMT",type:"Connect"},
];
const OPS = [
  {id:"o1",title:"Biologics Storage Partner",type:"Partnership",org:"GHBN",loc:"Accra",desc:"Seeking cold chain storage partners."},
  {id:"o2",title:"Clinical Research Associate",type:"Career",org:"AfriDiagnostics",loc:"Kumasi",desc:"CRA for diagnostics validation."},
  {id:"o3",title:"Digital Health Seed Fund",type:"Investment",org:"Africa Health Ventures",loc:"Pan-Africa",desc:"$250K–$500K seed for digital health."},
];
const COMS = ["Biotech Innovation 🧬","Pharma & Supply Chain 💊","Clinical Research 🔬","Healthcare Systems 🏥","Digital Health 📱","Investment & Ventures 💰"];

// ─── UI Primitives ───
const Av = ({i,s=40,c=C.fo,ft}) => <div style={{width:s,height:s,borderRadius:"50%",background:`radial-gradient(circle at 30% 30%,${c}dd,${c})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:FB,fontWeight:700,fontSize:s*.33,flexShrink:0,border:ft?`2px solid ${C.br}`:"2px solid transparent"}}>{i}</div>;
const Pl = ({t,c=C.fo,bg}) => <span style={{display:"inline-flex",padding:"3px 11px",borderRadius:20,fontSize:10.5,fontWeight:600,fontFamily:FB,color:c,background:bg||`${c}10`,whiteSpace:"nowrap"}}>{t}</span>;
const Bt = ({children,primary:p,small:s,onClick,disabled:d,full:f,sx={}}) => <button onClick={onClick} disabled={d} style={{padding:s?"8px 18px":"12px 28px",borderRadius:6,border:p?"none":`1px solid ${C.b}`,background:p?`linear-gradient(135deg,${C.fo},${C.fm2})`:"transparent",color:p?"#fff":C.fg,fontFamily:FB,fontWeight:600,fontSize:s?12:13.5,cursor:d?"not-allowed":"pointer",opacity:d?.5:1,width:f?"100%":undefined,...sx}}>{children}</button>;
const Ip = ({label:l,value:v,onChange:o,ph,type:t="text",area:a}) => <div style={{marginBottom:18}}>{l&&<label style={{fontFamily:FB,fontSize:11,fontWeight:600,color:C.fm,display:"block",marginBottom:6,letterSpacing:".05em",textTransform:"uppercase"}}>{l}</label>}{a?<textarea value={v} onChange={e=>o(e.target.value)} placeholder={ph} rows={3} style={{width:"100%",padding:"12px 16px",borderRadius:6,border:`1px solid ${C.b}`,fontFamily:FB,fontSize:13,color:C.fg,background:C.bgW,outline:"none",boxSizing:"border-box",resize:"vertical",lineHeight:1.6}}/>:<input type={t} value={v} onChange={e=>o(e.target.value)} placeholder={ph} style={{width:"100%",padding:"12px 16px",borderRadius:6,border:`1px solid ${C.b}`,fontFamily:FB,fontSize:13,color:C.fg,background:C.bgW,outline:"none",boxSizing:"border-box"}}/>}</div>;
const Cd = ({children,sx={},onClick:oc}) => <div onClick={oc} style={{background:C.cd,borderRadius:10,border:`1px solid ${C.bs}`,padding:22,overflow:"hidden",cursor:oc?"pointer":"default",...sx}}>{children}</div>;
const SL = ({t}) => <div style={{fontSize:10,fontWeight:700,letterSpacing:".18em",color:C.br,fontFamily:FB,textTransform:"uppercase",marginBottom:8}}>{t}</div>;
const Mol = () => <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.03,pointerEvents:"none"}} viewBox="0 0 400 300"><circle cx={100} cy={80} r={2} fill="#fff"/><circle cx={200} cy={50} r={2} fill="#fff"/><circle cx={300} cy={100} r={2} fill="#fff"/><circle cx={150} cy={180} r={2} fill="#fff"/><circle cx={250} cy={200} r={2} fill="#fff"/><circle cx={350} cy={150} r={2} fill="#fff"/><line x1={100} y1={80} x2={200} y2={50} stroke="#fff" strokeWidth=".4"/><line x1={200} y1={50} x2={300} y2={100} stroke="#fff" strokeWidth=".4"/><line x1={150} y1={180} x2={250} y2={200} stroke="#fff" strokeWidth=".4"/></svg>;

const Lock = ({user:u,feature:f,children,label:l}) => {
  if(can(u,f)) return children;
  return <div style={{padding:60,textAlign:"center",maxWidth:400,margin:"0 auto"}}>
    <div style={{fontSize:40,marginBottom:16}}>🔬</div>
    <h3 style={{fontFamily:FT,fontSize:22,color:C.fg,marginBottom:8,fontWeight:600}}>{l||"Premium Feature"}</h3>
    <p style={{fontSize:14,color:C.fm,lineHeight:1.7,marginBottom:24}}>Upgrade your membership to access the full GHBN ecosystem.</p>
    <Bt primary>Upgrade Membership</Bt>
  </div>;
};

// ═══ MAIN APP ═══
export default function App() {
  const [ok,setOk] = useState(false);
  const [user,setUser] = useState(null);
  const [pg,setPg] = useState("land");
  const [mems,setMems] = useState([]);
  const [evts,setEvts] = useState([]);
  const [ops,setOps2] = useState([]);
  const [msgs,setMsgs] = useState({});
  const [selId,setSelId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let m = await LS.get("m");
        if(!m||!m.length) { m = MEMBERS; await LS.set("m",m); }
        setMems(m);
        let e = await LS.get("e");
        if(!e) { e = EVENTS; await LS.set("e",e); }
        setEvts(e);
        let o = await LS.get("o");
        if(!o) { o = OPS; await LS.set("o",o); }
        setOps2(o);
        try { const s = await LS.get("sess"); if(s){ const f=m.find(x=>x.email===s.email); if(f){setUser(f);setPg("dash");} } } catch{}
        try { const mg = await LS.get("msgs"); if(mg) setMsgs(mg); } catch{}
      } catch(err) {
        setMems(MEMBERS); setEvts(EVENTS); setOps2(OPS);
      }
      setOk(true);
    })();
  }, []);

  const nav = (p,d) => { if(d!==undefined) setSelId(d); setPg(p); };
  const doLogin = async(email) => { const m = await LS.get("m")||mems; const f = m.find(x=>x.email===email.toLowerCase().trim()); if(!f) return "No account found."; await LS.set("sess",{email:f.email}); setUser(f); setMems(m); setPg("dash"); return null; };
  const doLogout = async() => { await LS.del("sess"); setUser(null); setPg("land"); };
  const doApply = async(form) => { const all = await LS.get("m")||[...mems]; const em = form.email.toLowerCase().trim(); if(all.find(m=>m.email===em)) return "Account exists."; const nu = {id:"m"+Date.now(),name:form.name,email:em,role:form.role,org:form.org,location:form.location,type:form.type,tier:"free",expertise:form.expertise.split(",").map(e=>e.trim()).filter(Boolean),bio:form.bio,av:ini(form.name),verified:true,founding:true,featured:false,joined:"2026"}; all.push(nu); await LS.set("m",all); setMems(all); await LS.set("sess",{email:em}); setUser(nu);
    // Email notification
    try { const subj = encodeURIComponent(`[GHBN] New Application: ${form.name}`); const body = encodeURIComponent(`New GHBN Membership Application\n\nName: ${form.name}\nEmail: ${em}\nRole: ${form.role}\nOrganization: ${form.org||"N/A"}\nLocation: ${form.location||"N/A"}\nType: ${form.type||"N/A"}\nExpertise: ${form.expertise||"N/A"}\n\nBio:\n${form.bio||"N/A"}\n\n— GHBN Platform`); window.open(`mailto:mansah@asedablc.com?subject=${subj}&body=${body}`,"_blank"); } catch{}
    return null; };
  const doUpdate = async(email,upd) => { const all = await LS.get("m")||[...mems]; const i = all.findIndex(m=>m.email===email); if(i<0)return; all[i]={...all[i],...upd}; await LS.set("m",all); setMems(all); if(user?.email===email) setUser(all[i]); };
  const doMsg = async(to,txt) => { if(!txt.trim())return; const mg={...msgs}; if(!mg[to])mg[to]=[]; mg[to].push({from:"me",text:txt.trim(),time:new Date().toLocaleTimeString()}); await LS.set("msgs",mg); setMsgs({...mg}); };
  const refresh = async() => { const m=await LS.get("m")||mems; setMems(m); };

  if(!ok) return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FB}}><style>{STY}</style><div style={{fontFamily:FT,fontSize:36,color:C.fo}}>GHBN</div></div>;

  // Public pages
  if(pg==="land") return <LandPg nav={nav} count={mems.length}/>;
  if(pg==="membership") return <MemberPg nav={nav}/>;
  if(pg==="apply") return <ApplyPg onSubmit={doApply} nav={nav}/>;
  if(pg==="login") return <LoginPg onLogin={doLogin} nav={nav}/>;
  if(!user) { setPg("land"); return null; }

  const sideItems = [
    {id:"dash",ic:"◈",l:"Dashboard"},
    {id:"dir",ic:"◎",l:"Directory"},
    {id:"msg",ic:"◉",l:"Messages",rq:"msg"},
    {id:"com",ic:"⬡",l:"Communities"},
    {id:"opp",ic:"◆",l:"Opportunities",rq:"opp"},
    {id:"evt",ic:"◇",l:"Events"},
    {id:"ai",ic:"λ",l:"Catalyst AI",rq:"ai"},
    ...(user.tier==="admin"?[{id:"adm",ic:"⛊",l:"Admin"}]:[]),
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,fontFamily:FB}}>
      <style>{STY}</style>
      {/* Sidebar */}
      <div style={{width:196,background:C.hs,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"26px 20px 18px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{fontFamily:FT,fontSize:22,color:"#fff",fontWeight:600}}>GHBN</div>
          <div style={{color:C.bl,fontSize:8,letterSpacing:".2em",fontWeight:700,marginTop:4,opacity:.6}}>MEMBER PLATFORM</div>
        </div>
        <div style={{flex:1,padding:"14px 8px",overflow:"auto"}}>
          {sideItems.map(it => { const lk=it.rq&&!can(user,it.rq); return (
            <button key={it.id} onClick={()=>nav(it.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",border:"none",borderRadius:5,cursor:"pointer",textAlign:"left",background:pg===it.id?"rgba(176,141,58,.12)":"transparent",color:lk?"rgba(255,255,255,.2)":pg===it.id?C.bl:"rgba(255,255,255,.45)",fontFamily:FB,fontSize:12.5,fontWeight:pg===it.id?600:400,marginBottom:1}}>
              <span style={{fontSize:11,width:14,textAlign:"center",opacity:.7}}>{it.ic}</span>{it.l}{lk&&<span style={{marginLeft:"auto",fontSize:8,opacity:.4}}>●</span>}
            </button>);
          })}
        </div>
        <div style={{padding:"10px 8px",borderTop:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{padding:"2px 12px 8px"}}><Pl t={TIERS[user.tier]?.label} c={TIERS[user.tier]?.color} bg={`${TIERS[user.tier]?.color}20`}/></div>
          <button onClick={()=>nav("set")} style={{display:"block",width:"100%",padding:"6px 12px",border:"none",borderRadius:4,cursor:"pointer",background:"transparent",color:"rgba(255,255,255,.3)",fontFamily:FB,fontSize:11,textAlign:"left"}}>⚙ Settings</button>
          <button onClick={doLogout} style={{display:"block",width:"100%",padding:"6px 12px",border:"none",borderRadius:4,cursor:"pointer",background:"transparent",color:"rgba(255,255,255,.2)",fontFamily:FB,fontSize:11,textAlign:"left"}}>↗ Sign Out</button>
        </div>
      </div>
      {/* Main */}
      <main style={{flex:1,padding:"24px 36px",overflow:"auto",maxHeight:"100vh"}}>
        <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",marginBottom:24,gap:12}}>
          {user.founding&&<Pl t="Founding" c={C.br} bg={C.bd}/>}
          <div onClick={()=>nav("set")} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><Av i={user.av||ini(user.name)} s={30} c={C.fo} ft={user.featured}/><span style={{fontSize:13,fontWeight:500,color:C.fg}}>{user.name.split(" ")[0]}</span></div>
        </div>
        <div className="fu" key={pg+selId}>
          {pg==="dash"&&<DashPg u={user} m={mems} e={evts} o={ops} nav={nav}/>}
          {pg==="dir"&&<DirPg m={mems} u={user} nav={nav}/>}
          {pg==="prof"&&<ProfPg id={selId} m={mems} u={user} nav={nav} send={doMsg}/>}
          {pg==="msg"&&<Lock user={user} feature="msg" label="Messaging"><MsgPg u={user} m={mems} msgs={msgs} send={doMsg}/></Lock>}
          {pg==="com"&&<ComPg u={user}/>}
          {pg==="opp"&&<Lock user={user} feature="opp" label="Opportunities"><OppPg d={ops} u={user}/></Lock>}
          {pg==="evt"&&<EvtPg d={evts} u={user}/>}
          {pg==="ai"&&<Lock user={user} feature="ai" label="Catalyst AI"><AIPg u={user} m={mems}/></Lock>}
          {pg==="adm"&&user.tier==="admin"&&<AdmPg m={mems} upd={doUpdate} ref2={refresh}/>}
          {pg==="set"&&<SetPg u={user} upd={u2=>doUpdate(user.email,u2)}/>}
        </div>
      </main>
    </div>
  );
}

// ═══ LANDING ═══
function KoraMusic() {
  const [muted, setMuted] = useState(false);
  const ctxRef = useRef(null);
  const startedRef = useRef(false);
  const gainRef = useRef(null);
  const intervalRef = useRef(null);

  const playNote = (ctx, gain, freq, time, dur = 0.6) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = "bandpass"; f.frequency.value = freq * 2; f.Q.value = 2;
    osc.type = "triangle";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.08, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(f); f.connect(g); g.connect(gain);
    osc.start(time); osc.stop(time + dur);
  };

  const playBass = (ctx, gain, freq, time) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.06, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
    osc.connect(g); g.connect(gain);
    osc.start(time); osc.stop(time + 0.9);
  };

  const playShaker = (ctx, gain, time) => {
    const bufSize = ctx.sampleRate * 0.03;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 7000;
    src.buffer = buf;
    g.gain.setValueAtTime(0.04, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    src.connect(hp); hp.connect(g); g.connect(gain);
    src.start(time); src.stop(time + 0.05);
  };

  const startMusic = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.value = 0;
      master.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 3);
      gainRef.current = master;
      const rev = ctx.createConvolver();
      try {
        const len = ctx.sampleRate * 2;
        const imp = ctx.createBuffer(2, len, ctx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
          const d = imp.getChannelData(ch);
          for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
        }
        rev.buffer = imp;
        master.connect(rev); rev.connect(ctx.destination);
      } catch(e) { master.connect(ctx.destination); }
      master.connect(ctx.destination);

      // D minor pentatonic - kora scale
      const koraFreqs = [293.66,349.23,392.00,440.00,523.25,587.33,698.46,783.99];
      const bassFreqs = [73.42,98.00,110.00,146.83];
      const seq = [0,2,4,6,3,5,7,4,2,6,3,5,1,4,6,3];
      let step = 0;
      let bassStep = 0;
      let tick = 0;

      intervalRef.current = setInterval(() => {
        if (ctx.state === "suspended") ctx.resume();
        const now = ctx.currentTime;
        // Kora note every ~190ms
        if (Math.random() > 0.2) {
          const idx = seq[step % seq.length] % koraFreqs.length;
          playNote(ctx, master, koraFreqs[idx], now, 0.5 + Math.random() * 0.3);
        }
        step++;
        // Bass every 8 ticks
        if (tick % 8 === 0) {
          playBass(ctx, master, bassFreqs[bassStep % bassFreqs.length], now);
          bassStep++;
        }
        // Shaker every 2 ticks
        if (tick % 2 === 0 && Math.random() > 0.3) {
          playShaker(ctx, master, now);
        }
        tick++;
      }, 190);

    } catch(e) { console.log("Audio error:", e); }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!startedRef.current) { startMusic(); setMuted(false); return; }
    if (gainRef.current && ctxRef.current) {
      if (muted) {
        gainRef.current.gain.linearRampToValueAtTime(0.7, ctxRef.current.currentTime + 0.3);
        setMuted(false);
      } else {
        gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.3);
        setMuted(true);
      }
    }
  };

  useEffect(() => {
    const handler = () => { if (!startedRef.current) startMusic(); };
    window.addEventListener("click", handler, { once: true });
    return () => {
      window.removeEventListener("click", handler);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (ctxRef.current) try { ctxRef.current.close(); } catch {}
    };
  }, []);

  return (
    <button onClick={toggleMute} style={{
      position:"fixed", bottom:24, right:24, zIndex:999,
      width:44, height:44, borderRadius:"50%",
      background: muted ? "rgba(15,31,23,.7)" : `linear-gradient(135deg,${C.br},${C.bl})`,
      border: muted ? `1px solid rgba(176,141,58,.3)` : "none",
      display:"flex", alignItems:"center", justifyContent:"center",
      cursor:"pointer", boxShadow: muted ? "none" : "0 2px 12px rgba(176,141,58,.25)",
    }}>
      <span style={{ fontSize:18 }}>{muted ? "🔇" : "🎵"}</span>
    </button>
  );
}

function LandPg({nav,count}) {
  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:FB}}>
    <style>{STY}</style>
    <KoraMusic />
    {/* Hero */}
    <div style={{background:`linear-gradient(170deg,${C.hs},#162E23 50%,#1E4233)`,position:"relative",overflow:"hidden"}}>
      <Mol/>
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"22px 44px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"baseline",gap:12}}><span style={{fontFamily:FT,fontSize:26,color:"#fff",fontWeight:600}}>GHBN</span><span style={{color:C.bl,fontSize:9,fontWeight:700,letterSpacing:".18em"}}>EST. 2026</span></div>
        <div style={{display:"flex",alignItems:"center",gap:28}}>
          <div style={{display:"flex",gap:24}}>{["About","Mission","Membership"].map(t=><span key={t} onClick={()=>t==="Membership"?nav("membership"):null} style={{color:"rgba(255,255,255,.6)",fontSize:13,fontFamily:FB,cursor:"pointer",fontWeight:400,letterSpacing:".02em"}}>{t}</span>)}</div>
          <div style={{width:1,height:16,background:"rgba(255,255,255,.15)"}}/>
          <div style={{display:"flex",gap:10}}><Bt small onClick={()=>nav("login")} sx={{color:"rgba(255,255,255,.8)",borderColor:"rgba(255,255,255,.15)",background:"transparent"}}>Sign In</Bt><Bt small primary onClick={()=>nav("membership")} sx={{background:C.br,color:C.hs}}>Become a Member</Bt></div>
        </div>
      </nav>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"60px 44px 90px",position:"relative",zIndex:2}}>
        <div style={{color:C.br,fontSize:10.5,fontWeight:700,letterSpacing:".25em",marginBottom:22}}>ADVANCING HEALTHCARE & BIOTECHNOLOGY</div>
        <h1 style={{fontFamily:FT,fontSize:"clamp(38px,5.5vw,64px)",color:"#fff",lineHeight:1.08,maxWidth:660,marginBottom:22,fontWeight:600}}>Ghana Health &<br/>Biotech Network</h1>
        <p style={{fontSize:16,color:"rgba(255,255,255,.58)",maxWidth:480,lineHeight:1.75,marginBottom:32}}>A vetted community of scientists, physicians, entrepreneurs, and investors building the future of healthcare from Ghana to Africa.</p>
        <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
          <Bt primary onClick={()=>nav("membership")} sx={{background:C.br,color:C.hs,fontSize:14,padding:"14px 34px",fontWeight:700}}>Become a Member</Bt>
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:70,background:`linear-gradient(transparent,${C.bg})`}}/>
    </div>
    {/* Mission */}
    <div style={{maxWidth:640,margin:"48px auto 0",padding:"0 44px",textAlign:"center"}}>
      <SL t="Our Mission"/>
      <h2 style={{fontFamily:FT,fontSize:26,color:C.fg,fontWeight:600,lineHeight:1.3,marginBottom:12}}>Connecting talent, innovation, and investment to position Ghana as a leading life sciences hub in West Africa.</h2>
      <p style={{fontSize:14,color:C.fm,lineHeight:1.7}}>Bridging local expertise with global experience — where Ghanaian professionals and diaspora talent collaborate together.</p>
    </div>
    {/* Pillars */}
    <div style={{maxWidth:920,margin:"48px auto",padding:"0 44px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.b,borderRadius:10,overflow:"hidden"}}>
        {[{n:"01",t:"Network",d:"Professionals connecting across borders."},{n:"02",t:"Talent",d:"Fellowships, mentorship, training."},{n:"03",t:"Infrastructure",d:"Biologics storage, pharma manufacturing."},{n:"04",t:"Investment",d:"Capital meets health innovation."}].map((p,i)=>
          <div key={i} style={{background:C.cd,padding:"24px 20px"}}><div style={{fontSize:11,fontWeight:700,color:C.br,letterSpacing:".15em",marginBottom:12}}>{p.n}</div><h3 style={{fontFamily:FT,fontSize:19,color:C.fg,marginBottom:6,fontWeight:600}}>{p.t}</h3><p style={{fontSize:12,color:C.fm,lineHeight:1.6}}>{p.d}</p></div>
        )}
      </div>
    </div>
    {/* Membership CTA */}
    <div style={{background:C.bgD,padding:"56px 44px",borderTop:`1px solid ${C.bf}`}}>
      <div style={{maxWidth:600,margin:"0 auto",textAlign:"center"}}>
        <SL t="Become Part of Something Bigger"/>
        <h2 style={{fontFamily:FT,fontSize:26,color:C.fg,fontWeight:600,lineHeight:1.3,marginBottom:14}}>The ecosystem doesn't build itself.<br/>It needs people like you.</h2>
        <p style={{fontSize:14,color:C.fm,lineHeight:1.75,marginBottom:28}}>Whether you're a researcher in Accra, a biotech professional in Houston, or an investor in London — your expertise and commitment matter. Become a cornerstone.</p>
        <Bt primary onClick={()=>nav("membership")} sx={{padding:"14px 36px"}}>Learn About Membership →</Bt>
      </div>
    </div>
    {/* Values + CTA */}
    <div style={{background:`linear-gradient(170deg,${C.hs},#162E23)`,padding:"48px 44px",position:"relative",overflow:"hidden"}}>
      <Mol/><div style={{maxWidth:680,margin:"0 auto",textAlign:"center",position:"relative",zIndex:2}}>
        <SL t="Our Values"/><h2 style={{fontFamily:FT,fontSize:24,color:"#fff",marginBottom:24,fontWeight:500}}>Built on collaboration, not competition.</h2>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>{["Collaboration","Ecosystem Building","Local + Global","Innovation","Integrity"].map(v=><span key={v} style={{padding:"8px 18px",borderRadius:6,border:"1px solid rgba(176,141,58,.25)",color:C.bl,fontSize:12}}>{v}</span>)}</div>
      </div>
    </div>
    {/* Footer */}
    <div style={{background:C.hs,padding:"40px 44px 24px",color:"rgba(255,255,255,.5)"}}>
      <div style={{maxWidth:960,margin:"0 auto",display:"flex",justifyContent:"space-between",gap:32,marginBottom:28,flexWrap:"wrap"}}>
        <div style={{maxWidth:320}}>
          <div style={{fontFamily:FT,fontSize:22,color:"#fff",fontWeight:600,marginBottom:6}}>GHBN</div>
          <p style={{fontSize:12,lineHeight:1.7,marginBottom:10}}>Ghana Health & Biotech Network — advancing healthcare and biotechnology innovation from Ghana to Africa.</p>
          <a href="mailto:mansah@asedablc.com" style={{fontSize:12,color:C.bl,textDecoration:"none"}}>info@ghbn.org</a>
        </div>
        <div style={{display:"flex",gap:32}}>
          <div><div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",color:"rgba(255,255,255,.3)",marginBottom:12}}>NAVIGATE</div>{["About","Mission","Membership","Sign In"].map(t=><div key={t} onClick={()=>t==="Membership"?nav("membership"):t==="Sign In"?nav("login"):null} style={{fontSize:12,marginBottom:7,cursor:"pointer"}}>{t}</div>)}</div>
          <div><div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",color:"rgba(255,255,255,.3)",marginBottom:12}}>CONNECT</div>{["LinkedIn","Twitter / X","Newsletter"].map(t=><div key={t} style={{fontSize:12,marginBottom:7}}>{t}</div>)}</div>
        </div>
      </div>
      <div style={{borderTop:"1px solid rgba(255,255,255,.08)",paddingTop:16,display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,.2)"}}>
        <span>© 2026 Ghana Health & Biotech Network</span><span>Founding Initiative</span>
      </div>
    </div>
  </div>;
}

// ═══ MEMBERSHIP JOURNEY ═══
function MemberPg({nav}) {
  const [step, setStep] = useState(0);
  const NavBar = () => <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"22px 44px",maxWidth:1100,margin:"0 auto"}}>
    <span onClick={()=>nav("land")} style={{fontFamily:FT,fontSize:26,color:C.fo,fontWeight:600,cursor:"pointer"}}>GHBN</span>
    <Bt small onClick={()=>nav("login")} sx={{color:C.fm,borderColor:C.b}}>Sign In</Bt>
  </nav>;

  // Step 0: Warm welcome + vision
  if(step===0) return <div style={{minHeight:"100vh",background:C.bg,fontFamily:FB}}>
    <style>{STY}</style>
    <NavBar/>
    <div style={{maxWidth:660,margin:"0 auto",padding:"40px 44px 80px"}}>
      <div className="fu">
        <SL t="Welcome"/>
        <h1 style={{fontFamily:FT,fontSize:"clamp(28px,4vw,40px)",color:C.fg,lineHeight:1.2,fontWeight:600,marginBottom:20}}>You're here because you believe Ghana's healthcare and biotech future matters.</h1>
        <p style={{fontSize:16,color:C.fs,lineHeight:1.8,marginBottom:16,fontWeight:300}}>So do we.</p>
        <p style={{fontSize:15,color:C.fm,lineHeight:1.8,marginBottom:16}}>For too long, talent in healthcare and life sciences — in Ghana and across the diaspora — has worked in isolation. Researchers who never meet the entrepreneurs. Clinicians who never connect with the investors. Diaspora professionals who want to contribute but have no path home.</p>
        <p style={{fontSize:15,color:C.fs,lineHeight:1.8,marginBottom:16,fontWeight:400}}>GHBN was founded to change that. We connect local expertise with global experience — where a pharmacist in Accra collaborates with a biotech scientist in Houston, and a startup in Kumasi finds its investor in London.</p>
        <p style={{fontSize:15,color:C.fm,lineHeight:1.8,marginBottom:14}}>Our vision: position Ghana as West Africa's leading healthcare and biotech hub. Not through talk — through building.</p>
        <div style={{background:`linear-gradient(135deg,${C.hs},#162E23)`,borderRadius:10,padding:"24px 22px",margin:"24px 0",position:"relative",overflow:"hidden"}}><Mol/><div style={{position:"relative",zIndex:2}}><p style={{fontFamily:FT,fontSize:19,color:"#fff",fontWeight:500,lineHeight:1.4,marginBottom:8}}>"The ecosystem doesn't build itself. It needs catalysts — people who see the gap and choose to bridge it."</p><p style={{fontSize:12,color:C.bl}}>— GHBN Founding Principle</p></div></div>
        <p style={{fontSize:15,color:C.fg,lineHeight:1.8,fontWeight:400,marginBottom:28}}>That's why we're inviting you. Not just to join a network — but to become a cornerstone of something that could transform healthcare across a continent.</p>

        <div style={{textAlign:"center",padding:"20px 0"}}>
          <p style={{fontSize:14,color:C.fm,marginBottom:16,fontWeight:400}}>Does this resonate with you?</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <Bt primary onClick={()=>setStep(1)} sx={{fontSize:14.5,padding:"14px 36px"}}>Yes — tell me more about membership</Bt>
            <Bt onClick={()=>nav("land")} sx={{color:C.fm}}>Not right now</Bt>
          </div>
        </div>
      </div>
    </div>
  </div>;

  // Step 1: Benefits
  if(step===1) return <div style={{minHeight:"100vh",background:C.bg,fontFamily:FB}}>
    <style>{STY}</style>
    <NavBar/>
    <div style={{maxWidth:740,margin:"0 auto",padding:"40px 44px 80px"}}>
      <div className="fu">
        <SL t="What Membership Means"/>
        <h1 style={{fontFamily:FT,fontSize:32,color:C.fg,fontWeight:600,lineHeight:1.2,marginBottom:12}}>More than a network.<br/>An ecosystem engine.</h1>
        <p style={{fontSize:15,color:C.fm,lineHeight:1.75,marginBottom:32}}>Access a curated community, collaboration tools, and a platform for real impact.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:32}}>
          {[{ic:"◎",t:"Vetted Directory",d:"Connect with verified professionals in Ghana and diaspora."},
            {ic:"◉",t:"Messaging",d:"Message members directly. Build partnerships."},
            {ic:"◆",t:"Opportunities",d:"Jobs, partnerships, investments, and training."},
            {ic:"⬡",t:"Communities",d:"Biotech, Pharma, Clinical Research, Digital Health."},
            {ic:"◇",t:"Events",d:"Roundtables, pitch nights, talent connects."},
            {ic:"λ",t:"Catalyst AI",d:"AI to find partners, draft outreach, plan strategy."},
            {ic:"⊕",t:"Featured Listing",d:"Premium visibility for organizations."},
            {ic:"⊞",t:"Post & Pipeline",d:"Post opportunities. Access founder pipeline."},
          ].map((b,i)=><Cd key={i} sx={{padding:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:12,color:C.br,fontWeight:600}}>{b.ic}</span><h4 style={{fontFamily:FT,fontSize:15,color:C.fg,fontWeight:600,margin:0}}>{b.t}</h4></div>
            <p style={{fontSize:12,color:C.fm,lineHeight:1.55}}>{b.d}</p>
          </Cd>)}
        </div>
        <div style={{textAlign:"center"}}>
          <p style={{fontSize:14,color:C.fm,marginBottom:14}}>Ready to see membership options?</p>
          <div style={{display:"flex",gap:14,justifyContent:"center"}}><Bt onClick={()=>setStep(0)}>← Back</Bt><Bt primary onClick={()=>setStep(2)} sx={{padding:"14px 36px"}}>Show me options →</Bt></div>
        </div>
      </div>
    </div>
  </div>;

  // Step 2: Tiers + Pricing
  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:FB}}>
    <style>{STY}</style>
    <NavBar/>
    <div style={{maxWidth:920,margin:"0 auto",padding:"40px 44px 60px"}}>
      <div className="fu">
        <div style={{textAlign:"center",marginBottom:36}}>
          <SL t="Membership Tiers"/>
          <h1 style={{fontFamily:FT,fontSize:30,color:C.fg,fontWeight:600,marginBottom:10}}>Choose your level.</h1>
          <p style={{fontSize:14,color:C.fm,maxWidth:500,margin:"0 auto"}}>Every tier supports the mission. The difference is depth of access.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginBottom:32}}>
          {[
            {t:"Explorer",p:"Free",pd:"No cost",its:["Directory (view)","Events calendar","Community preview"],c:C.fm,cta:"Start Free"},
            {t:"Member",p:"$450 / 450 GHS yr",pd:"Students: 100–150 GHS",its:["Full directory + messaging","Opportunities board","Catalyst AI","Events + RSVP","Full communities","Roundtables"],c:C.fo,pop:true,cta:"Become a Member"},
            {t:"Corporate",p:"$2,000–$5,000 yr",pd:"By org size",its:["All Member features","Featured listing","Post opportunities","Founder pipeline","Event sponsorship"],c:C.br,cta:"Become a Partner"},
          ].map((tier,i)=>
            <Cd key={i} sx={{padding:"26px 22px",border:tier.pop?`1.5px solid ${C.br}`:`1px solid ${C.bs}`,position:"relative",display:"flex",flexDirection:"column"}}>
              {tier.pop&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:C.br,color:"#fff",fontSize:9,fontWeight:700,padding:"3px 12px",borderRadius:10}}>POPULAR</div>}
              <div style={{fontFamily:FT,fontSize:21,color:tier.c,fontWeight:600}}>{tier.t}</div>
              <div style={{fontSize:18,fontWeight:700,color:C.fg,margin:"8px 0 2px",fontFamily:FT}}>{tier.p}</div>
              <div style={{fontSize:11,color:C.fm,marginBottom:16}}>{tier.pd}</div>
              <div style={{flex:1}}>{tier.its.map((it,j)=><div key={j} style={{fontSize:12,color:C.fs,padding:"3px 0",display:"flex",gap:8}}><span style={{color:C.ok,fontWeight:600}}>✓</span>{it}</div>)}</div>
              <Bt primary={tier.pop} full onClick={()=>nav("apply")} sx={{marginTop:16}}>{tier.cta}</Bt>
            </Cd>
          )}
        </div>
        <p style={{textAlign:"center",fontSize:13,color:C.fm}}>Start free. Upgrade anytime. No pressure — just purpose.</p>
        <div style={{textAlign:"center",marginTop:16}}><Bt onClick={()=>setStep(1)}>← Back</Bt></div>
      </div>
    </div>
  </div>;
}

// ═══ APPLY ═══
function ApplyPg({onSubmit,nav}) {
  const [s,ss]=useState(1); const [f,sf]=useState({name:"",email:"",role:"",org:"",location:"",type:"",expertise:"",bio:""}); const [err,se]=useState(""); const [dn,sd]=useState(false);
  const u=(k,v)=>sf(x=>({...x,[k]:v}));
  if(dn) return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FB}}><style>{STY}</style><Cd sx={{maxWidth:460,textAlign:"center",padding:44}}><div style={{fontSize:44,marginBottom:14}}>🧬</div><h2 style={{fontFamily:FT,fontSize:26,color:C.fo,marginBottom:8,fontWeight:600}}>Welcome to GHBN</h2><p style={{fontSize:13.5,color:C.fs,marginBottom:8}}>You're now a Founding Explorer.</p><p style={{fontSize:12.5,color:C.fm,marginBottom:24}}>Your application has been sent to our team at <strong>info@ghbn.org</strong>. If a confirmation email opened, please send it to complete your application.</p><Bt primary onClick={()=>nav("dash")} full>Enter Platform</Bt></Cd></div>;
  return <div style={{minHeight:"100vh",background:C.bg,padding:"44px 24px",fontFamily:FB}}><style>{STY}</style><div style={{maxWidth:500,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:32}}><span onClick={()=>nav("land")} style={{fontFamily:FT,fontSize:26,color:C.fo,cursor:"pointer",fontWeight:600}}>GHBN</span><h1 style={{fontFamily:FT,fontSize:26,color:C.fg,margin:"18px 0 6px",fontWeight:600}}>Membership Application</h1><p style={{fontSize:11,color:C.fm,letterSpacing:".1em",fontWeight:600}}>STEP {s} OF 2</p></div>
  <Cd sx={{padding:32}}>{s===1?<><Ip label="Full Name" value={f.name} onChange={v=>u("name",v)} ph="Dr. Kwame Asante"/><Ip label="Email" value={f.email} onChange={v=>u("email",v)} ph="you@example.com" type="email"/><Ip label="Role" value={f.role} onChange={v=>u("role",v)} ph="Biomedical Researcher"/><Ip label="Organization" value={f.org} onChange={v=>u("org",v)} ph="University of Ghana"/><Ip label="Location" value={f.location} onChange={v=>u("location",v)} ph="Accra, Ghana"/><div style={{marginBottom:16}}><label style={{fontSize:11,fontWeight:600,color:C.fm,display:"block",marginBottom:8,letterSpacing:".05em",textTransform:"uppercase"}}>Type</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["Ghana-Based","Diaspora","Student","Startup","Corporate"].map(t=><button key={t} onClick={()=>u("type",t)} style={{padding:"7px 14px",borderRadius:6,fontSize:12,fontFamily:FB,cursor:"pointer",border:`1px solid ${f.type===t?C.fo:C.b}`,background:f.type===t?`${C.fo}08`:"transparent",color:f.type===t?C.fo:C.fm}}>{t}</button>)}</div></div>{err&&<p style={{color:C.er,fontSize:13}}>{err}</p>}<div style={{display:"flex",justifyContent:"space-between",marginTop:24}}><Bt onClick={()=>nav("land")}>← Home</Bt><Bt primary onClick={()=>{if(!f.name||!f.email||!f.role){se("Required: name, email, role.");return;}se("");ss(2);}}>Continue →</Bt></div></>
  :<><Ip label="Expertise (comma-separated)" value={f.expertise} onChange={v=>u("expertise",v)} ph="Biotech, Regulatory..."/><Ip label="Bio" value={f.bio} onChange={v=>u("bio",v)} ph="Your background..." area/>{err&&<p style={{color:C.er,fontSize:13}}>{err}</p>}<div style={{display:"flex",justifyContent:"space-between",marginTop:16}}><Bt onClick={()=>ss(1)}>← Back</Bt><Bt primary onClick={async()=>{se("");const r=await onSubmit(f);if(r)se(r);else sd(true);}}>Submit</Bt></div></>}</Cd></div></div>;
}

// ═══ LOGIN ═══
function LoginPg({onLogin,nav}) {
  const [em,se]=useState(""); const [err,sr]=useState("");
  return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FB}}><style>{STY}</style><Cd sx={{maxWidth:380,width:"100%",padding:40}}>
    <div style={{textAlign:"center",marginBottom:28}}><span onClick={()=>nav("land")} style={{fontFamily:FT,fontSize:28,color:C.fo,cursor:"pointer",fontWeight:600}}>GHBN</span><h2 style={{fontFamily:FT,fontSize:22,color:C.fg,margin:"16px 0 4px",fontWeight:600}}>Welcome Back</h2></div>
    <Ip label="Email" value={em} onChange={se} ph="your@email.com" type="email"/>
    {err&&<p style={{color:C.er,fontSize:13,marginBottom:10}}>{err}</p>}
    <Bt primary full onClick={async()=>{const r=await onLogin(em);if(r)sr(r);}}>Sign In</Bt>
    <div style={{textAlign:"center",marginTop:18}}><span style={{fontSize:13,color:C.fm}}>New? </span><span onClick={()=>nav("apply")} style={{fontSize:13,color:C.fo,fontWeight:600,cursor:"pointer"}}>Apply →</span></div>
    <div style={{marginTop:20,padding:12,background:C.bgD,borderRadius:6}}><div style={{fontSize:10,fontWeight:700,color:C.fm,letterSpacing:".08em",marginBottom:4}}>DEMO</div><div style={{fontSize:11,color:C.fm,lineHeight:1.8}}><b>Admin:</b> info@ghbn.org<br/><b>Member:</b> kwame@uog.edu.gh · <b>Free:</b> abena@korlebu.gh</div></div>
  </Cd></div>;
}

// ═══ DASHBOARD ═══
function DashPg({u,m,e,o,nav}) {
  return <div>
    <SL t="Welcome back"/><h1 style={{fontFamily:FT,fontSize:28,color:C.fg,fontWeight:600}}>{u.name}</h1><p style={{fontSize:13,color:C.fm,marginTop:4,marginBottom:22,fontWeight:300}}>{u.role} · {u.org}</p>
    {u.tier==="free"&&<Cd sx={{background:`linear-gradient(135deg,${C.hs},#162E23)`,border:"none",marginBottom:22,position:"relative",overflow:"hidden"}}><Mol/><div style={{position:"relative",zIndex:2,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}><div><h3 style={{fontFamily:FT,fontSize:20,color:"#fff",fontWeight:500,marginBottom:4}}>Unlock the full ecosystem</h3><p style={{fontSize:12.5,color:"rgba(255,255,255,.5)"}}>Messaging, opportunities, Catalyst AI</p></div><Bt primary onClick={()=>nav("membership")} sx={{background:C.br,color:C.hs,fontWeight:700}}>Learn More</Bt></div></Cd>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
      {[{v:m.length,l:"Members",ic:"◎"},{v:o.length,l:"Opportunities",ic:"◆"},{v:e.length,l:"Events",ic:"◇"},{v:8,l:"Communities",ic:"⬡"}].map((s,i)=><Cd key={i}><div style={{fontSize:13,color:C.br,marginBottom:6}}>{s.ic}</div><div style={{fontFamily:FT,fontSize:28,color:C.fg,fontWeight:600}}>{s.v}</div><div style={{fontSize:11,color:C.fm}}>{s.l}</div></Cd>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Cd><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><h3 style={{fontFamily:FT,fontSize:18,color:C.fg,fontWeight:600}}>Events</h3><span onClick={()=>nav("evt")} style={{fontSize:12,color:C.fo,cursor:"pointer",fontWeight:600}}>ALL →</span></div>{e.slice(0,3).map(ev=><div key={ev.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.bf}`}}><div style={{fontWeight:600,fontSize:13,color:C.fg}}>{ev.title}</div><div style={{fontSize:11,color:C.fm}}>{ev.date} · {ev.time}</div></div>)}</Cd>
      <Cd><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><h3 style={{fontFamily:FT,fontSize:18,color:C.fg,fontWeight:600}}>New Members</h3><span onClick={()=>nav("dir")} style={{fontSize:12,color:C.fo,cursor:"pointer",fontWeight:600}}>ALL →</span></div>{m.slice(-4).reverse().map(mb=><div key={mb.id} onClick={()=>nav("prof",mb.id)} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.bf}`,cursor:"pointer"}}><Av i={mb.av||ini(mb.name)} s={34} c={C.fm2}/><div><div style={{fontWeight:600,fontSize:13,color:C.fg}}>{mb.name}</div><div style={{fontSize:11,color:C.fm}}>{mb.role}</div></div></div>)}</Cd>
    </div>
  </div>;
}

// ═══ DIRECTORY ═══
function DirPg({m,u,nav}) {
  const [q,sq]=useState(""); const [fl,sf]=useState("All");
  const sorted=[...m].sort((a,b)=>(b.featured?1:0)-(a.featured?1:0));
  const filt=sorted.filter(x=>{if(fl==="Ghana-Based"&&x.type!=="Ghana-Based")return false;if(fl==="Diaspora"&&x.type!=="Diaspora")return false;if(fl==="Founding"&&!x.founding)return false;if(q){const s=q.toLowerCase();return x.name.toLowerCase().includes(s)||x.role.toLowerCase().includes(s)||(x.expertise||[]).some(e=>e.toLowerCase().includes(s));}return true;});
  return <div><SL t="Network"/><h1 style={{fontFamily:FT,fontSize:28,color:C.fg,marginBottom:4,fontWeight:600}}>Directory</h1><p style={{fontSize:13,color:C.fm,marginBottom:20}}>{m.length} vetted professionals</p>
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}><div style={{flex:1,minWidth:180}}><input value={q} onChange={e=>sq(e.target.value)} placeholder="Search..." style={{width:"100%",padding:"10px 14px",borderRadius:6,border:`1px solid ${C.b}`,fontSize:13,fontFamily:FB,color:C.fg,background:C.bgW,outline:"none",boxSizing:"border-box"}}/></div>{["All","Ghana-Based","Diaspora","Founding"].map(f=><button key={f} onClick={()=>sf(f)} style={{padding:"8px 16px",borderRadius:6,border:`1px solid ${fl===f?C.fo:C.b}`,background:fl===f?`${C.fo}06`:"transparent",color:fl===f?C.fo:C.fm,fontFamily:FB,fontSize:12,fontWeight:600,cursor:"pointer"}}>{f}</button>)}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
      {filt.map(x=><Cd key={x.id} onClick={()=>nav("prof",x.id)} sx={{cursor:"pointer",border:x.featured?`1px solid ${C.br}40`:undefined}}>
        <div style={{display:"flex",gap:12}}><Av i={x.av||ini(x.name)} s={46} c={x.type==="Diaspora"?C.fm2:C.fo} ft={x.featured}/><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14,color:C.fg,fontFamily:FT}}>{x.name}{x.verified&&<span style={{fontSize:10,color:C.ok,marginLeft:4}}>✓</span>}</div><div style={{fontSize:12,color:C.fs,marginTop:2}}>{x.role}</div><div style={{fontSize:11,color:C.fm,fontWeight:300}}>{x.org} · {x.location}</div></div></div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:10}}><Pl t={x.type} c={x.type==="Diaspora"?C.inf:C.ok}/>{x.founding&&<Pl t="Founding" c={C.br} bg={C.bd}/>}{x.featured&&<Pl t="Featured" c={C.wn} bg={`${C.wn}10`}/>}</div>
        {(x.expertise||[]).length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:8}}>{x.expertise.slice(0,3).map(e=><span key={e} style={{padding:"2px 8px",borderRadius:4,fontSize:10,color:C.fo,background:`${C.fo}06`}}>{e}</span>)}</div>}
      </Cd>)}
    </div>
  </div>;
}

// ═══ PROFILE ═══
function ProfPg({id,m,u,nav,send}) {
  const x=m.find(v=>v.id===id); const [msg,sm]=useState(""); const [sent,ss]=useState(false);
  if(!x) return <p style={{color:C.fm,padding:40}}>Not found.</p>;
  return <div>
    <button onClick={()=>nav("dir")} style={{border:"none",background:"none",fontFamily:FB,fontSize:12,color:C.fo,cursor:"pointer",marginBottom:16,fontWeight:600}}>← DIRECTORY</button>
    <Cd sx={{padding:28,marginBottom:16}}><div style={{display:"flex",gap:20,flexWrap:"wrap"}}><Av i={x.av||ini(x.name)} s={72} c={C.fo} ft={x.featured}/><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h1 style={{fontFamily:FT,fontSize:26,color:C.fg,fontWeight:600}}>{x.name}</h1>{x.verified&&<Pl t="Verified" c={C.ok}/>}{x.founding&&<Pl t="Founding" c={C.br} bg={C.bd}/>}</div><p style={{fontSize:14,color:C.fs,margin:"4px 0"}}>{x.role}</p><p style={{fontSize:13,color:C.fm,fontWeight:300}}>{x.org} · {x.location}</p>{x.email!==u.email&&can(u,"msg")&&<Bt primary small onClick={()=>nav("msg")} sx={{marginTop:14}}>Message</Bt>}</div></div></Cd>
    <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:16}}>
      <Cd><h3 style={{fontFamily:FT,fontSize:18,color:C.fg,fontWeight:600,marginBottom:8}}>About</h3><p style={{fontSize:13.5,color:C.fs,lineHeight:1.7,fontWeight:300}}>{x.bio||"No bio."}</p>{(x.expertise||[]).length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:14}}>{x.expertise.map(e=><Pl key={e} t={e} c={C.fo}/>)}</div>}</Cd>
      <div><Cd sx={{marginBottom:14}}>{[["Type",x.type],["Location",x.location],["Org",x.org],["Joined",x.joined||"2026"]].map(([l,v])=><div key={l} style={{padding:"7px 0",borderBottom:`1px solid ${C.bf}`}}><div style={{fontSize:10,color:C.fm,fontWeight:600,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:13,fontWeight:500,color:C.fg,marginTop:1}}>{v}</div></div>)}</Cd>
      {x.email!==u.email&&can(u,"msg")&&<Cd><textarea value={msg} onChange={e=>sm(e.target.value)} placeholder={`Message ${x.name.split(" ")[0]}...`} rows={2} style={{width:"100%",padding:10,borderRadius:6,border:`1px solid ${C.b}`,fontFamily:FB,fontSize:13,background:C.bgW,outline:"none",boxSizing:"border-box",resize:"vertical",marginBottom:8}}/><Bt primary small full onClick={async()=>{if(!msg.trim())return;await send(x.email,msg);sm("");ss(true);setTimeout(()=>ss(false),3e3);}}>Send</Bt>{sent&&<p style={{color:C.ok,fontSize:12,marginTop:6,textAlign:"center"}}>✓ Sent</p>}</Cd>}</div>
    </div>
  </div>;
}

// ═══ MESSAGES ═══
function MsgPg({u,m,msgs,send}) {
  const ks=Object.keys(msgs); const [act,sa]=useState(ks[0]||null); const [txt,st]=useState(""); const [nw,sn]=useState(false); const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs,act]);
  const am=act?m.find(x=>x.email===act):null; const cm=act?(msgs[act]||[]):[];
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}><div><SL t="Conversations"/><h1 style={{fontFamily:FT,fontSize:26,color:C.fg,fontWeight:600}}>Messages</h1></div><Bt small onClick={()=>sn(!nw)}>{nw?"Cancel":"+ New"}</Bt></div>
    {nw&&<Cd sx={{marginBottom:14}}><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{m.filter(x=>x.email!==u.email).map(x=><div key={x.id} onClick={()=>{sa(x.email);sn(false);}} style={{display:"flex",gap:6,alignItems:"center",padding:"5px 12px",borderRadius:6,border:`1px solid ${C.b}`,cursor:"pointer",background:C.bgW}}><Av i={x.av||ini(x.name)} s={22} c={C.fm2}/><span style={{fontSize:12,fontWeight:600}}>{x.name}</span></div>)}</div></Cd>}
    <div style={{display:"flex",gap:14,height:440}}>
      <Cd sx={{width:240,padding:0,overflow:"auto",flexShrink:0}}>{ks.length===0?<div style={{padding:20,textAlign:"center",color:C.fm,fontSize:12}}>No conversations</div>:ks.map(em=>{const x=m.find(v=>v.email===em);const last=(msgs[em]||[]).slice(-1)[0];return<div key={em} onClick={()=>sa(em)} style={{display:"flex",gap:8,padding:"12px 14px",cursor:"pointer",background:act===em?`${C.fo}05`:"transparent",borderBottom:`1px solid ${C.bf}`,borderLeft:act===em?`2px solid ${C.br}`:"2px solid transparent"}}><Av i={x?(x.av||ini(x.name)):"?"} s={32} c={C.fo}/><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:12.5,color:C.fg}}>{x?.name||em}</div>{last&&<div style={{fontSize:11,color:C.fm,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{last.text}</div>}</div></div>;})}</Cd>
      <Cd sx={{flex:1,padding:0,display:"flex",flexDirection:"column"}}>{am?<><div style={{padding:"12px 18px",borderBottom:`1px solid ${C.bf}`,display:"flex",alignItems:"center",gap:10}}><Av i={am.av||ini(am.name)} s={30} c={C.fo}/><div><div style={{fontWeight:600,fontSize:13,color:C.fg}}>{am.name}</div><div style={{fontSize:11,color:C.fm}}>{am.role}</div></div></div><div ref={ref} style={{flex:1,padding:18,overflow:"auto"}}>{cm.map((mg,i)=><div key={i} style={{display:"flex",justifyContent:mg.from==="me"?"flex-end":"flex-start",marginBottom:10}}><div style={{maxWidth:"72%",padding:"9px 14px",borderRadius:10,background:mg.from==="me"?C.fo:C.bgD,color:mg.from==="me"?"#fff":C.fg,fontSize:13,lineHeight:1.55}}>{mg.text}<div style={{fontSize:9.5,marginTop:3,opacity:.4,textAlign:"right"}}>{mg.time}</div></div></div>)}{cm.length===0&&<div style={{textAlign:"center",color:C.fm,paddingTop:40,fontSize:13}}>Start a conversation</div>}</div><div style={{padding:"10px 14px",borderTop:`1px solid ${C.bf}`,display:"flex",gap:8}}><input value={txt} onChange={e=>st(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){send(act,txt);st("");}}} placeholder="Type..." style={{flex:1,padding:"9px 12px",borderRadius:6,border:`1px solid ${C.b}`,fontFamily:FB,fontSize:13,outline:"none",background:C.bgW}}/><Bt primary small onClick={()=>{send(act,txt);st("");}}>Send</Bt></div></>:<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.fm}}>Select a conversation</div>}</Cd>
    </div>
  </div>;
}

// ═══ COMMUNITIES ═══
function ComPg({u}) {
  const [j,sj]=useState(["c0","c1"]); const full=can(u,"cf");
  return <div><SL t="Collaborate"/><h1 style={{fontFamily:FT,fontSize:26,color:C.fg,marginBottom:20,fontWeight:600}}>Communities</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
      {COMS.map((c,i)=>{const [name,icon]=c.split(/(?=🧬|💊|🔬|🏥|📱|💰|🎓|🩺)/); const cid="c"+i; return <Cd key={i} sx={{padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:40,height:40,borderRadius:8,background:C.bd,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{icon}</div><div style={{fontFamily:FT,fontWeight:600,fontSize:16,color:C.fg}}>{name.trim()}</div></div>
        {full?<Bt small primary={!j.includes(cid)} onClick={()=>sj(x=>x.includes(cid)?x.filter(v=>v!==cid):[...x,cid])}>{j.includes(cid)?"✓ Joined":"Join"}</Bt>:<Pl t="Upgrade to join" c={C.fm}/>}
      </Cd>;})}
    </div>
  </div>;
}

// ═══ OPPORTUNITIES ═══
function OppPg({d,u}) {
  const [tab,st]=useState("All");
  const types=["All","Partnership","Career","Investment","Mentorship","Training"];
  const filt=tab==="All"?d:d.filter(o=>o.type===tab);
  const tc={Partnership:C.fo,Career:C.inf,Investment:C.wn,Mentorship:C.ok,Training:"#1A6B6A"};
  return <div>
    <SL t="Ecosystem"/><h1 style={{fontFamily:FT,fontSize:26,color:C.fg,fontWeight:600,marginBottom:4}}>Opportunities</h1><p style={{fontSize:13,color:C.fm,marginBottom:14}}>Careers, partnerships, investments, training</p>
    <div style={{display:"flex",gap:4,borderBottom:`1px solid ${C.bs}`,marginBottom:16}}>{types.map(t=><button key={t} onClick={()=>st(t)} style={{padding:"9px 16px",border:"none",background:"none",fontFamily:FB,fontSize:12,fontWeight:tab===t?600:400,color:tab===t?C.fo:C.fm,cursor:"pointer",borderBottom:tab===t?`2px solid ${C.br}`:"2px solid transparent",marginBottom:-1}}>{t}</button>)}</div>
    {filt.map(o=><Cd key={o.id} sx={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontFamily:FT,fontWeight:600,fontSize:15,color:C.fg}}>{o.title}</span><Pl t={o.type} c={tc[o.type]||C.fo}/></div><div style={{fontSize:12,color:C.fm,marginBottom:4}}>{o.org} · {o.loc}</div><p style={{fontSize:13,color:C.fs,lineHeight:1.6}}>{o.desc}</p></div><Bt small primary>Details</Bt></div></Cd>)}
  </div>;
}

// ═══ EVENTS ═══
function EvtPg({d,u}) {
  const [rv,sr]=useState([]); const canR=can(u,"er");
  return <div><SL t="Calendar"/><h1 style={{fontFamily:FT,fontSize:26,color:C.fg,marginBottom:20,fontWeight:600}}>Events</h1>
    {d.map(e=><Cd key={e.id} sx={{display:"flex",gap:16,alignItems:"center",marginBottom:12}}>
      <div style={{width:54,height:54,borderRadius:8,flexShrink:0,background:`linear-gradient(145deg,${C.fo},${C.fm2})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#fff"}}><div style={{fontFamily:FT,fontSize:20,fontWeight:600}}>{e.date.split(" ")[1]}</div><div style={{fontSize:8,fontWeight:700}}>{e.date.split(" ")[0]}</div></div>
      <div style={{flex:1}}><div style={{fontFamily:FT,fontWeight:600,fontSize:16,color:C.fg}}>{e.title}</div><div style={{fontSize:12,color:C.fm,marginTop:2}}>{e.date} · {e.time}</div><div style={{fontSize:12,color:C.fs,marginTop:2,fontWeight:300}}>{e.desc}</div></div>
      {canR?<Bt small primary={!rv.includes(e.id)} onClick={()=>sr(r=>r.includes(e.id)?r.filter(x=>x!==e.id):[...r,e.id])}>{rv.includes(e.id)?"✓ RSVP'd":"RSVP"}</Bt>:<Pl t="Upgrade" c={C.fm}/>}
    </Cd>)}
  </div>;
}

// ═══ CATALYST AI ═══
function AIPg({u,m}) {
  const [inp,si]=useState(""); const [msgs,sm]=useState([{f:"ai",t:`Welcome, ${u.name.split(" ")[0]}. I'm Catalyst AI. I can find partners, draft outreach, and plan strategy. What shall we work on?`}]); const [ld,sl]=useState(false); const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs]);
  const send=async()=>{if(!inp.trim()||ld)return;const q=inp;si("");sl(true);sm(p=>[...p,{f:"u",t:q}]);try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`You are GHBN Catalyst AI. User: ${u.name}, ${u.role}. ${m.length} members. Be specific and actionable.`,messages:[{role:"user",content:q}]})});const d=await r.json();sm(p=>[...p,{f:"ai",t:d.content?.map(i=>i.text||"").filter(Boolean).join("\n")||"Try again."}]);}catch{sm(p=>[...p,{f:"ai",t:"Connection issue."}]);}sl(false);};
  return <div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><div style={{width:36,height:36,borderRadius:8,background:`linear-gradient(135deg,${C.br},${C.bl})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:FT,fontSize:16,color:C.hs,fontWeight:700}}>λ</span></div><div><SL t="AI"/><h1 style={{fontFamily:FT,fontSize:24,color:C.fg,fontWeight:600}}>Catalyst AI</h1></div></div>
    {msgs.length<=1&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{["Find biotech companies","Draft LinkedIn post","Suggest sponsors","Growth strategy"].map((q,i)=><button key={i} onClick={()=>si(q)} style={{padding:"7px 12px",borderRadius:6,border:`1px solid ${C.b}`,background:C.bgW,fontFamily:FB,fontSize:11,color:C.fs,cursor:"pointer"}}>{q}</button>)}</div>}
    <Cd sx={{padding:0,height:420,display:"flex",flexDirection:"column"}}>
      <div ref={ref} style={{flex:1,padding:16,overflow:"auto"}}>{msgs.map((mg,i)=><div key={i} style={{display:"flex",justifyContent:mg.f==="u"?"flex-end":"flex-start",marginBottom:10}}><div style={{maxWidth:"78%",padding:"10px 14px",borderRadius:10,background:mg.f==="u"?C.fo:C.bgD,color:mg.f==="u"?"#fff":C.fg,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{mg.t}</div></div>)}{ld&&<div style={{padding:"10px 14px",borderRadius:10,background:C.bgD,color:C.fm,display:"inline-block"}}>Thinking...</div>}</div>
      <div style={{padding:"10px 14px",borderTop:`1px solid ${C.bf}`,display:"flex",gap:8}}><input value={inp} onChange={e=>si(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask Catalyst AI..." style={{flex:1,padding:"10px 14px",borderRadius:6,border:`1px solid ${C.b}`,fontFamily:FB,fontSize:13,outline:"none",background:C.bgW}}/><Bt primary small onClick={send} disabled={ld||!inp.trim()}>{ld?"...":"→"}</Bt></div>
    </Cd>
  </div>;
}

// ═══ ADMIN ═══
function AdmPg({m,upd,ref2}) {
  const [q,sq]=useState(""); const f=m.filter(x=>x.name.toLowerCase().includes(q.toLowerCase())||x.email.includes(q.toLowerCase()));
  return <div><SL t="Administration"/><h1 style={{fontFamily:FT,fontSize:26,color:C.fg,marginBottom:20,fontWeight:600}}>Admin Panel</h1>
    <div style={{marginBottom:16,maxWidth:360}}><input value={q} onChange={e=>sq(e.target.value)} placeholder="Search..." style={{width:"100%",padding:"10px 14px",borderRadius:6,border:`1px solid ${C.b}`,fontSize:13,fontFamily:FB,color:C.fg,background:C.bgW,outline:"none",boxSizing:"border-box"}}/></div>
    <Cd sx={{padding:0,overflow:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:FB,fontSize:13}}>
      <thead><tr style={{borderBottom:`2px solid ${C.bs}`,background:C.bgD}}>{["Member","Type","Tier","★"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:700,color:C.fm,fontSize:10,letterSpacing:".08em",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
      <tbody>{f.map(x=><tr key={x.id} style={{borderBottom:`1px solid ${C.bf}`}}>
        <td style={{padding:"10px 14px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av i={x.av||ini(x.name)} s={26} c={C.fo}/><div><div style={{fontWeight:600}}>{x.name}</div><div style={{fontSize:11,color:C.fm}}>{x.email}</div></div></div></td>
        <td style={{padding:"10px 14px"}}><Pl t={x.type} c={x.type==="Diaspora"?C.inf:C.ok}/></td>
        <td style={{padding:"10px 14px"}}><select value={x.tier} onChange={async e=>{await upd(x.email,{tier:e.target.value});await ref2();}} style={{padding:"5px 8px",borderRadius:4,border:`1px solid ${C.b}`,fontFamily:FB,fontSize:12,color:TIERS[x.tier]?.color,background:C.bgW,cursor:"pointer",fontWeight:600}}>{Object.keys(TIERS).map(t=><option key={t} value={t}>{TIERS[t].label}</option>)}</select></td>
        <td style={{padding:"10px 14px"}}><button onClick={async()=>{await upd(x.email,{featured:!x.featured});await ref2();}} style={{border:"none",background:"none",cursor:"pointer",fontSize:15}}>{x.featured?"★":"☆"}</button></td>
      </tr>)}</tbody>
    </table></Cd>
  </div>;
}

// ═══ SETTINGS ═══
function SetPg({u,upd}) {
  const [f,sf]=useState({name:u.name,role:u.role,org:u.org||"",location:u.location||"",bio:u.bio||"",expertise:(u.expertise||[]).join(", ")}); const [sv,ss]=useState(false);
  return <div><SL t="Account"/><h1 style={{fontFamily:FT,fontSize:26,color:C.fg,marginBottom:20,fontWeight:600}}>Settings</h1>
    <div style={{maxWidth:500}}><Cd sx={{padding:28}}>
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.bf}`}}><Av i={ini(f.name)} s={52} c={C.fo}/><div><div style={{fontFamily:FT,fontWeight:600,fontSize:16,color:C.fg}}>{f.name}</div><div style={{fontSize:12,color:C.fm}}>{u.email}</div><div style={{display:"flex",gap:6,marginTop:6}}><Pl t={TIERS[u.tier]?.label} c={TIERS[u.tier]?.color}/>{u.founding&&<Pl t="Founding" c={C.br} bg={C.bd}/>}</div></div></div>
      <Ip label="Name" value={f.name} onChange={v=>sf(x=>({...x,name:v}))}/><Ip label="Role" value={f.role} onChange={v=>sf(x=>({...x,role:v}))}/><Ip label="Organization" value={f.org} onChange={v=>sf(x=>({...x,org:v}))}/><Ip label="Location" value={f.location} onChange={v=>sf(x=>({...x,location:v}))}/><Ip label="Bio" value={f.bio} onChange={v=>sf(x=>({...x,bio:v}))} area/><Ip label="Expertise" value={f.expertise} onChange={v=>sf(x=>({...x,expertise:v}))}/>
      <div style={{display:"flex",gap:12,alignItems:"center",marginTop:8}}><Bt primary onClick={async()=>{await upd({...f,expertise:f.expertise.split(",").map(e=>e.trim()).filter(Boolean),av:ini(f.name)});ss(true);setTimeout(()=>ss(false),3e3);}}>Save</Bt>{sv&&<span style={{color:C.ok,fontSize:13,fontWeight:600}}>✓ Saved</span>}</div>
    </Cd></div>
  </div>;
}
