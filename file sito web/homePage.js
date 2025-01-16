// Mostro il carosello 
function showCarosell() {
    document.getElementById('carosell').style.display = 'block';
}

// Ogni volta che la pagina viene caricata controllo che l'utente sia loggato
function checkIfUserLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    const loginLink = document.getElementById('login');
    const registerLink = document.getElementById('register');

    // Riferimento al contenitore degli elementi di navigazione 
    const navItems = loginLink?.parentElement?.parentElement;  

    if (isLoggedIn === 'true') {
        // Se l'utente è loggato, rimuovo i link di login e registrazione
        loginLink.parentElement.remove();
        registerLink.parentElement.remove();
        
        // Aggiungo i link alla barra di navigazione
        // 1) Link "Yourself" per modificare il profilo
        const editProfile = document.createElement('li');
        editProfile.classList.add('nav-item');

        const editProfileLink = document.createElement('a');
        editProfileLink.href = "editProfile.html";  
        editProfileLink.classList.add('nav-link', 'd-flex', 'align-items-center');
        editProfileLink.id = 'editProfile';

        const editrecipeBookIcon = document.createElement('i');
        editrecipeBookIcon.classList.add('bi', 'bi-person', 'me-2');

        editProfileLink.appendChild(editrecipeBookIcon);
        editProfileLink.appendChild(document.createTextNode('Yourself'));
        editProfile.appendChild(editProfileLink);

        // 2) Link "Recipe book" per visualizzare il libro delle ricette
        const recipeBookItem = document.createElement('li');
        recipeBookItem.classList.add('nav-item', 'ms-3');

        const profileLink = document.createElement('a');
        profileLink.href = "recipeBook.html";  
        profileLink.classList.add('nav-link', 'd-flex', 'align-items-center');
        profileLink.id = 'recipeBook';

        const recipeBookIcon = document.createElement('i');
        recipeBookIcon.classList.add('bi', 'bi-book', 'me-2');

        profileLink.appendChild(recipeBookIcon);
        profileLink.appendChild(document.createTextNode('Recipe book'));
        recipeBookItem.appendChild(profileLink);

        // 3) Link "Logout" per scollegarsi
        const logoutItem = document.createElement('li');
        logoutItem.classList.add('nav-item', 'ms-3');  

        const logoutLink = document.createElement('a');
        logoutLink.href = "#";
        logoutLink.classList.add('nav-link', 'd-flex', 'align-items-center');
        logoutLink.id = 'logout';

        const logoutIcon = document.createElement('i');
        logoutIcon.classList.add('bi', 'bi-box-arrow-right', 'me-2');  

        logoutLink.appendChild(logoutIcon);
        logoutLink.appendChild(document.createTextNode('Logout'));
        logoutItem.appendChild(logoutLink);

        // Aggiungo gli elementi alla barra di navigazione
        navItems.appendChild(editProfile);
        navItems.appendChild(recipeBookItem);
        navItems.appendChild(logoutItem);

        // Aggiungo un listener per il logout
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loggedInUser');
            alert('Sei stato scollegato con successo!');
            location.reload();
        });
    }
}

// Funzione per ottenere un elenco di immagini uniche per il carosello
async function fetchCarouselImages() {
    const API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
    const uniqueMeals = [];
    const uniqueIds = new Set();

    // Raccolgo un set di 15 pasti unici senza duplicati
    while (uniqueMeals.length < 15) {
        try {
            const res = await fetch(API_URL);
            const jsonData = await res.json();
            const mealData = jsonData.meals[0];

            // Se l'id del pasto non è già presente, lo aggiungo alla lista
            if (!uniqueIds.has(mealData.idMeal)) {
                uniqueMeals.push(mealData);
                uniqueIds.add(mealData.idMeal);
            }
        } catch (error) {
            console.error("Errore durante il recupero dei pasti:", error);
        }
    }

    return uniqueMeals;
}


