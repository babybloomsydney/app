/**
 * MODALS & WIZARDS
 * Handles UI Overlays and the Log Wizard Logic.
 */

const Modals = {
    open: (name) => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        document.getElementById(name + 'Modal').classList.remove('hidden');
        
        // Auto-Reset Wizard when opening Log
        if(name === 'log') LogWizard.init();
    },
    
    close: () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    },

    // --- PLANNER (Accordion) ---
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
    toggleAcc: (id) => { document.getElementById(id).classList.toggle('accordion-open'); document.getElementById('icon-'+id).classList.toggle('rotate-180'); },
    toggleObj: (chk) => { chk.checked ? STATE.selectedObjectives.push(chk.value) : STATE.selectedObjectives = STATE.selectedObjectives.filter(x => x !== chk.value); },

    submitPlan: async () => {
        if(STATE.selectedObjectives.length===0) return alert("Select milestones");
        const btn = document.getElementById('submitPlanBtn');
        btn.innerText = "Processing..."; btn.disabled = true;
        await API.generatePlan(STATE.child.childId, STATE.selectedObjectives);
        btn.innerText = "Generate Plan"; btn.disabled = false;
        Modals.close(); Router.navigate('feed'); STATE.selectedObjectives = [];
    }
};

/**
 * LOG WIZARD CONTROLLER
 * Handles the Multi-step flow for Ad-Hoc Observations.
 */
const LogWizard = {
    state: {
        step: 1,
        domain: null
    },

    init: () => {
        // Reset State
        LogWizard.state = { step: 1, domain: null };
        document.getElementById('logNote').value = ""; // Clear input
        
        // Render Domains List once (Performance optimization)
        const container = document.getElementById('domainListContainer');
        if (container.innerHTML === "") {
            Object.keys(CONFIG.DOMAINS).forEach(code => {
                container.innerHTML += `
                <button onclick="LogWizard.selectType('${code}')" class="w-full text-left p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 transition font-bold text-slate-700 text-sm flex items-center gap-3 group">
                    <span class="w-8 h-8 rounded-full bg-white text-indigo-500 border border-slate-100 flex items-center justify-center text-xs shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition"><i class="fa-solid fa-chevron-right"></i></span>
                    ${CONFIG.DOMAINS[code]}
                </button>`;
            });
        }

        LogWizard.render();
    },

    goToDomains: () => {
        LogWizard.state.step = 2;
        LogWizard.render();
    },

    selectType: (domainCode) => {
        LogWizard.state.domain = domainCode;
        LogWizard.state.step = 3;
        LogWizard.render();
    },

    back: () => {
        if(LogWizard.state.step === 3) {
            // If came from Specific (Step 2), go back to 2. If General (Step 1), go back to 1.
            if(LogWizard.state.domain === "General") LogWizard.state.step = 1;
            else LogWizard.state.step = 2;
        } else if(LogWizard.state.step === 2) {
            LogWizard.state.step = 1;
        }
        LogWizard.render();
    },

    render: () => {
        // Hide all steps
        ['logStep1', 'logStep2', 'logStep3'].forEach(id => document.getElementById(id).classList.add('hidden'));
        
        // Show current
        const step = LogWizard.state.step;
        document.getElementById('logStep' + step).classList.remove('hidden');

        // Header Logic
        const backBtn = document.getElementById('logBackBtn');
        const title = document.getElementById('logTitle');

        if(step === 1) {
            backBtn.classList.add('hidden');
            title.innerText = "New Observation";
        } else if(step === 2) {
            backBtn.classList.remove('hidden');
            title.innerText = "Select Domain";
        } else if(step === 3) {
            backBtn.classList.remove('hidden');
            title.innerText = "Write Note";
            
            // Update Badge
            const badge = document.getElementById('selectedDomainBadge');
            const dCode = LogWizard.state.domain;
            const dName = dCode === "General" ? "General Note" : (CONFIG.DOMAINS[dCode] || dCode);
            
            badge.innerText = dName;
            badge.className = dCode === "General" 
                ? "inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide border border-slate-200"
                : "inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide border border-indigo-100";
        }
    },

    submit: async () => {
        const note = document.getElementById('logNote').value;
        if(!note.trim()) return alert("Please write a note.");

        const btn = document.querySelector('#logStep3 button');
        const oldText = btn.innerText;
        btn.innerText = "Saving...";
        btn.disabled = true;

        // Send to Backend
        await API.logObservation(
            STATE.child.childId, 
            LogWizard.state.domain, 
            null, // MilestoneID (Null for Ad-Hoc v2)
            null, // Score (Null for Ad-Hoc v2)
            note
        );

        btn.innerText = oldText;
        btn.disabled = false;
        Modals.close();
        
        // Refresh Feed
        if (typeof FeedView !== 'undefined') FeedView.render();
    }
};
