const form = document.querySelector('.btn-logout');
form.addEventListener('click', async (event) => {
    try {
        const reponse = await fetch('/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        const result = await reponse.json();

        if (result.success) {
            window.location.href = "/";
        } else {
            showAlert("Erreur : " + result.message, "danger");
        }
    } catch (error) {
        console.error("Erreur serveur", error);
        alert("Impossible de se connecter pour le moment");
    }
});