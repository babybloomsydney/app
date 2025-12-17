document.addEventListener("DOMContentLoaded", () => {
    if(STATE.user.id) App.init();
    else document.getElementById('loginModal').classList.remove('hidden');
});

const App = {
    init: async () => {
        Modals.close();
        const res = await API.fetchChildren();
        if(res.status==="success" && res.data.length>0) {
            STATE.child = res.data[0];
            document.getElementById('childNameTitle').innerText = STATE.child.firstName;
            document.getElementById('childAvatar').innerText = STATE.child.firstName.charAt(0);
            Router.navigate('feed');
        }
        API.fetchLibrary().then(res=>{if(res.status==="success"){STATE.library=res.data;Modals.renderAccordion();Modals.initLog();}});
    },
    login: () => {
        const id=document.getElementById('loginId').value;
        if(id){localStorage.setItem('bb_uid',id);localStorage.setItem('bb_role',document.getElementById('loginRole').value);location.reload();}
    },
    logout: () => { localStorage.clear(); location.reload(); }
};