// Funzione per creare il carosello
async function generateCarousel() {
    let mealsData = await fetchCarouselImages();
    let carouselContainer = document.getElementById("carousel-items");

    // Ciclo per creare le singole sezioni del carosello
    for (let i = 0; i < mealsData.length; i += 3) {
        let carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        
        // La prima sezione del carosello diventa attiva
        if (i === 0) carouselItem.classList.add("active");

        // Impostazione del tempo di transizione tra le immagini
        carouselItem.setAttribute("data-bs-interval", "4000");

        // Creazione del contenitore per le card
        let cardWrapper = document.createElement("div");
        cardWrapper.classList.add("card-container", "d-flex", "justify-content-center");

        // Ciclo per generare le card con i dettagli dei pasti
        for (let j = i; j < i + 3 && j < mealsData.length; j++) {
            let cardElement = document.createElement("div");
            cardElement.classList.add("card", "bg-custom-1");

            // Immagine del pasto
            let mealImage = document.createElement("img");
            mealImage.classList.add("card-img-top");
            mealImage.src = mealsData[j]["strMealThumb"];
            mealImage.alt = mealsData[j]["strMeal"];
            cardElement.appendChild(mealImage);

            // Corpo della card con i dettagli
            let cardBodyContent = document.createElement("div");
            cardBodyContent.classList.add("card-body");

            // Titolo del pasto
            let mealTitle = document.createElement("h5");
            mealTitle.classList.add("card-title");
            mealTitle.innerText = mealsData[j]["strMeal"];
            cardBodyContent.appendChild(mealTitle);

            // Categoria del pasto
            let mealCategory = document.createElement("p");
            mealCategory.innerText = "Category: " + mealsData[j]["strCategory"];
            cardBodyContent.appendChild(mealCategory);

            // Link per visualizzare la ricetta
            let recipeLink = document.createElement("a");
            recipeLink.href = "recipeDetails.html?id=" + mealsData[j]["idMeal"];
            recipeLink.classList.add("btn", "btn-primary");
            recipeLink.innerText = "View Recipe";
            cardBodyContent.appendChild(recipeLink);

            // Aggiunta della card al contenitore
            cardElement.appendChild(cardBodyContent);
            cardWrapper.appendChild(cardElement);
        }

        // Aggiunta del contenitore delle card al carosello
        carouselItem.appendChild(cardWrapper);
        carouselContainer.appendChild(carouselItem);
    }
}

// Carico le cateogorie delle ricette 
function fetchCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
        .then(response => response.json())
        .then(data => {
            const categoriesContainer = document.getElementById('categories');
            if (!categoriesContainer) {
                console.error("Element with id 'categoriesContainer' not found.");
                return;
            }
            categoriesContainer.innerHTML = '';  // Resetta la lista delle categorie

            data.meals.forEach(categoria => {
                let listItem = document.createElement('li');
                listItem.classList.add('nav-item', 'mx-2');
                listItem.innerHTML = `
                    <a class="nav-link" href="#" data-category="${categoria.strCategory}">
                        ${categoria.strCategory}
                    </a>
                `;
                categoriesContainer.appendChild(listItem);
            });

            // Aggiungi un listener per le categorie
            document.querySelectorAll('.nav-link').forEach(item => {
                item.addEventListener('click', function (event) {
                    // Non fare nulla se è uno dei seguenti link
                    if (this.id === 'login' || this.id === 'register' || this.id === 'recipeBook' || this.id === 'editProfile' || this.id === 'logout') {
                        return; 
                    }
            
                    event.preventDefault();
                    const categoria = this.getAttribute('data-category');

                    // Esegui la ricerca per categoria
                    searchByCategory(categoria);  
                });
            });
            
        })
        .catch(error => console.log('Error loading categories:', error));
}

