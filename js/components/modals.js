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

    // --- LEGACY SHIMS (To prevent crashes if main.js calls old methods) ---
    renderAccordion: () => PlanWizard.renderAccordion(),
    toggleAcc: (id) => PlanWizard.toggleAccordionById(id),
    toggleObj: (chk) => PlanWizard.toggleObj(chk),
    submitPlan: () => PlanWizard.submit()
};

/**
 * PLAN WIZARD (Activity Planner)
 */
const PlanWizard = {
    init: async () => {
        STATE.selectedObjectives = []; 
        
        // Safety: Ensure library is loaded
        if (!STATE.library || STATE.library.length === 0) {
            const res = await API.fetchLibrary();
            if (res.status === "success") STATE.library = res.data;
        }

        PlanWizard.renderTags();
        PlanWizard.renderAccordion();
        PlanWizard.updateUI();
    },

    renderAccordion: () => {
        const c = document.getElementById('milestoneAccordion'); 
        if(!c) return; 
        c.innerHTML = "";
        
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
    
    // Legacy Shim Helpers
    toggleAccordionById: (id) => {
       const el = document.getElementById(id);
       if(el) {
           el.classList.toggle('accordion-open');
           const icon = document.getElementById('icon-' + id);
           if(icon) icon.classList.toggle('rotate-180');
       }
    },
    toggleObj: (chk) => {
        if(chk.checked) STATE.selectedObjectives.push(chk.value);
        else STATE.selectedObjectives = STATE.selectedObjectives.filter(x => x !== chk.value);
    },

    select: (id) => {
        if(STATE.selectedObjectives.length >= 3) return;
        STATE.selectedObjectives.push(id);
        
        // Close accordions for better UX
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
        const tagContainer = document.getElementById('planActiveTags');
        tagContainer.innerHTML = "";
        
        STATE.selectedObjectives.forEach(id => {
            const m = STATE.library.find(x => x.id === id);
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

        const selectorArea = document.getElementById('planSelectorArea');
        const maxLimitMsg = document.getElementById('planMaxLimitMsg');
        const footer = document.getElementById('planFooter');

        if(count >= 3) {
            selectorArea.classList.add('hidden');
            maxLimitMsg.classList.remove('hidden');
        } else {
            selectorArea.classList.remove('hidden');
            maxLimitMsg.classList.add('hidden');
            PlanWizard.renderAccordion(); 
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
 * LOG WIZARD (3-Path: General, Focused, Progress)
 */
const LogWizard = {
    state: { mode: null, domains: [], progress: {} },

    init: () => {
        LogWizard.state = { mode: null, domains: [], progress: {} };
        ['logNoteGeneral', 'logNoteFocused', 'logNoteProgress'].forEach(id => document.getElementById(id).value = "");
        
        // Populate Domain Dropdown (Focused)
        const sel = document.getElementById('logDomainSelect');
        if (sel && sel.innerHTML === "") {
            sel.innerHTML = '<option value="">Select...</option>';
            Object.keys(CONFIG.DOMAINS).forEach(code => sel.innerHTML += `<option value="${code}">${CONFIG.DOMAINS[code]}</option>`);
        }
        
        LogWizard.renderProgressSelector(); 
        LogWizard.showStep('logStep1');
        document.getElementById('logBackBtn').classList.add('hidden');
        document.getElementById('logTitle').innerText = "New Observation";
    },

    // NAVIGATION
    goGeneral: () => { LogWizard.state.mode='General'; LogWizard.showStep('logStepGeneral'); LogWizard.updateHeader("General Entry"); },
    goFocused: () => { LogWizard.state.mode='Focused'; LogWizard.showStep('logStepFocused'); LogWizard.updateHeader("Focused Entry"); LogWizard.renderTags(); },
    goProgress: () => { LogWizard.state.mode='Progress'; LogWizard.showStep('logStepProgress'); LogWizard.updateHeader("Update Progress"); },
    goToProgressNote: () => { LogWizard.showStep('logStepProgressNote'); },

    back: () => {
        const curr = Array.from(document.querySelectorAll('[id^="logStep"]:not(.hidden)')).pop().id;
        if(curr === "logStepProgressNote") {
            LogWizard.goProgress(); // Go back to selector
        } else {
            LogWizard.state.mode = null;
            LogWizard.showStep('logStep1');
            document.getElementById('logBackBtn').classList.add('hidden');
            document.getElementById('logTitle').innerText = "New Observation";
        }
    },

    showStep: (id) => {
        ['logStep1', 'logStepGeneral', 'logStepFocused', 'logStepProgress', 'logStepProgressNote'].forEach(s => document.getElementById(s).classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
    },
    updateHeader: (txt) => {
        document.getElementById('logBackBtn').classList.remove('hidden');
        document.getElementById('logTitle').innerText = txt;
    },

    // --- FOCUSED LOGIC ---
    addDomain: (select) => {
        const val = select.value; if(!val) return;
        if(!LogWizard.state.domains.includes(val)) { LogWizard.state.domains.push(val); LogWizard.renderTags(); }
        select.value="";
    },
    removeDomain: (code) => { LogWizard.state.domains = LogWizard.state.domains.filter(d => d !== code); LogWizard.renderTags(); },
    renderTags: () => {
        const c=document.getElementById('activeTags'); c.innerHTML="";
        LogWizard.state.domains.forEach(code=>c.innerHTML+=`<div class="inline-flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200"><span>${CONFIG.DOMAINS[code]}</span><button onclick="LogWizard.removeDomain('${code}')" class="hover:text-indigo-900"><i class="fa-solid fa-times"></i></button></div>`);
        const inp=document.getElementById('focusedInputArea'), hint=document.getElementById('focusedHint');
        if(LogWizard.state.domains.length>0){inp.classList.remove('hidden'); hint.classList.add('hidden');}else{inp.classList.add('hidden'); hint.classList.remove('hidden');}
    },

    // --- PROGRESS LOGIC (New Accordion) ---
    renderProgressSelector: () => {
        const c = document.getElementById('progressAccordion'); if(!c) return; c.innerHTML = "";
        const grouped = Utils.groupLibrary(STATE.library);
        
        Object.keys(grouped).forEach((dom, i) => {
            let html = `
            <div class="border border-slate-200 rounded-xl bg-white overflow-hidden group mb-2">
                <button onclick="LogWizard.toggleProgAcc(this)" class="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition">
                    <span class="font-bold text-sm text-slate-700">${CONFIG.DOMAINS[dom]}</span>
                    <i class="fa-solid fa-chevron-down text-slate-300 transition-transform duration-300"></i>
                </button>
                <div class="accordion-content bg-slate-50 px-4">
                    <div class="py-2 space-y-4">`;

            Object.keys(grouped[dom]).forEach(age => {
                html += `<div><p class="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide mt-2">${age}</p><div class="space-y-2">`;
                grouped[dom][age].forEach(m => {
                    const currentScore = LogWizard.state.progress[m.id];
                    const label = currentScore ? Utils.getScoreLabel(currentScore) : "";
                    const badgeClass = currentScore ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "hidden";
                    
                    html += `
                    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all">
                        <button onclick="LogWizard.toggleProgItem('${m.id}')" class="w-full text-left p-3 flex justify-between items-start gap-2 hover:bg-slate-50">
                            <span class="text-xs text-slate-700 leading-snug font-medium">${m.desc}</span>
                            <span id="badge-${m.id}" class="text-[10px] font-bold px-2 py-0.5 rounded border ${badgeClass}">${label}</span>
                        </button>
                        <div id="prog-opts-${m.id}" class="hidden bg-slate-50 p-2 border-t border-slate-100 grid grid-cols-4 gap-2">
                            ${[1,2,3,4].map(s => `<button onclick="LogWizard.selectScore('${m.id}', ${s})" class="p-2 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition">${Utils.getScoreLabel(s)}</button>`).join('')}
                        </div>
                    </div>`;
                });
                html += `</div></div>`;
            });
            html += `</div></div></div>`;
            c.innerHTML += html;
        });
    },
    
    toggleProgAcc: (btn) => {
        const content = btn.nextElementSibling; const icon = btn.querySelector('.fa-chevron-down');
        if(content.style.maxHeight) { content.style.maxHeight = null; icon.classList.remove('rotate-180'); }
        else { 
            // Close others for cleanliness
            document.querySelectorAll('#progressAccordion .accordion-content').forEach(el=>el.style.maxHeight=null);
            document.querySelectorAll('#progressAccordion .fa-chevron-down').forEach(el=>el.classList.remove('rotate-180'));
            content.style.maxHeight = "3000px"; icon.classList.add('rotate-180'); 
        }
    },
    
    toggleProgItem: (id) => {
        const opts = document.getElementById(`prog-opts-${id}`);
        // Close other open items in the same list? (Optional, but good for UX)
        document.querySelectorAll('[id^="prog-opts-"]').forEach(el => {
            if(el.id !== `prog-opts-${id}`) el.classList.add('hidden');
        });
        opts.classList.toggle('hidden');
    },
    
    selectScore: (id, score) => {
        LogWizard.state.progress[id] = score;
        const badge = document.getElementById(`badge-${id}`);
        badge.innerText = Utils.getScoreLabel(score);
        badge.className = "text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-100 text-emerald-700 border-emerald-200";
        badge.classList.remove('hidden');
        
        // Close item
        document.getElementById(`prog-opts-${id}`).classList.add('hidden');
        
        // Show Footer if we have at least one selection
        document.getElementById('progressFooter').classList.remove('hidden');
    },

    // --- SUBMIT ---
    submit: async () => {
        const mode = LogWizard.state.mode;
        let note = "";
        
        // CASE 1: GENERAL
        if(mode === 'General') {
            note = document.getElementById('logNoteGeneral').value;
            if(!note.trim()) return alert("Write a note.");
            
            const btn = document.querySelector('#logStepGeneral button');
            btn.innerText = "Saving..."; btn.disabled = true;
            await API.logObservation(STATE.child.childId, "General", null, null, note);
            btn.innerText = "Save Observation"; btn.disabled = false;
        }
        
        // CASE 2: FOCUSED
        else if(mode === 'Focused') {
            note = document.getElementById('logNoteFocused').value;
            if(!note.trim()) return alert("Write a note.");
            const domains = LogWizard.state.domains.join(", ");
            
            const btn = document.querySelector('#logStepFocused button');
            btn.innerText = "Saving..."; btn.disabled = true;
            await API.logObservation(STATE.child.childId, domains, null, null, note);
            btn.innerText = "Save Observation"; btn.disabled = false;
        }
        
        // CASE 3: PROGRESS
        else if(mode === 'Progress') {
            note = document.getElementById('logNoteProgress').value;
            // Build updates array
            const updates = Object.keys(LogWizard.state.progress).map(id => ({id: id, score: LogWizard.state.progress[id]}));
            if(updates.length === 0) return alert("Select at least one milestone.");
            
            const btn = document.querySelector('#logStepProgressNote button');
            btn.innerText = "Saving..."; btn.disabled = true;
            await API.logBulkUpdate(STATE.child.childId, updates, note); 
            btn.innerText = "Add Observation"; btn.disabled = false;
        }

        Modals.close();
        if(typeof FeedView !== 'undefined') FeedView.render();
        if(typeof ProgressView !== 'undefined') ProgressView.render();
    }
};
