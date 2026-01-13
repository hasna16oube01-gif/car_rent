const API_URL = "http://localhost:3000"; // URL node


// --- LOGIQUE INSCRIPTION ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            nom_utilisateur: document.getElementById('reg_nom').value,
            email: document.getElementById('reg_email').value,
            mdp: document.getElementById('reg_mdp').value
        };

        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Compte créé ! Redirection vers la connexion...");
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // empêche le rechargement de la page

        const userData = {
            email: document.getElementById('email').value,
            mdp: document.getElementById('mdp').value
        };

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            // Essaye de parser la réponse JSON, sinon retourne un message générique
            const data = await response.json().catch(() => ({ message: "Erreur serveur" }));

            if (response.ok) {
                // Stocke le token pour les requêtes futures
                localStorage.setItem('token', data.token);

                alert("Connexion réussie !");
                // Redirection vers la page principale ou dashboard
                window.location.href = "vehicules.html";
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Impossible de contacter le serveur");
        }
    });
}
