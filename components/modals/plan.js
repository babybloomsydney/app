/**
 * PLAN WIZARD
 * Handles Activity Generation (Accordion & Tagging).
 */
const PlanWizard = {
   
    init: async () => {
        STATE.selectedObjectives = []; // Reset Cart
       
        // Auto-load library if missing
        if (!STATE.library || STATE.library.length === 0) {
            const res = await API.fetchLibrary();
            if (res.status === "success") STATE.library = res.data;
        }
        PlanWizard.renderTags();
        PlanWizard.renderAccordion();
        PlanWizard.updateUI();
    },
    // --- RENDERERS ---
    renderAccordion: () => {
        const container = document.getElementById('milestoneAccordion');
        if(!container) return;
        container.innerHTML = "";
       
        const grouped = Utils.groupLibrary(STATE.library);
       
        Object.keys(grouped).forEach((domCode, i) => {
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
                    // Skip if already selected
                    if(STATE.selectedObjectives.includes(m.id)) return;
                    html += `
                    <button onclick="PlanWizard.select('${m.id}')" class="w-full text-left p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-start gap-3 group/btn">
                        <div class="mt-0.5 w-4 h-4 rounded-full border-2 border-slate-300 group-hover/btn:border-indigo-500 flex-shrink-0"></div>
                        <span class="text-xs text-slate-600 group-hover/btn:text-indigo-700 leading-snug">${m.desc}</span>
                    </button>`;
                });
                html += `</div></div>`;
            });
            html += `</div></div></div>`;
            container.innerHTML += html;
        });
    },
    updateUI: () => {
        const count = STATE.selectedObjectives.length;
        const tagContainer = document.getElementById('planActiveTags');
        tagContainer.innerHTML = "";
       
        // Render Tags
        STATE.selectedObjectives.forEach(id => {
            const m = STATE.library.find(x => x.id === id);
            const domainName = m ? (CONFIG.DOMAINS[m.domain] || m.domain) : TXT.CORE.UNKNOWN_DOMAIN;
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
        // Toggle Views
        const selectorArea = document.getElementById('planSelectorArea');
        const maxLimitMsg = document.getElementById('planMaxLimitMsg');
        const footer = document.getElementById('planFooter');
        if(count >= 3) {
            selectorArea.classList.add('hidden');
            maxLimitMsg.classList.remove('hidden');
        } else {
            selectorArea.classList.remove('hidden');
            maxLimitMsg.classList.add('hidden');
            // Re-render accordion to ensure selected items disappear from list
            PlanWizard.renderAccordion();
        }
        if(count > 0) footer.classList.remove('hidden');
        else footer.classList.add('hidden');
    },
    renderTags: () => { /* Alias for updateUI, kept for safety */ PlanWizard.updateUI(); },
    // --- ACTIONS ---
    toggleAccordion: (btn) => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.fa-chevron-down');
       
        if(content.style.maxHeight) {
            content.style.maxHeight = null;
            icon.classList.remove('rotate-180');
        } else {
            // Close others (Snap Back)
            document.querySelectorAll('#milestoneAccordion .accordion-content').forEach(el => el.style.maxHeight = null);
            document.querySelectorAll('#milestoneAccordion .fa-chevron-down').forEach(el => el.classList.remove('rotate-180'));
           
            content.style.maxHeight = "2000px";
            icon.classList.add('rotate-180');
        }
    },
    select: (id) => {
        if(STATE.selectedObjectives.length >= 3) return;
        STATE.selectedObjectives.push(id);
       
        // Close accordion to "Snap Back"
        document.querySelectorAll('#milestoneAccordion .accordion-content').forEach(el => el.style.maxHeight = null);
        document.querySelectorAll('#milestoneAccordion .fa-chevron-down').forEach(el => el.classList.remove('rotate-180'));
       
        PlanWizard.updateUI();
    },
    remove: (id) => {
        STATE.selectedObjectives = STATE.selectedObjectives.filter(x => x !== id);
        PlanWizard.updateUI();
    },
    submit: async () => {
        const btn = document.getElementById('submitPlanBtn');
        const oldText = btn.innerText;
        btn.innerText = TXT.COMPONENTS.MODALS.PLAN.BTN_PROCESSING;
        btn.disabled = true;
        await API.generatePlan(STATE.child.childId, STATE.selectedObjectives);
        btn.innerText = oldText;
        btn.disabled = false;
        Modals.close();
        Router.navigate('feed'); // Go to feed to see result
        STATE.selectedObjectives = [];
       
        if(typeof FeedView !== 'undefined') FeedView.render();
    }
};
