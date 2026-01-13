const API_URL = "http://localhost:3000";

// --- GESTION DU CARROUSEL HERO ---
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

// Auto-play du carrousel hero
setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}, 5000);

// Clic sur les indicateurs
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// --- GESTION DES TABS VÉHICULES EN VEDETTE ---
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadFeaturedVehicles(btn.dataset.tab);
    });
});

// --- CHARGEMENT DES VÉHICULES EN VEDETTE ---
async function loadFeaturedVehicles(type = 'all') {
    const container = document.getElementById('featured-vehicles');
    container.innerHTML = '<div class="loading-message">Chargement des véhicules...</div>';

    try {
        // Pour la page d'accueil, on peut charger sans token ou avec un token optionnel
        // Si pas de token, on affiche des véhicules de démo ou on redirige vers login
        const token = localStorage.getItem('token');
        
        if (!token) {
            // Mode démo - afficher des véhicules statiques
            displayDemoVehicles(container);
            return;
        }

        const response = await fetch(`${API_URL}/vehicules/available`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.status === 403) {
            displayDemoVehicles(container);
            return;
        }

        const vehicules = await response.json();
        displayFeaturedVehicles(vehicules, container, type);
    } catch (error) {
        console.error("Erreur lors du chargement:", error);
        displayDemoVehicles(container);
    }
}

function displayDemoVehicles(container) {
    const demoVehicles = [
        {
            id: 1,
            marque: "Audi",
            modele: "A4",
            prix_par_jour: 450,
            image_url: "vehicules/AUDI.png",
            disponible: 1
        },
        {
            id: 2,
            marque: "BMW",
            modele: "Série 3",
            prix_par_jour: 500,
            image_url: "vehicules/5.png",
            disponible: 1
        },
        {
            id: 3,
            marque: "Mercedes",
            modele: "Classe C",
            prix_par_jour: 480,
            image_url: "vehicules/clio.png",
            disponible: 1
        },
        {
            id: 4,
            marque: "Volkswagen",
            modele: "Golf",
            prix_par_jour: 350,
            image_url: "vehicules/clio 4.png",
            disponible: 1
        }
    ];
    displayFeaturedVehicles(demoVehicles, container, 'all');
}

function displayFeaturedVehicles(vehicules, container, type) {
    container.innerHTML = '';

    // Filtrer selon le type si nécessaire
    let filteredVehicles = vehicules;
    if (type === 'new') {
        // Logique pour nouveaux véhicules (vous pouvez ajouter un champ 'type' dans votre modèle)
        filteredVehicles = vehicules.slice(0, Math.ceil(vehicules.length / 2));
    } else if (type === 'used') {
        filteredVehicles = vehicules.slice(Math.ceil(vehicules.length / 2));
    }

    // Limiter à 4 véhicules pour l'affichage
    filteredVehicles = filteredVehicles.slice(0, 4);

    if (filteredVehicles.length === 0) {
        container.innerHTML = '<div class="loading-message">Aucun véhicule disponible pour le moment.</div>';
        return;
    }

    const BASE_URL_IMAGES = "http://localhost:3000/uploads/";

    filteredVehicles.forEach(v => {
        const card = document.createElement('div');
        card.className = 'featured-vehicle-card';
        
        const imgPath = v.image_url ? `${BASE_URL_IMAGES}${v.image_url}` : 'https://via.placeholder.com/400x200?text=Voiture';
        const statusClass = type === 'new' ? 'new' : 'used';
        const statusText = type === 'new' ? 'Nouveau' : 'Occasion';
        const isDispo = v.disponible === 1;

        card.innerHTML = `
            <img src="${imgPath}" alt="${v.marque} ${v.modele}" class="featured-vehicle-image" onerror="this.src='https://via.placeholder.com/400x200?text=Image+Non+Disponible'">
            <div class="featured-vehicle-content">
                <h3 class="featured-vehicle-title">${v.marque} ${v.modele}</h3>
                <span class="featured-vehicle-status ${statusClass}">${statusText}</span>
                <p class="featured-vehicle-price">${v.prix_par_jour} MAD / jour</p>
                <a href="${isDispo ? 'login.html' : '#'}" class="btn-buy-now">
                    ${isDispo ? 'Réserver maintenant' : 'Indisponible'}
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- CHARGEMENT INITIAL ---
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedVehicles('all');
});

// --- NAVIGATION DES VÉHICULES AVEC FLÈCHES ---
function scrollVehicles(direction) {
    const container = document.getElementById('featured-vehicles');
    if (!container) return;
    
    const scrollAmount = 300; // Pixels à scroller
    const currentScroll = container.scrollLeft;
    const newScroll = currentScroll + (scrollAmount * direction);
    
    container.scrollTo({
        left: newScroll,
        behavior: 'smooth'
    });
}

// --- SMOOTH SCROLL POUR LES ANCRES ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
