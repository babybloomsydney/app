const Utils = {
    groupLibrary:(lib)=>{const g={};lib.forEach(m=>{if(!g[m.domain])g[m.domain]={};if(!g[m.domain][m.age])g[m.domain][m.age]=[];g[m.domain][m.age].push(m)});return g;},
    formatDate:(iso)=>iso?new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric'}):"",
    getMilestoneDesc:(id)=>{const m=STATE.library.find(x=>x.id===id);return m?m.desc:id;},
    filterLibraryByDomain:(d)=>STATE.library.filter(m=>m.domain===d),
    prepChart:(s)=>{const l=Object.keys(CONFIG.DOMAINS);return{labels:l,values:l.map(k=>s[k]?.percent||0)};}
};