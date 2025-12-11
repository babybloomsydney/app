/**
 * MODALS & WIZARDS
 */

const Modals = {
    open: (name) => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        document.getElementById(name + 'Modal').classList.remove('hidden');
        if(name === 'log') LogWizard.init();
    },
    close: () => document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden')),
    
    // --- PLANNER ---
    renderAccordion: () => {
        const c = document.getElementById('milestoneAccordion'); c.innerHTML = "";
        const g = Utils.groupLibrary(STATE.library);
        Object.keys(g).forEach((d, i) => {
            let h = `<div class="border border-slate-200 rounded-xl bg-white overflow-hidden mb-2"><button onclick="Modals.toggleAcc('d${i}')" class="w-full text-left p-4 font-bold text-sm text-slate-700 flex justify-between items-center bg-white hover:bg-slate-50 transition">${CONFIG.DOMAINS[d]}<i id="icon-d${i}" class="fa-solid fa-chevron-down transition-transform"></i></button><div id="d${i}" class="accordion-content px-4 bg-slate-50 border-t border-slate-100">`;
            Object.keys(g[d]).forEach(a => {
                h += `<div class="py-3 border-b border-slate-200 last:border-0"><p class="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide">${a}</p>`;
                g[d][a].forEach(m => h += `<label class="flex gap-3 py-2 items-start cursor-pointer hover:bg-slate-100 rounded-lg px-2 -mx-2 transition"><input type="checkbox" value="${m.id}" onchange="Modals.toggleObj(this)" class="mt-1 accent-indigo-600 w-4 h-4"><span class="text-xs text-slate-600 leading-snug">${m.desc}</span></label>`);
                h += `</div>`;
            });
            c.innerHTML += h + `</div></div>`;
        });
    },
    toggleAcc:(id)=>{document.getElementById(id).classList.toggle('accordion-open');document.getElementById('icon-'+id).classList.toggle('rotate-180');},
    toggleObj:(chk)=>{chk.checked?STATE.selectedObjectives.push(chk.value):STATE.selectedObjectives=STATE.selectedObjectives.filter(x=>x!==chk.value);},
    submitPlan:async()=>{if(STATE.selectedObjectives.length===0)return alert("Select milestones");const btn=document.getElementById('submitPlanBtn');btn.innerText="Processing...";btn.disabled=true;await API.generatePlan(STATE.child.childId,STATE.selectedObjectives);btn.innerText="Generate Plan";btn.disabled=false;Modals.close();Router.navigate('feed');STATE.selectedObjectives=[];}
};

/**
 * LOG WIZARD (Multi-Select & Tagging)
 */
const LogWizard = {
    state: {
        mode: null, 
        domains: [] 
    },

    init: () => {
        LogWizard.state = { mode: null, domains: [] };
        document.getElementById('logNoteGeneral').value = "";
        document.getElementById('logNoteSpecific').value = "";
        
        const sel = document.getElementById('logDomainSelect');
        if (sel.innerHTML === "") {
            sel.innerHTML = '<option value="">Select...</option>';
            Object.keys(CONFIG.DOMAINS).forEach(code => {
                sel.innerHTML += `<option value="${code}">${CONFIG.DOMAINS[code]}</option>`;
            });
        }
        
        LogWizard.showStep('logStep1');
        document.getElementById('logBackBtn').classList.add('hidden');
        document.getElementById('logTitle').innerText = "New Observation";
    },

    goGeneral: () => {
        LogWizard.state.mode = 'General';
        LogWizard.showStep('logStepGeneral');
        document.getElementById('logBackBtn').classList.remove('hidden');
        document.getElementById('logTitle').innerText = "General Entry";
    },

    goSpecific: () => {
        LogWizard.state.mode = 'Specific';
        LogWizard.showStep('logStepSpecific');
        document.getElementById('logBackBtn').classList.remove('hidden');
        document.getElementById('logTitle').innerText = "Specific Entry";
        LogWizard.renderTags();
    },

    back: () => {
        LogWizard.state.mode = null;
        LogWizard.showStep('logStep1');
        document.getElementById('logBackBtn').classList.add('hidden');
        document.getElementById('logTitle').innerText = "New Observation";
    },

    showStep: (id) => {
        ['logStep1', 'logStepGeneral', 'logStepSpecific'].forEach(s => document.getElementById(s).classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
    },

    // --- TAGGING LOGIC ---

    addDomain: (select) => {
        const val = select.value;
        if (!val) return;
        if (!LogWizard.state.domains.includes(val)) {
            LogWizard.state.domains.push(val);
            LogWizard.renderTags();
        }
        select.value = "";
    },

    removeDomain: (code) => {
        LogWizard.state.domains = LogWizard.state.domains.filter(d => d !== code);
        LogWizard.renderTags();
    },

    renderTags: () => {
        const container = document.getElementById('activeTags');
        container.innerHTML = "";
        
        LogWizard.state.domains.forEach(code => {
            container.innerHTML += `
            <div class="inline-flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200">
                <span>${CONFIG.DOMAINS[code]}</span>
                <button onclick="LogWizard.removeDomain('${code}')" class="hover:text-indigo-900"><i class="fa-solid fa-times"></i></button>
            </div>`;
        });

        const inputArea = document.getElementById('specificInputArea');
        const hint = document.getElementById('specificHint');
        
        if (LogWizard.state.domains.length > 0) {
            inputArea.classList.remove('hidden');
            hint.classList.add('hidden');
        } else {
            inputArea.classList.add('hidden');
            hint.classList.remove('hidden');
        }
    },

    submit: async () => {
        const mode = LogWizard.state.mode;
        let note = "";
        let domainString = "General";

        if (mode === 'General') {
            note = document.getElementById('logNoteGeneral').value;
        } else {
            note = document.getElementById('logNoteSpecific').value;
            domainString = LogWizard.state.domains.join(", "); 
        }

        if (!note.trim()) return alert("Please write an observation.");

        const btn = mode === 'General' ? document.querySelector('#logStepGeneral button') : document.querySelector('#logStepSpecific button');
        const oldText = btn.innerText;
        btn.innerText = "Saving...";
        btn.disabled = true;

        await API.logObservation(STATE.child.childId, domainString, null, null, note);

        btn.innerText = oldText;
        btn.disabled = false;
        Modals.close();
        
        if (typeof FeedView !== 'undefined') FeedView.render();
    }
};
