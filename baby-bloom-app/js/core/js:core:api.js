async function sendRequest(payload) {
    try { const r=await fetch(CONFIG.API_URL,{redirect:"follow",method:'POST',headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)}); return await r.json(); } catch(e){return{status:"error"};}
}
const API = {
    fetchChildren:async()=>sendRequest({action:"getUserChildren",userId:STATE.user.id,userType:STATE.user.role}),
    fetchLibrary:async()=>STATE.library.length>0?{status:"success",data:STATE.library}:sendRequest({action:"getMilestoneLibrary"}),
    fetchFeed:async(id)=>sendRequest({action:"getFeed",childId:id}),
    fetchStats:async(id)=>sendRequest({action:"getDashboardData",childId:id}),
    generatePlan:async(id,obj)=>sendRequest({action:"generateActivity",childId:id,objectives:obj,authorId:STATE.user.id}),
    submitReport:async(id,act,rate,note)=>sendRequest({action:"submitActivityReport",childId:id,activityId:act,ratings:rate,feedback:note,authorId:STATE.user.id}),
    logObservation:async(id,dom,mid,sc,note)=>sendRequest({action:"logAdHocObservation",childId:id,domain:dom,milestoneId:mid,score:sc,note:note,authorId:STATE.user.id})
};