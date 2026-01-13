const API_URL = "http://localhost:3000";

async function loadVehicules() {
    const token = localStorage.getItem('token');

    // Sécurité : si pas de token, retour au login
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/vehicules/available`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // INDISPENSABLE pour authUser
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "login.html";
            return;
        }

        const vehicules = await response.json();
        displayVehicules(vehicules);

    } catch (error) {
        console.error("Erreur:", error);
    }
}

function displayVehicules(vehicules) {
    const container = document.getElementById('vehiculeContainer');
    container.innerHTML = ''; 

    const BASE_URL_IMAGES = "http://localhost:3000/uploads/";

    vehicules.forEach(v => {
        const isDispo = v.disponible === 1;
        const card = document.createElement('div');
        card.className = 'vehicule-card';
        
        const imgPath = `${BASE_URL_IMAGES}${v.image_url}`;

        card.innerHTML = `
    <div class="vehicule-image-box">
        <img src="${BASE_URL_IMAGES}${v.image_url}" alt="${v.marque}">
    </div>

    <div class="vehicule-content">
        <h3>${v.marque} ${v.modele}</h3>
        <p class="price">${v.prix_par_jour}MAD / jour</p>
        <p class="status ${isDispo ? 'available' : 'busy'}">
            ${isDispo ? '✅ Disponible' : '❌ Occupé'}
        </p>
        <a href="reservation.html?id=${v.id_vehicule}" class="book-btn ${!isDispo ? 'disabled' : ''}">
            Réserver
        </a>
    </div>
`;
        container.appendChild(card);
    });
}
// Gestion de la déconnexion
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = "login.html";
});

loadVehicules();