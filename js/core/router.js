const Router = {
    navigate: (v) => {
        document.querySelectorAll('.view-section').forEach(el=>el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(el=>el.className='tab-btn py-3 tab-inactive w-1/2');
        document.getElementById('view-'+v).classList.remove('hidden');
        document.getElementById('nav-'+v).className='tab-btn py-3 tab-active w-1/2';
        if(v==='feed') FeedView.render();
        if(v==='progress') ProgressView.render();
    }
};
