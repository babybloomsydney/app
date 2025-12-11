/**
 * MODALS & WIZARDS
 * Handles UI Overlays, Plan Wizard, and Log Wizard.
 */

const Modals = {
    open: (name) => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        document.getElementById(name + 'Modal').classList.remove('hidden');
        
        // Auto-Initialize Wizards
        if(name === 'log') LogWizard.init();
        if(name === 'plan') PlanWizard.init();
    },
    
    close: () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    },

    // --- COMPATIBILITY SHIMS ---
    // These prevent main.js from crashing if it calls old methods
    renderAccordion: () => PlanWizard.renderAccordion(),
    initLog: () => LogWizard.init(),
    toggleAcc: (id) => PlanWizard.toggleAccordionById(id),
    toggleObj: (chk) => PlanWizard.toggleObj(chk),
    submitPlan: () => PlanWizard.submit()
};

/**
 * PLAN WIZARD (Shopping Cart Logic)
 */
const PlanWizard = {
    
    init: async () => {
        STATE.selectedObjectives = []; // Clear
        
        // Safety: If library isn't loaded yet, fetch it now
        if (!STATE.library || STATE.library.length === 0) {
            console.log("Library empty, fetching...");
            const res = await API.fetchLibrary();
            if (res.status === "success") {
                STATE.library = res.data;
            }
        }

        PlanWizard.renderTags();
        PlanWizard.renderAccordion();
        PlanWizard.updateUI();
    },

    renderAccordion: () => {
        const c = document.getElementById('milestoneAccordion'); 
        if(!c) return;
        c.innerHTML = "";
        
        if (!STATE.library || STATE.library.length === 0) {
            c.innerHTML = `<div class="text-center p-4 text-gray-400">No milestones found.</div>`;
            return;
        }

        const grouped = Utils.groupLibrary(STATE.library);
        
        Object.keys(grouped).forEach((domCode, i) => {
            let html = `
            <div class="border border-slate-200 rounded-xl bg-white overflow-hidden group mb-2">
                <button onclick="PlanWizard.toggleAccordion(this)" class="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition">
                    <span class="font-bold text-sm text-slate-700">${CONFIG.DOMAINS[domCode] || domCode}</span>
                    <i class="fa-solid fa-chevron-down text-slate-300 transition-transform duration-300"></i>
                </button>
                <div class="accordion-content bg-slate-50 px-4">
                    <div class="py-2 space-y-4">`;

            Object.keys(grouped[domCode]).forEach(age => {
                html += `<div><p class="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide mt-2">${age}</p><div class="space-y-1">`;
                grouped[domCode][age].forEach(m => {
                    const isSelected = STATE.selectedObjectives.includes(m.id);
                    if(isSelected) return; 

                    html += `
                    <button onclick="PlanWizard.select('${m.id}')" class="w-full text-left p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-start gap-3 group/btn">
                        <div class="mt-0.5 w-4 h-4 rounded-full border-2 border-slate-300 group-hover/btn:border-indigo-500 flex-shrink-0"></div>
                        <span class="text-xs text-slate-600 group-hover/btn:text-indigo-700 leading-snug">${m.desc}</span>
                    </button>`;
                });
                html += `</div></div>`;
            });

            html += `</div></div></div>`;
            c.innerHTML += html;
        });
    },

    toggleAccordion: (btn) => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.fa-chevron-down');
        
        if(content.style.maxHeight) {
            content.style.maxHeight = null;
            icon.classList.remove('rotate-180');
        } else {
            // Close others (Snap Back effect)
            document.querySelectorAll('#milestoneAccordion .accordion-content').forEach(el => el.style.maxHeight = null);
            document.querySelectorAll('#milestoneAccordion .fa-chevron-down').forEach(el => el.classList.remove('rotate-180'));
            
            content.style.maxHeight = "2000px";
            icon.classList.add('rotate-180');
        }
    },
    
    // Helper for legacy shim
    toggleAccordionById: (id) => {
       const el = document.getElementById(id);
       if(el) {
           el.classList.toggle('accordion-open');
           const icon = document.getElementById('icon-' + id);
           if(icon) icon.classList.toggle('rotate-180');
       }
    },
    
    // Helper for legacy shim
    toggleObj: (chk) => {
        if(chk.checked) STATE.selectedObjectives.push(chk.value);
        else STATE.selectedObjectives = STATE.selectedObjectives.filter(x => x !== chk.value);
    },

    select: (id) => {
        if(STATE.selectedObjectives.length >= 3) return;
        STATE.selectedObjectives.push(id);
        
        // Snap Back: Close accordions
        document.querySelectorAll('#milestoneAccordion .accordion-content').forEach(el => el.style.maxHeight = null);
        document.querySelectorAll('#milestoneAccordion .fa-chevron-down').forEach(el => el.classList.remove('rotate-180'));

        PlanWizard.updateUI();
    },

    remove: (id) => {
        STATE.selectedObjectives = STATE.selectedObjectives.filter(x => x !== id);
        PlanWizard.updateUI();
    },

    updateUI: () => {
        const count = STATE.selectedObjectives.length;
        
        // Render Tags
        const tagContainer = document.getElementById('planActiveTags');
        tagContainer.innerHTML = "";
        
        STATE.selectedObjectives.forEach(id => {
            const m = STATE.library.find(x => x.id === id);
            // Fallback if m not found (shouldn't happen if library loaded)
            const domainName = m ? (CONFIG.DOMAINS[m.domain] || m.domain) : "Unknown";
            const desc = m ? m.desc : id;
            
            tagContainer.innerHTML += `
            <div class="flex justify-between items-center p-3 bg-indigo-50 border border-indigo-100 rounded-xl animate-fade-in">
                <div>
                    <span class="text-[10px] font-bold text-indigo-400 uppercase">${domainName}</span>
                    <p class="text-xs font-bold text-indigo-900 leading-tight line-clamp-1">${desc}</p>
                </div>
                <button onclick="PlanWizard.remove('${id}')" class="w-6 h-6 flex items-center justify-center bg-white rounded-full text-indigo-300 hover:text-red-500 hover:bg-red-50 transition shadow-sm flex-shrink-0">
                    <i class="fa-solid fa-times text-xs"></i>
                </button>
            </div>`;
        });

        // Visibility Logic
        const selectorArea = document.getElementById('planSelectorArea');
        const maxLimitMsg = document.getElementById('planMaxLimitMsg');
        const footer = document.getElementById('planFooter');

        if(count >= 3) {
            selectorArea.classList.add('hidden');
            maxLimitMsg.classList.remove('hidden');
        } else {
            selectorArea.classList.remove('hidden');
            maxLimitMsg.classList.add('hidden');
            PlanWizard.renderAccordion(); // Re-render to hide selected items
        }

        if(count > 0) footer.classList.remove('hidden');
        else footer.classList.add('hidden');
    },

    submit: async () => {
        const btn = document.getElementById('submitPlanBtn');
        const oldText = btn.innerText;
        btn.innerText = "Processing..."; btn.disabled = true;

        await API.generatePlan(STATE.child.childId, STATE.selectedObjectives);

        btn.innerText = oldText; btn.disabled = false;
        Modals.close();
        Router.navigate('feed');
        STATE.selectedObjectives = [];
        
        if(typeof FeedView !== 'undefined') FeedView.render();
    }
};

