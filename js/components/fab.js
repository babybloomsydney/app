const FAB = {
    toggle: () => {
        document.getElementById('fabMenu').classList.toggle('hidden');
        document.getElementById('fabBtn').classList.toggle('fab-active');
        const i = document.getElementById('fabIcon');
        i.className = i.className.includes('plus') ? "fa-solid fa-times" : "fa-solid fa-plus";
    },
    openPlan:()=>{FAB.toggle();Modals.open('plan');},
    openLog:()=>{FAB.toggle();Modals.open('log');}
};
