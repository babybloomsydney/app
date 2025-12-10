const Modals = {
    open:(n)=>{document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'));document.getElementById(n+'Modal').classList.remove('hidden');},
    close:()=>document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden')),
    
    renderAccordion:()=>{
        const c=document.getElementById('milestoneAccordion'); c.innerHTML=""; const g=Utils.groupLibrary(STATE.library);
        Object.keys(g).forEach((d,i)=>{
            let h=`<div class="border rounded-xl bg-white overflow-hidden mb-2"><button onclick="Modals.toggleAcc('d${i}')" class="w-full text-left p-4 font-bold text-sm flex justify-between bg-slate-50">${CONFIG.DOMAINS[d]}<i id="icon-d${i}" class="fa-solid fa-chevron-down transition-transform"></i></button><div id="d${i}" class="accordion-content px-4">`;
            Object.keys(g[d]).forEach(a=>{h+=`<div class="py-2"><p class="text-xs font-bold text-slate-400 uppercase">${a}</p>`;g[d][a].forEach(m=>h+=`<label class="flex gap-3 py-2"><input type="checkbox" value="${m.id}" onchange="Modals.toggleObj(this)" class="mt-1"><span class="text-xs">${m.desc}</span></label>`);h+=`</div>`;});
            c.innerHTML+=h+`</div></div>`;
        });
    },
    toggleAcc:(id)=>{document.getElementById(id).classList.toggle('accordion-open');document.getElementById('icon-'+id).classList.toggle('rotate-180');},
    toggleObj:(chk)=>{chk.checked?STATE.selectedObjectives.push(chk.value):STATE.selectedObjectives=STATE.selectedObjectives.filter(x=>x!==chk.value);},
    
    initLog:()=>{
        const s=document.getElementById('logDomain');s.innerHTML='<option>Domain...</option>';
        Object.keys(CONFIG.DOMAINS).forEach(k=>s.innerHTML+=`<option value="${k}">${CONFIG.DOMAINS[k]}</option>`);
        s.addEventListener('change',(e)=>{
            const m=document.getElementById('logMilestone');m.innerHTML='<option>Milestone...</option>';
            Utils.filterLibraryByDomain(e.target.value).forEach(x=>m.innerHTML+=`<option value="${x.id}">${x.desc.substring(0,40)}...</option>`);
        });
        document.querySelectorAll('.log-rate-btn').forEach(b=>b.addEventListener('click',(e)=>{
            document.querySelectorAll('.log-rate-btn').forEach(x=>x.classList.remove('selected'));
            e.target.classList.add('selected'); STATE.logRating=parseInt(e.target.innerText);
        }));
    },
    
    submitPlan:async()=>{
        document.getElementById('submitPlanBtn').innerText="Processing...";
        await API.generatePlan(STATE.child.childId,STATE.selectedObjectives);
        document.getElementById('submitPlanBtn').innerText="Generate";
        Modals.close();Router.navigate('feed');STATE.selectedObjectives=[];
    },
    submitReport:async()=>{
        const r=[];document.querySelectorAll('.rate-btn.selected').forEach(b=>r.push({id:b.dataset.id,score:parseInt(b.dataset.score)}));
        await API.submitReport(STATE.child.childId,STATE.reviewActivityId,r,document.getElementById('reviewNote').value);
        Modals.close();Router.navigate('feed');
    },
    submitLog:async()=>{
        await API.logObservation(STATE.child.childId,document.getElementById('logDomain').value,document.getElementById('logMilestone').value,STATE.logRating,document.getElementById('logNote').value);
        Modals.close();Router.navigate('feed');
    },
    setRating: (n)=>{STATE.logRating=n;} // Helper for inline onclick
};