/**
 * OBSERVATION: PROGRESS
 * Handles detailed assessment matrix updates.
 */
const ObsProgress = {
    scores: {}, // Map of { id: score }
    init: () => {
        ObsProgress.scores = {};
        ObsProgress.renderSelector();
        document.getElementById('progressFooter').classList.add('hidden');
    },
    renderSelector: () => {
        const c = document.getElementById('progressAccordion');
        if(!c) return; c.innerHTML = "";
        
        const grouped = Utils.groupLibrary(STATE.library);
        
        Object.keys(grouped).forEach((dom, i) => {
            const domLabel = CONFIG.DOMAINS[dom] || dom;
            let html = `
            <div class="border border-slate-200 rounded-xl bg-white overflow-hidden group mb-2">
                <button onclick="ObsProgress.toggleAcc(this)" class="sticky-header w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition border-b border-slate-50">
                    <span class="font-bold text-sm text-slate-700">${domLabel}</span>
                    <i class="fa-solid fa-chevron-down text-slate-300 transition-transform duration-300"></i>
                </button>
                <div class="accordion-content bg-slate-50 px-4">
                    <div class="py-2 space-y-4">`;
            Object.keys(grouped[dom]).forEach(age => {
                html += `<div><p class="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide mt-2">${age}</p><div class="space-y-2">`;
                grouped[dom][age].forEach(m => {
                    const currentScore = ObsProgress.scores[m.id];
                    const label = currentScore ? Utils.getScoreLabel(currentScore) : "";
                    const badgeClass = currentScore ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "hidden";
                    const bgClass = currentScore ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200";
                    html += `
                    <div class="border rounded-lg overflow-hidden transition-all ${bgClass}" id="card-${m.id}">
                        <button onclick="ObsProgress.toggleItem('${m.id}')" class="w-full text-left p-3 flex justify-between items-start gap-2 hover:bg-slate-50">
                            <span class="text-xs text-slate-700 leading-snug font-medium">${m.desc}</span>
                            <span id="badge-${m.id}" class="text-[10px] font-bold px-2 py-0.5 rounded border ${badgeClass}">${label}</span>
                        </button>
                        <div id="prog-opts-${m.id}" class="hidden bg-slate-50 p-2 border-t border-slate-100 grid grid-cols-4 gap-2">
                            ${[1,2,3,4].map(s => {
                                const active = currentScore === s ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600 border-slate-200";
                                return `<button onclick="ObsProgress.selectScore('${m.id}', ${s})" class="p-2 rounded border text-[10px] font-bold transition ${active}">${TXT.CORE.SCORES[s]}</button>`;
                            }).join('')}
                        </div>
                    </div>`;
                });
                html += `</div></div>`;
            });
            c.innerHTML += html + `</div></div></div>`;
        });
    },
    toggleAcc: (btn) => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.fa-chevron-down');
        
        if(content.style.maxHeight) {
            content.style.maxHeight = null;
            icon.classList.remove('rotate-180');
        } else {
            document.querySelectorAll('#progressAccordion .accordion-content').forEach(el=>el.style.maxHeight=null);
            document.querySelectorAll('#progressAccordion .fa-chevron-down').forEach(el=>el.classList.remove('rotate-180'));
            content.style.maxHeight = "4000px";
            icon.classList.add('rotate-180');
        }
    },
    toggleItem: (id) => {
        document.getElementById(`prog-opts-${id}`).classList.toggle('hidden');
    },
    selectScore: (id, score) => {
        if (ObsProgress.scores[id] === score) {
            delete ObsProgress.scores[id];
        } else {
            ObsProgress.scores[id] = score;
        }
        
        const current = ObsProgress.scores[id];
        const badge = document.getElementById(`badge-${id}`);
        const card = document.getElementById(`card-${id}`);
        
        if(current) {
            badge.innerText = TXT.CORE.SCORES[current];
            badge.classList.remove('hidden');
            card.className = "border rounded-lg overflow-hidden transition-all bg-emerald-50 border-emerald-200";
            document.getElementById(`prog-opts-${id}`).classList.add('hidden');
        } else {
            badge.classList.add('hidden');
            card.className = "border rounded-lg overflow-hidden transition-all bg-white border-slate-200";
        }
        const hasSelection = Object.keys(ObsProgress.scores).length > 0;
        if(hasSelection) document.getElementById('progressFooter').classList.remove('hidden');
        else document.getElementById('progressFooter').classList.add('hidden');
    },
    renderSummary: () => {
        const container = document.getElementById('progressSummaryContainer');
        if(!container) return;
        container.innerHTML = "";
        
        Object.keys(ObsProgress.scores).forEach(id => {
            const score = ObsProgress.scores[id];
            const m = STATE.library.find(x => x.id === id);
            const dom = m ? (CONFIG.DOMAINS[m.domain] || m.domain) : TXT.CORE.UNKNOWN_DOMAIN;
            
            container.innerHTML += `
            <div class="bg-white p-2 rounded-lg border border-blue-100 mb-1 flex justify-between items-center shadow-sm">
                <div class="truncate mr-2 w-3/4">
                    <span class="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-1">${dom}</span>
                    <p class="text-xs font-bold text-slate-700 truncate leading-tight">${m ? m.desc : id}</p>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 shrink-0">${TXT.CORE.SCORES[score]}</span>
            </div>`;
        });
    },
    submit: async () => {
        const note = document.getElementById('logNoteProgress').value;
        const updates = Object.keys(ObsProgress.scores).map(id => ({id: id, score: ObsProgress.scores[id]}));
        
        if(updates.length === 0) return alert(TXT.COMPONENTS.MODALS.OBSERVATION.PROGRESS.ERROR_NO_SELECTION);
        
        const btn = document.getElementById('btnSubmitProgress');
        const oldText = btn.innerText;
        
        // UI Feedback
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Uploading...`;
        btn.disabled = true;

        // --- NEW: HANDLE IMAGE UPLOAD ---
        let imageUrl = null;
        const fileInput = document.getElementById('logImageInput');
        
        if (fileInput && fileInput.files.length > 0) {
            imageUrl = await Cloudinary.uploadImage(fileInput, STATE.child.childId);
        }

        btn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> ${TXT.COMPONENTS.MODALS.OBSERVATION.SUCCESS_MSG}`;
        btn.classList.add('btn-success');

        await API.logBulkUpdate(STATE.child.childId, updates, note, imageUrl);
        
        setTimeout(() => {
            btn.innerText = oldText;
            btn.classList.remove('btn-success');
            btn.disabled = false;
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
            if (typeof ProgressView !== 'undefined') ProgressView.render();
        }, 800);
    }
};
