/**
 * OBSERVATION: FOCUSED
 * Handles multi-select domain tagging.
 */
const ObsFocused = {
    domains: [],

    init: () => {
        ObsFocused.domains = [];
        const sel = document.getElementById('logDomainSelect');
        if (sel && sel.innerHTML === "") {
            sel.innerHTML = '<option value="">Select...</option>';
            Object.keys(CONFIG.DOMAINS).forEach(code => {
                sel.innerHTML += `<option value="${code}">${CONFIG.DOMAINS[code]}</option>`;
            });
        }
        ObsFocused.renderTags();
    },

    addDomain: (select) => {
        const val = select.value; 
        if (!val) return;
        if (!ObsFocused.domains.includes(val)) {
            ObsFocused.domains.push(val);
            ObsFocused.renderTags();
        }
        select.value = "";
    },

    removeDomain: (code) => {
        ObsFocused.domains = ObsFocused.domains.filter(d => d !== code);
        ObsFocused.renderTags();
    },

    renderTags: () => {
        const c = document.getElementById('activeTags'); 
        c.innerHTML = "";
        
        ObsFocused.domains.forEach(code => {
            c.innerHTML += `
            <div class="inline-flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200 animate-fade-in">
                <span>${CONFIG.DOMAINS[code]}</span>
                <button onclick="ObsFocused.removeDomain('${code}')" class="hover:text-indigo-900"><i class="fa-solid fa-times"></i></button>
            </div>`;
        });

        const inp = document.getElementById('focusedInputArea');
        const hint = document.getElementById('focusedHint');
        
        if (ObsFocused.domains.length > 0) {
            inp.classList.remove('hidden'); hint.classList.add('hidden');
        } else {
            inp.classList.add('hidden'); hint.classList.remove('hidden');
        }
    },

    submit: async () => {
        const note = document.getElementById('logNoteFocused').value;
        if(!note.trim()) return alert("Please write a note.");

        const btn = document.getElementById('btnSubmitFocused');
        const oldText = btn.innerText;
        btn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> Added!`;
        btn.classList.add('btn-success');
        btn.disabled = true;

        await API.logObservation(STATE.child.childId, ObsFocused.domains.join(", "), null, null, note);

        setTimeout(() => {
            btn.innerText = oldText; 
            btn.classList.remove('btn-success');
            btn.disabled = false;
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
        }, 800);
    }
};