/**
 * LOG WIZARD (Ad-Hoc)
 */
const LogWizard = {
    state: { mode: null, domains: [] },

    init: () => {
        LogWizard.state = { mode: null, domains: [] };
        document.getElementById('logNoteGeneral').value = "";
        document.getElementById('logNoteSpecific').value = "";
        
        const sel = document.getElementById('logDomainSelect');
        if (sel && sel.innerHTML === "") {
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
        if(LogWizard.state.step === 3) { // Not using numbers anymore, logic is simpler
             LogWizard.state.mode = null;
             LogWizard.showStep('logStep1');
        } else {
             LogWizard.state.mode = null;
             LogWizard.showStep('logStep1');
        }
        // Specific 'Back' handling
        document.getElementById('logBackBtn').classList.add('hidden');
        document.getElementById('logTitle').innerText = "New Observation";
    },

    showStep: (id) => {
        ['logStep1', 'logStepGeneral', 'logStepSpecific'].forEach(s => document.getElementById(s).classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
    },

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
            <div class="inline-flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200 animate-fade-in">
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
        btn.innerText = "Saving..."; btn.disabled = true;

        await API.logObservation(STATE.child.childId, domainString, null, null, note);

        btn.innerText = oldText; btn.disabled = false;
        Modals.close();
        if (typeof FeedView !== 'undefined') FeedView.render();
    }
};
