const API_URL = "http://localhost:3000";
const urlParams = new URLSearchParams(window.location.search);
const idVehicule = urlParams.get('id'); // Passé via l'URL depuis reservation.html
const token = localStorage.getItem('token');

let reservationId = null;

// --- 1. Gestion de la Barre de Progression ---
function updateProgressBar() {
    const inputs = document.querySelectorAll('.pay-input');
    const progressBar = document.getElementById('progress-bar');
    
    let filledFields = 0;
    inputs.forEach(input => {
        if (input.value.trim().length > 0) filledFields++;
    });

    const percentage = (filledFields / inputs.length) * 100;
    progressBar.style.width = percentage + "%";
}

// Ajouter l'écouteur sur chaque champ
document.querySelectorAll('.pay-input').forEach(input => {
    input.addEventListener('input', updateProgressBar);
});

// --- 2. Initialisation et Compteur ---
async function init() {
    if (!idVehicule) return alert("ID véhicule manquant dans l'URL");

    try {
        const response = await fetch(`${API_URL}/frontend/reservations/${reservationId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (!data.reservation) {
            alert("Aucune réservation trouvée.");
            window.location.href = "vehicules.html";
            return;
        }

        reservationId = data.reservation.id;
        document.getElementById('montant-a-payer').innerText = montant;

        // Lancer le compteur
        startCountdown(30 * 60 * 1000); // 30 min en millisecondes

    } catch (err) {
        console.error("Erreur d'initialisation", err);
    }
}

// --- 3. Confirmation finale ---
document.getElementById('confirm-payment-btn').addEventListener('click', async () => {
    // Vérifier si le formulaire est rempli
    const inputs = document.querySelectorAll('.pay-input');
    for (let input of inputs) {
        if (!input.value) return alert("Veuillez remplir tous les champs de la carte.");
    }

    const res = await fetch(`${API_URL}/reservations/confirm`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_reservation: reservationId })
    });

    if (res.ok) {
        alert("Paiement initié. Votre réservation est maintenant en attente de validation manuelle.");
        window.location.href = `succes.html?resId=${reservationId}`;
    } else {
        alert("Erreur lors de la confirmation.");
    }
});

init();

// Timer de 30min
const timerElement = document.getElementById('timer');
let totalSeconds = 30 * 60; // 30 minutes

const interval = setInterval(() => {
    if (totalSeconds < 0) {
        clearInterval(interval);
        alert("Temps expiré !");
        window.location.href = "vehicules.html";
        return;
    }

    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    timerElement.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
    totalSeconds--;
}, 1000);

