const ProgressView = {
    render: async () => {
        const res = await API.fetchStats(STATE.child.childId);
        if(res.status==="success") {
            const d = Utils.prepChart(res.data.stats);
            const ctx = document.getElementById('radarChart');
            if(window.myRadar) window.myRadar.destroy();
            window.myRadar = new Chart(ctx,{
                type:'radar',
                data:{
                    labels: d.labels,
                    datasets:[{
                        label: TXT.VIEWS.PROGRESS_DASHBOARD.HEADER_CHART,
                        data: d.values,
                        backgroundColor:'rgba(16,185,129,0.2)',
                        borderColor:'#10b981'
                    }]
                },
                options:{
                    scales:{r:{beginAtZero:true,max:100,ticks:{display:false}}},
                    plugins:{legend:{display:false}}
                }
            });
        }

        // NEW: Fetch and render historical line chart from DB_History (raw sums)
        const historyRes = await API.fetchHistory(STATE.child.childId);
        if (historyRes.status === "success" && historyRes.data.length > 0) {
            // Calculate max per domain from library (for %)
            const lib = STATE.library;
            const domainMax = {};
            Object.keys(CONFIG.DOMAINS).forEach(code => {
                domainMax[code] = lib.filter(m => m.domain === code).length * 4; // Raw max = num_milestones * 4
            });

            // Convert raw sums to % for chart
            const historyWithPercent = historyRes.data.map(entry => {
                const percentEntry = {};
                Object.keys(domainMax).forEach(code => {
                    percentEntry[code] = domainMax[code] > 0 ? Math.round((entry[code] / domainMax[code]) * 100) : 0;
                });
                return { ...entry, ...percentEntry };
            });

            // Render line chart (like DEMO)
            const ctxLine = document.getElementById('progressChart'); // Add this canvas in HTML below radar
            if (window.myLine) window.myLine.destroy();
            window.myLine = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: historyWithPercent.map(h => Utils.formatDate(h.date)),
                    datasets: Object.keys(CONFIG.DOMAINS).map((code, i) => ({
                        label: CONFIG.DOMAINS[code],
                        data: historyWithPercent.map(h => h[code]),
                        borderColor: `hsl(${i * 50}, 70%, 50%)`,
                        tension: 0.3,
                        fill: false
                    }))
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } },
                    scales: { y: { beginAtZero: true, max: 100 } }
                }
            });
        }

        // NEW: Render DEMO-style editing matrix (uses STATE.library, saves via logBulkUpdate)
        ProgressView.renderMatrix(res.data.stats);
    },

    // NEW: DEMO matrix render (adapted, uses real library)
    renderMatrix: (stats) => {
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
                    const currentScore = stats[m.id] || 0;
                    html += `<div class="py-2 border-b border-slate-100 last:border-0">
                        <div class="flex justify-between items-start">
                            <div class="flex items-start gap-2 pr-2 overflow-hidden">
                                <p class="text-xs font-bold text-slate-700 leading-snug truncate">${m.desc}</p>
                            </div>
                            <div class="flex gap-1 shrink-0">`;
                    for (let s = 1; s <= 4; s++) {
                        html += `<button onclick="ProgressView.rate('${m.id}', ${s})" class="text-[10px] px-2 py-1 rounded font-bold ${currentScore === s ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 bg-slate-100'}">${TXT.CORE.SCORES[s]}</button>`;
                    }
                    html += `</div></div></div>`;
                });
                html += `</div></div>`;
            });
            html += `</div></div>`;
            c.innerHTML += html;
        });
    },

    // NEW: DEMO rate function (tracks changes)
    rate: (id, score) => {
        STATE.progressChanges = STATE.progressChanges || {};
        STATE.progressChanges[id] = score;
        ProgressView.renderMatrix(); // Re-render to show selected
    },

    // NEW: DEMO save function (uses logBulkUpdate)
    save: async () => {
        const updates = Object.keys(STATE.progressChanges).map(id => ({id, score: STATE.progressChanges[id]}));
        await API.logBulkUpdate(STATE.child.childId, updates, "Dashboard update");
        STATE.progressChanges = {};
        ProgressView.render(); // Refresh chart with new snapshot
    }
};
