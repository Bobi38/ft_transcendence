function showAlert(message, type = "danger") {
    const container = document.getElementById("alert-container");
    console.log(container); 
    const alertDiv = document.createElement("div");
    alertDiv.className = type === "danger" ? "alert-n-danger" : "alert-n-success";
    alertDiv.textContent = message;
    container.appendChild(alertDiv);
    setTimeout(() => {
        container.removeChild(alertDiv);
    }, 1000);
}

class HistoryChat{
    constructor(){
        this.History = "";
    }
    setHisto(text){
        this.History += text;
    }
    getHisto(){
        return this.History;
    }
}


export default async function checkCo(){
    try{
        const response = await fetch('/api/checkco', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        });

        const rep = await response.json();
        if (rep.success){
            return true;
        }
        else{
            return false;
        }
    }
    catch(err){
        console.log("Error in checkCo function:", err);
        return false;
    }
}


export const HistoryC = new HistoryChat();
export { showAlert };
// export let HistoryChat = "";