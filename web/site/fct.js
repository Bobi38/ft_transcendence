function showAlert(message, type = "danger") {
    const container = document.getElementById("alert-container");
    console.log(container); 

    // Crée un div
    const alertDiv = document.createElement("div");
    alertDiv.className = type === "danger" ? "alert-n-danger" : "alert-n-success";
    alertDiv.textContent = message;

    // Ajoute le div dans le container
    container.appendChild(alertDiv);

    // Supprime l'alerte après 5 secondes
    setTimeout(() => {
        container.removeChild(alertDiv);
    }, 5000);
}

export { showAlert };
