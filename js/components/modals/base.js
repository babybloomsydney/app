/**
 * MODAL MANAGER (Hybrid)
 * Supports both legacy ID-based modals and new dynamic content helpers.
 * CRITICAL: This file MUST contain renderAccordion for main.js to work.
 */

const Modals = {
    activeModal: null,

    /**
     * Open a specific named modal by ID (Legacy Support)
     * e.g. Modals.open('plan') -> opens #planModal
     */
    open: (name) => {
        // 1. Hide all open modals
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        
        // 2. Show the target
        // Support both passed HTML content (new) or ID string (old)
        if (typeof name !== 'string') return; 

        const target = document.getElementById(name + 'Modal');
        if (target) {
            target.classList.remove('hidden');
            document.body.classList.add('overflow-hidden'); // Trap scroll
            
            // 3. Initialize specific logic if needed
            if (name === 'plan' && typeof PlanWizard !== 'undefined') PlanWizard.init();
            if (name === 'log' && typeof LogWizard !== 'undefined') LogWizard.init();
            
            Modals.activeModal = name;
        } else {
            console.warn(`Modal '${name}Modal' not found. Assuming dynamic content mode.`);
        }
    },

    /**
     * Closes all modals
     */
    close: () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        document.body.classList.remove('overflow-hidden');
        Modals.activeModal = null;
        
        // Clean dynamic body if it exists (for new modals)
        const dynamicBody = document.getElementById('modal-body');
        if (dynamicBody) dynamicBody.innerHTML = "";
    },

    /**
     * REQUIRED BY MAIN.JS: Renders a collapsible accordion list.
     * This is the missing function causing your crash.
     * @param {Array} items - { id, title, content, isOpen }
     */
    renderAccordion: (items) => {
        if (!items || items.length === 0) return "";

        return items.map(item => `
            <div class="border border-slate-200 rounded-lg mb-2 overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
                <button 
                    onclick="Modals.toggleAccordion('${item.id}')"
                    class="w-full flex justify-between items-center p-4 text-left bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none"
                >
                    <span class="font-semibold text-slate-700 text-sm">${item.title}</span>
                    <i id="icon-${item.id}" class="fa-solid ${item.isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-slate-400 transition-transform duration-200"></i>
                </button>
                <div 
                    id="content-${item.id}" 
                    class="${item.isOpen ? '' : 'hidden'} p-4 bg-white text-slate-600 text-sm border-t border-slate-100 leading-relaxed"
                >
                    ${item.content}
                </div>
            </div>
        `).join('');
    },

    /**
     * Toggles the accordion state (Click Handler).
     */
    toggleAccordion: (id) => {
        const content = document.getElementById(`content-${id}`);
        const icon = document.getElementById(`icon-${id}`);
        
        if (content) {
            content.classList.toggle('hidden');
        }
        
        if (icon) {
            if (content.classList.contains('hidden')) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        }
    },

    /**
     * Standard error modal helper
     */
    showError: (title, message) => {
        // Fallback to alert if UI structure is missing
        const container = document.getElementById('modal-container');
        const body = document.getElementById('modal-body');
        
        if (container && body) {
            body.innerHTML = `
                <div class="text-center p-4">
                    <h3 class="text-lg font-bold text-red-600 mb-2">${title}</h3>
                    <p class="text-gray-600 mb-4">${message}</p>
                    <button onclick="Modals.close()" class="bg-gray-200 px-4 py-2 rounded">Dismiss</button>
                </div>
            `;
            container.classList.remove('hidden');
        } else {
            alert(`${title}: ${message}`);
        }
    }
};
