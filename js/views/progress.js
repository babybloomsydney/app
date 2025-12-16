/**
 * VIEW: PROGRESS DASHBOARD
 * Handles Analytics Charts, History Slider, and Assessment Matrix.
 */

const ProgressView = {
    filter: 'All',
    historyData: [], 
    currentMatrix: {}, 
    changes: {}, 
    
    // Constants from Preview
    MAX_TOTAL_SCORE: 160,
    PROGRAM_DURATION_MONTHS: 36,
    DOMAIN_ICONS: { 
        "CL": "\uf086", "PSE": "\uf004", "PD": "\uf183", 
        "LIT": "\uf02d", "NUM": "\uf1ec", "UW": "\uf0ac", "EAD": "\uf1fc" 
    },

    render: async () => {
        const container = document.getElementById('view-progress');
        
        // 1. Initial Skeleton (if empty)
        if (!document.getElementById('domainSelect')) {
            container.innerHTML = `
            <div class="mb-6 select-wrapper">
                <select id="domainSelect" onchange="ProgressView.setFilter(this.value)" class="stylized-select w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 pl-6 pr-10 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg transition-shadow">
                    <option value="All">Development Overview</option>
                </select>
            </div>
            
            <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 transition-all duration-300 relative overflow-hidden" id="analyticsCard">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-bold text-slate-400 text-xs uppercase tracking-wider" id="chartTitle">Development Overview</h3>
                    <div id="staticAgeIndicator" class="text-right transition-opacity duration-300"></div>
                </div>
                
                <div id="chartViewWrapper">
                    <div class="relative w-full h-96 flex items-center justify-center" id="chartContainer">
                        <canvas id="chartCanvas"></canvas>
                    </div>
                </div>
                
                <div id="chartSliderContainer" class="mt-6 px-2">
                    <div id="sliderControlsWrapper" class="relative flex items-center pr-[35px]">
                        <div id="nowMarkerLine" class="absolute top-[28px] z-[1] w-[4px] h-[8px] bg-e2e8f0 -translate-x-1/2 rounded-[1px] pointer-events-none hidden"></div>
                        <input type="range" min="0" max="100" value="0" id="timeSlider" class="flex-grow" oninput="ProgressView.updateSlider(this.value)">
                        <button id="resetSliderBtn" onclick="ProgressView.resetSlider()" class="absolute top-[23px] right-0 z-30 w-6 h-6 bg-transparent text-slate-400 border-none p-0 flex items-center justify-center cursor-pointer transition reset-hidden"><i class="fa-solid fa-rotate-left text-base"></i></button>
                    </div>
                    <div class="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wide"><span class="text-slate-500">Birth</span><span class="text-slate-500">Projected</span></div>
                </div>
            </div>
            
            <div id="matrixContainer" class="space-y-4"></div>
            
            <div id="saveFloat" class="fixed bottom-24 left-0 w-full flex justify-center z-50 transition-transform duration-300 translate-y-24 opacity-0 pointer-events-none">
                <button onclick="ProgressView.save()" class="bg-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-3 hover:scale-105 transition pointer-events-auto">
                    <span>Update Progress</span>
                    <div class="bg-white text-slate-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" id="changeCount">0</div>
                </button>
            </div>`;
            
            // Populate Dropdown
            const sel = document.getElementById('domainSelect');
            Object.keys(CONFIG.DOMAINS).forEach(code => {
                sel.innerHTML += `<option value="${code}">${CONFIG.DOMAINS[code]}</option>`;
            });
        }

        // 2. Fetch Real Data
        const [histRes, matrixRes] = await Promise.all([
            API.fetchHistory(STATE.child.childId),
            API.fetchProgress(STATE.child.childId)
        ]);

        if (histRes.status === "success") ProgressView.historyData = histRes.data;
        // Inject "Birth" zero-state if missing
        if (ProgressView.historyData.length === 0 || ProgressView.historyData[0].date !== "Birth") {
             ProgressView.historyData.unshift({ date: "Birth", CL: 0, PSE: 0, PD: 0, LIT: 0, NUM: 0, UW: 0, EAD: 0 });
        }

        if (matrixRes.status === "success") {
            ProgressView.currentMatrix = {};
            matrixRes.data.forEach(m => ProgressView.currentMatrix[m.id] = m.score);
        }

        // 3. Render
        ProgressView.setFilter('All');
        ProgressView.resetSlider();
    },

    setFilter: (key) => {
        ProgressView.filter = key;
        const title = key === 'All' ? "Development Overview" : CONFIG.DOMAINS[key];
        document.getElementById('chartTitle').innerText = title;
        document.getElementById('domainSelect').value = key;
        
        ProgressView.renderChart();
        ProgressView.renderMatrix();
    },

    resetSlider: () => {
        const dob = new Date(STATE.child.dob); // Assumes child object has dob
        const today = new Date();
        let months = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
        if(today.getDate() < dob.getDate()) months--;
        
        const percent = Math.min(100, Math.max(0, (months / ProgressView.PROGRAM_DURATION_MONTHS) * 100));
        
        const slider = document.getElementById('timeSlider');
        if(slider) {
            slider.value = percent;
            ProgressView.updateSlider(percent);
        }
    },

    getAgeInMonthsDisplay: (months) => {
        const m = Math.round(months);
        const y = Math.floor(m / 12);
        const rm = m % 12;
        if (m === 0) return "Birth";
        if (y > 0) return rm === 0 ? `${y} yrs` : `${y}y ${rm}m`;
        return `${m} mths`; 
    },
    
    // --- CHART ENGINE ---
    renderChart: (rotationAngle = 0) => {
        const ctx = document.getElementById('chartCanvas');
        if (!ctx) return;
        
        if (window.myChart) window.myChart.destroy();
        
        const isAll = ProgressView.filter === 'All';
        const sliderContainer = document.getElementById('chartSliderContainer');
        const staticAgeIndicator = document.getElementById('staticAgeIndicator');
        const resetBtn = document.getElementById('resetSliderBtn');
        const containerDiv = document.getElementById('chartContainer');

        // Toggle Views
        if(isAll) { 
            sliderContainer.classList.remove('hidden'); 
            staticAgeIndicator.classList.remove('hidden');
            containerDiv.style.height = '24rem';
            ProgressView.resetSlider(); // Initial position
        } else { 
            sliderContainer.classList.add('hidden'); 
            staticAgeIndicator.classList.add('hidden');
            containerDiv.style.height = '12rem'; 
        }

        if (isAll) {
            // RADAR (Using History Data)
            // Last entry is "Current"
            const lastEntry = ProgressView.historyData[ProgressView.historyData.length - 1];
            const data = Object.keys(CONFIG.DOMAINS).map(d => (lastEntry[d] || 0) + 10);
            const labels = Object.keys(CONFIG.DOMAINS).map(k => ProgressView.DOMAIN_ICONS[k]);

            window.myChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: 'rgba(16, 185, 129, 0.3)', borderColor: '#10b981',
                        pointRadius: 0, borderWidth: 3, tension: 0.2, fill: true,
                        pointBackgroundColor: '#10b981', pointBorderColor: 'white'
                    }]
                },
                options: {
                    scales: {
                        r: { 
                            beginAtZero: true, min: 10, max: 180, ticks: { display: false }, 
                            grid: { display: false }, angleLines: { display: false },
                            pointLabels: { font: { size: 24, family: "'Font Awesome 6 Free'", weight: 900 }, color: '#64748b' }
                        }
                    },
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false, animation: { duration: 300 },
                    elements: { line: { tension: 0.2 } }, 
                    layout: { startAngle: rotationAngle }
                }
            });
        } else {
            // LINE CHART
            const domainCode = ProgressView.filter;
            const history = ProgressView.historyData.filter(h => h.date !== 'Birth');
            
            const scores = history.map(h => h[domainCode] || 0);
            const labels = history.map(h => h.date.split(' ')[0]); // Simple date for now

            // Simple Projection
            const lastScore = scores[scores.length - 1] || 0;
            const projected = [...scores, lastScore + 5, lastScore + 10].map(s => Math.min(s, ProgressView.MAX_TOTAL_SCORE));
            const actualData = [...scores, null, null];
            const allLabels = [...labels, "Next", "Future"];

            window.myChart = new Chart(ctx, { 
                type: 'line',
                data: {
                    labels: allLabels,
                    datasets: [
                        {
                            label: "Actual",
                            data: actualData, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: 'origin', tension: 0.4, pointRadius: 3, pointBackgroundColor: '#10b981', borderWidth: 3
                        },
                        {
                            label: "Projected",
                            data: projected, borderColor: '#cbd5e1', borderDash: [5, 5],
                            backgroundColor: 'transparent', fill: false, tension: 0.4, pointRadius: 0, borderWidth: 2
                        }
                    ]
                },
                options: {
                    scales: {
                        x: { display: true, grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true } },
                        y: { beginAtZero: true, max: ProgressView.MAX_TOTAL_SCORE + 10, grid: { color: '#e2e8f0' }, title: { display: false } }
                    },
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                    layout: { padding: { top: 10, bottom: 0, left: 0, right: 10 } }
                }
            });
        }
        
        if(isAll) {
             const slider = document.getElementById('timeSlider');
             if(slider) ProgressView.updateSlider(slider.value);
        }
    },

    updateSlider: (val) => {
        // ... (Copy exact slider logic from Preview, swapping MOCK vars for STATE vars) ...
        const percent = parseInt(val);
        if (!window.myChart || ProgressView.filter !== 'All') return;

        const keys = Object.keys(CONFIG.DOMAINS);
        const history = ProgressView.historyData;
        const maxIndex = history.length - 1;
        
        // Calculate Age
        const targetAgeMonths = (percent / 100) * ProgressView.PROGRAM_DURATION_MONTHS;
        
        // Current Age Logic
        const dob = new Date(STATE.child.dob);
        const today = new Date();
        let currentAge = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
        
        // Marker UI Updates
        const isAtNow = Math.abs(targetAgeMonths - currentAge) < 0.1;
        const isBirth = targetAgeMonths < 0.1;
        
        const staticInd = document.getElementById('staticAgeIndicator');
        const resetBtn = document.getElementById('resetSliderBtn');
        const nowLine = document.getElementById('nowMarkerLine');
        
        const nowPercent = (currentAge / ProgressView.PROGRAM_DURATION_MONTHS) * 100;
        if(nowLine) {
            nowLine.style.left = `${nowPercent}%`;
            nowLine.classList.remove('hidden');
        }

        if (isAtNow) {
            staticInd.innerHTML = `<p class="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Today</p><p class="text-xs font-bold text-emerald-600 leading-none">${ProgressView.getAgeInMonthsDisplay(currentAge)}</p>`;
            resetBtn.classList.add('reset-hidden');
        } else {
            staticInd.innerHTML = `<p class="text-xs font-bold text-slate-400 leading-none">${ProgressView.getAgeInMonthsDisplay(targetAgeMonths)}</p>`;
            resetBtn.classList.remove('reset-hidden');
            
            // Calc Reset Button Pos
            const wrapper = document.getElementById('sliderControlsWrapper');
            const thumbLeft = (percent / 100) * wrapper.offsetWidth;
            
            if (percent > nowPercent) {
                resetBtn.style.left = `${thumbLeft - 30}px`;
            } else {
                resetBtn.style.left = `${thumbLeft + 20}px`;
            }
        }
        
        // Interpolation
        let newData = [];
        let shapeAlpha = 1.0;
        
        if (targetAgeMonths <= currentAge) {
             const ageRatio = targetAgeMonths / currentAge;
             const fracIndex = ageRatio * maxIndex;
             const idx1 = Math.floor(fracIndex);
             const idx2 = Math.min(maxIndex, Math.ceil(fracIndex));
             const blend = fracIndex - idx1;
             
             const e1 = history[idx1];
             const e2 = history[idx2];
             
             newData = keys.map(k => {
                 const s1 = (Number(e1[k])||0) + 10;
                 const s2 = (Number(e2[k])||0) + 10;
                 return s1 + (s2 - s1) * blend;
             });
             
             window.myChart.data.datasets[0].borderColor = '#10b981';
             
             if (isBirth) { 
                 window.myChart.data.datasets[0].pointRadius = 8; 
                 window.myChart.data.datasets[0].borderWidth = 0;
                 shapeAlpha = 0;
             } else {
                 window.myChart.data.datasets[0].pointRadius = 0; 
                 window.myChart.data.datasets[0].borderWidth = 3;
             }
             window.myChart.data.datasets[0].backgroundColor = `rgba(16, 185, 129, ${shapeAlpha * 0.3})`;
             
        } else {
             // Projection
             const timeRemaining = ProgressView.PROGRAM_DURATION_MONTHS - currentAge;
             const timeElapsed = targetAgeMonths - currentAge;
             const ratio = timeElapsed / timeRemaining;
             
             const currentEntry = history[maxIndex];
             
             newData = keys.map(k => {
                 const base = Number(currentEntry[k]) || 0;
                 const projected = Math.min(ProgressView.MAX_TOTAL_SCORE, base * 1.5);
                 const start = base + 10;
                 const end = projected + 10;
                 return start + (end - start) * ratio;
             });
             
             window.myChart.data.datasets[0].borderColor = '#cbd5e1';
             window.myChart.data.datasets[0].backgroundColor = 'rgba(203, 213, 225, 0.3)';
             window.myChart.data.datasets[0].pointRadius = 0;
             window.myChart.data.datasets[0].borderWidth = 3;
        }
        
        window.myChart.data.datasets[0].data = newData;
        window.myChart.update('none');
    },

    renderMatrix: () => {
        const c = document.getElementById('matrixContainer');
        c.innerHTML = "";

        if (ProgressView.filter === 'All') {
            c.innerHTML = `<div class="text-center text-slate-400 py-12 text-sm bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col items-center"><i class="fa-solid fa-layer-group text-3xl mb-3 text-slate-200"></i><p>Select a specific Domain above<br>to view and update milestones.</p></div>`;
            return;
        }

        const items = STATE.library.filter(m => {
            const prefix = m.id.split('-')[0];
            return prefix === ProgressView.filter;
        });
        
        const grouped = Utils.groupLibrary(items);

        Object.keys(grouped).forEach(age => {
             let rows = "";
             grouped[age].forEach(m => {
                 const score = ProgressView.changes[m.id] !== undefined ? ProgressView.changes[m.id] : (ProgressView.currentMatrix[m.id] || 0);
                 const label = TXT.CORE.SCORES[score];
                 const badgeClass = `level-${score}`;
                 
                 rows += `<div class="bg-white border border-slate-100 rounded-xl overflow-hidden mb-2 shadow-sm group">
                    <div onclick="ProgressView.toggleRow('${m.id}')" class="p-4 flex justify-between items-center gap-3 cursor-pointer">
                        <div class="flex-1"><p class="text-sm font-bold text-slate-700 leading-snug">${m.desc}</p></div>
                        <div class="shrink-0"><span class="text-[10px] font-bold px-3 py-1.5 rounded-full border ${badgeClass} uppercase tracking-wider">${label}</span></div>
                    </div>
                    <div id="editor-${m.id}" class="hidden bg-slate-50 p-3 border-t border-slate-100 grid grid-cols-5 gap-1">
                         ${[0,1,2,3,4].map(s => `<button onclick="ProgressView.rate('${m.id}', ${s})" class="p-2 rounded-lg border text-[10px] font-bold transition bg-white">${s===0?'-':TXT.CORE.SCORES[s].substring(0,3)}</button>`).join('')}
                    </div>
                 </div>`;
             });
             c.innerHTML += `<div class="mb-6"><h4 class="text-xs font-bold text-slate-400 uppercase mb-3 ml-1 sticky top-14 z-10 bg-slate-50/95 backdrop-blur py-2 w-full">${age}</h4>${rows}</div>`;
        });
    },

    toggleRow: (id) => document.getElementById('editor-'+id).classList.toggle('hidden'),
    
    rate: (id, score) => {
        ProgressView.changes[id] = score;
        ProgressView.renderMatrix();
        // Update Save Button visibility
        const count = Object.keys(ProgressView.changes).length;
        const btn = document.getElementById('saveFloat');
        if(count > 0) {
             btn.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
             document.getElementById('changeCount').innerText = count;
        } else {
             btn.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
        }
    },

    save: async () => {
        const updates = Object.keys(ProgressView.changes).map(id => ({ id, score: ProgressView.changes[id] }));
        if(updates.length === 0) return;

        const btn = document.querySelector('#saveFloat button');
        const old = btn.innerHTML;
        btn.innerHTML = `<span class="flex items-center gap-2"><i class="fa-solid fa-check"></i> Saved!</span>`;
        btn.classList.add('bg-emerald-600');
        
        await API.logBulkUpdate(STATE.child.childId, updates, ""); 

        setTimeout(() => {
             ProgressView.changes = {};
             // Refresh Data
             ProgressView.render();
             btn.innerHTML = old;
             btn.classList.remove('bg-emerald-600');
        }, 1000);
    }
};
