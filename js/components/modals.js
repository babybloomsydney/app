/**
 * MODALS & WIZARDS
 * Handles UI Overlays, Plan Wizard, and Log Wizard.
 */

const Modals = {
    open: (name) => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        document.getElementById(name + 'Modal').classList.remove('hidden');
        if(name === 'log') LogWizard.init();
        if(name === 'plan') PlanWizard.init();
    },
    
    close: () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    },
    
    // --- LEGACY SHIMS ---
    renderAccordion: () => PlanWizard.renderAccordion(),
    toggleAcc: (id) => PlanWizard.toggleAccordionById(id),
    toggleObj: (chk) => PlanWizard.toggleObj(chk),
    submitPlan: () => PlanWizard.submit()
};

/**
 * PLAN WIZARD (Shopping Cart Logic)
 */
const PlanWizard = {
    init: async () => {
        STATE.selectedObjectives = []; 
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
            // Fix: Fallback to domCode if it's already a full name
            const domainLabel = CONFIG.DOMAINS[domCode] || domCode;
            
            let html = `
            <div class="border border-slate-200 rounded-xl bg-white overflow-hidden group mb-2">
                <button onclick="PlanWizard.toggleAccordion(this)" class="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition">
                    <span class="font-bold text-sm text-slate-700">${domainLabel}</span>
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
            // Snap Back: Close others
            document.querySelectorAll('#milestoneAccordion .accordion-content').forEach(el => el.style.maxHeight = null);
            document.querySelectorAll('#milestoneAccordion .fa-chevron-down').forEach(el => el.classList.remove('rotate-180'));
            
            content.style.maxHeight = "2000px";
            icon.classList.add('rotate-180');
        }
    },
    
    toggleAccordionById: (id) => {
       const el = document.getElementById(id);
       if(el) { el.classList.toggle('accordion-open'); document.getElementById('icon-' + id)?.classList.toggle('rotate-180'); }
    },
    toggleObj: (chk) => {
        if(chk.checked) STATE.selectedObjectives.push(chk.value);
        else STATE.selectedObjectives = STATE.selectedObjectives.filter(x => x !== chk.value);
    },

    select: (id) => {
        if(STATE.selectedObjectives.length >= 3) return;
        STATE.selectedObjectives.push(id);
        
        // Close accordions
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
 * LOG WIZARD (Ad-Hoc)
 */
const LogWizard = {
    state: { mode: null, domains: [], progress: {} },

    init: () => {
        LogWizard.state = { mode: null, domains: [], progress: {} };
        ['logNoteGeneral', 'logNoteFocused', 'logNoteProgress'].forEach(id => document.getElementById(id).value = "");
        
        // Populate Domain Dropdown
        const sel = document.getElementById('logDomainSelect');
        if (sel && sel.innerHTML === "") {
            sel.innerHTML = '<option value="">Select...</option>';
            Object.keys(CONFIG.DOMAINS).forEach(code => {
                sel.innerHTML += `<option value="${code}">${CONFIG.DOMAINS[code]}</option>`;
            });
        }
        
        LogWizard.renderProgressSelector(); 
        LogWizard.showStep('logStep1');
        document.getElementById('logBackBtn').classList.add('hidden');
        document.getElementById('logTitle').innerText = "New Observation";
    },

    // NAVIGATION
    goGeneral: () => { LogWizard.state.mode='General'; LogWizard.showStep('logStepGeneral'); LogWizard.updateHeader("General Entry"); },
    goFocused: () => { LogWizard.state.mode='Focused'; LogWizard.showStep('logStepFocused'); LogWizard.updateHeader("Focused Entry"); LogWizard.renderTags(); },
    
    goProgress: () => { 
        LogWizard.state.mode='Progress'; 
        LogWizard.showStep('logStepProgress'); 
        LogWizard.updateHeader("Update Progress"); 
    },
    
    goToProgressNote: () => { 
        LogWizard.renderSummary(); // Render the summary tiles
        LogWizard.showStep('logStepProgressNote'); 
    },

    back: () => {
        const curr = Array.from(document.querySelectorAll('[id^="logStep"]:not(.hidden)')).pop().id;
        if(curr === "logStepProgressNote") LogWizard.goProgress();
        else {
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
        LogWizard.state.domains.forEach(code=>c.innerHTML+=`<div class="inline-flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200"><span>${CONFIG.DOMAINS[code] || code}</span><button onclick="LogWizard.removeDomain('${code}')" class="hover:text-indigo-900"><i class="fa-solid fa-times"></i></button></div>`);
        const inp=document.getElementById('focusedInputArea'), hint=document.getElementById('focusedHint');
        if(LogWizard.state.domains.length>0){inp.classList.remove('hidden'); hint.classList.add('hidden');}else{inp.classList.add('hidden'); hint.classList.remove('hidden');}
    },

    // --- PROGRESS LOGIC (Sticky, Toggle, Deselect) ---
    renderProgressSelector: () => {
        const c = document.getElementById('progressAccordion'); if(!c) return; c.innerHTML = "";
        const grouped = Utils.groupLibrary(STATE.library);
        
        Object.keys(grouped).forEach((dom, i) => {
            // FIX: Use dom directly if mapping is undefined (handles full names)
            const domLabel = CONFIG.DOMAINS[dom] || dom;
            
            let html = `
            <div class="border border-slate-200 rounded-xl bg-white overflow-hidden group mb-2">
                <button onclick="LogWizard.toggleProgAcc(this)" class="sticky top-0 z-20 w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition border-b border-slate-50 shadow-sm">
                    <span class="font-bold text-sm text-slate-700">${domLabel}</span>
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
                    // Only highlight bg if selected
                    const bgClass = currentScore ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200";

                    html += `
                    <div class="border rounded-lg overflow-hidden transition-all ${bgClass}" id="card-${m.id}">
                        <button onclick="LogWizard.toggleProgItem('${m.id}')" class="w-full text-left p-3 flex justify-between items-start gap-2 hover:bg-slate-50">
                            <span class="text-xs text-slate-700 leading-snug font-medium">${m.desc}</span>
                            <span id="badge-${m.id}" class="text-[10px] font-bold px-2 py-0.5 rounded border ${badgeClass}">${label}</span>
                        </button>
                        <div id="prog-opts-${m.id}" class="hidden bg-slate-50 p-2 border-t border-slate-100 grid grid-cols-4 gap-2">
                            ${[1,2,3,4].map(s => {
                                // Highlight active button
                                const active = currentScore === s ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600 border-slate-200";
                                return `<button onclick="LogWizard.selectScore('${m.id}', ${s})" class="p-2 rounded border text-[10px] font-bold transition ${active}">${Utils.getScoreLabel(s)}</button>`;
                            }).join('')}
                        </div>
                    </div>`;
                });
                html += `</div></div>`;
            });
            c.innerHTML += html + `</div></div></div>`;
        });
    },
    
    toggleProgAcc: (btn) => {
        const content = btn.nextElementSibling; const icon = btn.querySelector('.fa-chevron-down');
        if(content.style.maxHeight) { content.style.maxHeight = null; icon.classList.remove('rotate-180'); }
        else { 
            // Optional: Close others
            document.querySelectorAll('#progressAccordion .accordion-content').forEach(el=>el.style.maxHeight=null);
            document.querySelectorAll('#progressAccordion .fa-chevron-down').forEach(el=>el.classList.remove('rotate-180'));
            content.style.maxHeight = "4000px"; icon.classList.add('rotate-180'); 
        }
    },
    toggleProgItem: (id) => {
        const opts = document.getElementById(`prog-opts-${id}`);
        // Close others in same group?
        opts.classList.toggle('hidden');
    },
    
    selectScore: (id, score) => {
        const current = LogWizard.state.progress[id];
        
        if (current === score) {
            // DESELECT / TOGGLE OFF
            delete LogWizard.state.progress[id];
            
            // Reset UI
            document.getElementById(`badge-${id}`).classList.add('hidden');
            document.getElementById(`card-${id}`).className = "bg-white border border-slate-200 rounded-lg overflow-hidden transition-all";
            
            // Re-render buttons (to remove active class) - Expensive but safest, or just toggle classes manually
            // Re-rendering this specific card's options is better
            const optsContainer = document.getElementById(`prog-opts-${id}`);
            optsContainer.querySelectorAll('button').forEach(b => b.className = "p-2 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600");
            
        } else {
            // SELECT
            LogWizard.state.progress[id] = score;
            
            // Update UI
            const badge = document.getElementById(`badge-${id}`);
            badge.innerText = Utils.getScoreLabel(score);
            badge.className = "text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-100 text-emerald-700 border-emerald-200";
            badge.classList.remove('hidden');
            
            document.getElementById(`card-${id}`).className = "bg-emerald-50 border border-emerald-200 rounded-lg overflow-hidden transition-all";
            
            // Highlight Button
            const optsContainer = document.getElementById(`prog-opts-${id}`);
            optsContainer.querySelectorAll('button').forEach(b => {
                if(b.innerText === Utils.getScoreLabel(score)) {
                     b.className = "p-2 rounded border text-[10px] font-bold transition bg-emerald-600 text-white border-emerald-600";
                } else {
                     b.className = "p-2 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600";
                }
            });

            // Close menu after selection for cleanliness
            setTimeout(() => document.getElementById(`prog-opts-${id}`).classList.add('hidden'), 150);
        }
        
        // Show/Hide Footer based on selection count
        const hasSelection = Object.keys(LogWizard.state.progress).length > 0;
        if(hasSelection) document.getElementById('progressFooter').classList.remove('hidden');
        else document.getElementById('progressFooter').classList.add('hidden');
    },

    // --- SUMMARY RENDERER ---
    renderSummary: () => {
        const container = document.getElementById('progressSummaryContainer');
        if(!container) return;
        container.innerHTML = "";
        
        Object.keys(LogWizard.state.progress).forEach(id => {
            const score = LogWizard.state.progress[id];
            const m = STATE.library.find(x => x.id === id);
            const dom = m ? (CONFIG.DOMAINS[m.domain] || m.domain) : "";
            if(m) {
                container.innerHTML += `
                <div class="bg-white p-2 rounded-lg border border-blue-100 mb-1 flex justify-between items-center shadow-sm">
                    <div class="truncate mr-2 w-3/4">
                        <span class="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-1">${dom}</span>
                        <p class="text-xs font-bold text-slate-700 truncate leading-tight">${m.desc}</p>
                    </div>
                    <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 shrink-0">${Utils.getScoreLabel(score)}</span>
                </div>`;
            }
        });
    },

    // --- SUBMIT ---
    submit: async () => {
        const mode = LogWizard.state.mode;
        let note = "";
        let btnId = "";
        
        if(mode === 'General') { note = document.getElementById('logNoteGeneral').value; btnId = '#btnSubmitGeneral'; }
        else if(mode === 'Focused') { note = document.getElementById('logNoteFocused').value; btnId = '#btnSubmitFocused'; }
        else if(mode === 'Progress') { note = document.getElementById('logNoteProgress').value; btnId = '#btnSubmitProgress'; }
        
        // Validation
        if(mode !== 'Progress' && !note.trim()) return alert("Please write a note.");

        const btn = document.querySelector(btnId) || document.querySelector('#btnSkipNote');
        const oldText = btn.innerText;
        
        // ANIMATION: Success State
        btn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> Added!`;
        btn.classList.add('btn-success');
        
        // Disable temporarily
        btn.disabled = true;

        // API Calls
        if(mode === 'General') await API.logObservation(STATE.child.childId, "General", null, null, note);
        else if(mode === 'Focused') await API.logObservation(STATE.child.childId, LogWizard.state.domains.join(", "), null, null, note);
        else if(mode === 'Progress') {
            const updates = Object.keys(LogWizard.state.progress).map(id => ({id: id, score: LogWizard.state.progress[id]}));
            await API.logBulkUpdate(STATE.child.childId, updates, note);
        }

        // Wait for visual effect before closing
        setTimeout(() => {
            btn.innerText = oldText; 
            btn.classList.remove('btn-success');
            btn.disabled = false;
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
            if (typeof ProgressView !== 'undefined') ProgressView.render();
        }, 1000); 
    }
};
