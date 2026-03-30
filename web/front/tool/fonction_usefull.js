export function showAlert(message, type = "danger") {
    const container = document.getElementById("alert-container");
    if (!container) return
    
    container.className = type === "danger" ? "danger" : "success";
    container.textContent = message;

    setTimeout(() => {
        container.textContent = "";
        container.className = "";
    }, 3000);
}


export default async function checkCo(){
    try{
        const response = await fetch('/api/secu/checkco', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        });

        const rep = await response.json();
        if (rep.success){
            console.log("checkCo(1) User is connected");
            return true;
        }
        else{
            console.log("checkCo(2) User is not connected");
            return false;
        }
        // le 3eme pour maila2f
    }
    catch(err){
        console.log("checkCo(3) Error in checkCo function:", err);
        return false;
    }
}