// Ricerca per categoria delle ricette 
function searchByCategory(categoria) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`)
        .then(response => response.json())
        .then(data => {
            // Nascondi il carosello
            document.getElementById('carosell').style.display = 'none';

            // Visualizza i risultati della ricerca
            const searchRes = document.getElementById('searchRes');
            if (!searchRes) {
                console.error("Element with id 'searchRes' not found.");
                return;
            }
            searchRes.innerHTML = '';  // Resetta i risultati di ricerca

            if (!data.meals || data.meals.length === 0) {
                searchRes.innerHTML = '<p>No recipes found for this category.</p>';
                return;
            }

            data.meals.forEach(meal => {
                let mealDiv = document.createElement('div');
                mealDiv.className = 'col-md-4 mb-3';
                mealDiv.innerHTML = `
                    <div class="card">
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                        <div class="card-body">
                            <h5 class="card-title">${meal.strMeal}</h5>
                            <a href="recipeDetails.html?id=${meal.idMeal}" class="btn btn-primary">View Recipe</a>
                        </div>
                    </div>
                `;
                searchRes.appendChild(mealDiv);
            });
        })
        .catch(error => console.log('Error in category search:', error));
}

// Ricerca per nome delle ricette
function searchByName(query) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            // Nascondo il carosello per fare spazio a risultati di ricerca 
            document.getElementById('carosell').style.display = 'none';

            const searchRes = document.getElementById('searchRes');
            if (!searchRes) {
                console.error("Element with id 'searchRes' not found.");
                return;
            }

            // Resetto risultati per nuova ricerca
            searchRes.innerHTML = '';
 
            if (!data.meals || data.meals.length === 0) {
                searchRes.innerHTML = '<p>Nessuna ricetta trovata per questo nome.</p>';
                return;
            }

            data.meals.forEach(meal => {
                let mealDiv = document.createElement('div');
                mealDiv.className = 'col-md-4 mb-3';
                mealDiv.innerHTML = `
                    <div class="card">
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                        <div class="card-body">
                            <h5 class="card-title">${meal.strMeal}</h5>
                             <a href="recipeDetails.html?id=${meal.idMeal}" class="btn btn-primary">Vedi Ricetta</a>
                        </div>
                    </div>
                `;
                searchRes.appendChild(mealDiv);
            });
        })
        .catch(error => console.log('Errore nella ricerca per nome:', error));
}

// Ricerca per iniziale delle ricette
function searchByInitial(initial) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${initial}`)
        .then(response => response.json())
        .then(data => {
            // Nascondo il carosello per fare spazio ai risultati di ricerca
            document.getElementById('carosell').style.display = 'none';

            const searchRes = document.getElementById('searchRes');
            if (!searchRes) {
                console.error("Element with id 'searchRes' not found.");
                return;
            }

            // Resetto risultati per nuova ricerca
            searchRes.innerHTML = '';

            if (!data.meals || data.meals.length === 0) {
                searchRes.innerHTML = '<p>Nessuna ricetta trovata per questa iniziale.</p>';
                return;
            }

            data.meals.forEach(meal => {
                let mealDiv = document.createElement('div');
                mealDiv.className = 'col-md-4 mb-3';
                mealDiv.innerHTML = `
                    <div class="card">
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                        <div class="card-body">
                            <h5 class="card-title">${meal.strMeal}</h5>
                            <a href="recipeDetails.html?id=${meal.idMeal}" class="btn btn-primary">Vedi Ricetta</a>
                        </div>
                    </div>
                `;
                searchRes.appendChild(mealDiv);
            });
        })
        .catch(error => console.log('Errore nella ricerca per iniziale:', error));
}

// Gestione della ricerca tramite il form 
document.getElementById('srcForm').addEventListener('submit', function(event) {
    event.preventDefault();  
    const searchInput = document.getElementById('searchBar').value.trim();

    if (searchInput.length === 1 && /^[a-zA-Z]$/.test(searchInput)) {
        searchByInitial(searchInput); // Ricerca per iniziale
    } else {
        searchByName(searchInput); // Ricerca per nome
    }
});

// Caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
    showCarosell();
    checkIfUserLoggedIn();
    generateCarousel();
    fetchCategories();  
});



