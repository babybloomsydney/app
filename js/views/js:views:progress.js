const ProgressView = {
    render: async () => {
        const res = await API.fetchStats(STATE.child.childId);
        if(res.status==="success") {
            const d = Utils.prepChart(res.data.stats);
            const ctx = document.getElementById('radarChart');
            if(window.myRadar) window.myRadar.destroy();
            window.myRadar = new Chart(ctx,{type:'radar',data:{labels:d.labels,datasets:[{label:'Mastery',data:d.values,backgroundColor:'rgba(16,185,129,0.2)',borderColor:'#10b981'}]},options:{scales:{r:{beginAtZero:true,max:100,ticks:{display:false}}},plugins:{legend:{display:false}}}});
        }
    }
};