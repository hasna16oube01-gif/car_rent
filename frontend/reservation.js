// 1. Récupérer l'ID dans l'URL (ex: reservation.html?id=5)
const params = new URLSearchParams(window.location.search);
const idVehicule = params.get('id');

async function initPage() {
    // 2. Appeler votre route GET /:id_vehicule
    const response = await fetch(`/api/reservations/${idVehicule}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();

    if (data.reservation && data.paymentInfo?.status === "initie") {
        // ÉTAT A : Une réservation est déjà en cours, on montre le paiement
        afficherSectionPaiement(data);
    } else {
        // ÉTAT B : Pas de réservation en cours, on montre le formulaire
        afficherSectionReservation();
    }
}

// Lancer au chargement
initPage();