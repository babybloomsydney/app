const CONFIG = {
    // *** 2.5.1.4 ***
    API_URL: "https://script.google.com/macros/s/AKfycbyW8IbwO8ZWEYmAyojBLGzrbjjNcirQJIjJIgnAO2uH6lAoRKjfX0w4Mk6TbQnoPx6T/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
