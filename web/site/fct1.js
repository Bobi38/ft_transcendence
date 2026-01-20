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

export { showAlert };