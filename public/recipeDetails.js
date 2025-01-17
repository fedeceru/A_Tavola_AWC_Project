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
        editProfileLink.appendChild(document.createTextNode('Profile'));
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
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('loggedInUser');
            alert('Sei stato scollegato con successo!');
            location.reload();
        });
    }
}

// Funzione per ottenere i query params dall'URL della pagina  
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Funzione per ottenere i dettagli della ricetta tramite API
function fetchRecipeDetails() {
    const recipeId = getQueryParam('id');
    if (!recipeId) {
        document.getElementById('recipe-title').innerText = '   Recipe not found';
        return;
    }

    // Richiesta API per ottenere i dettagli della ricetta 
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];
                document.getElementById('recipe-title').innerText = meal.strMeal;
                document.getElementById('recipe-img').src = meal.strMealThumb;
                document.getElementById('recipe-instructions').innerText = meal.strInstructions;

                const ingredientsList = document.getElementById('recipe-ingredients');
                ingredientsList.innerHTML = '';

                // Aggiungi gli ingredienti alla lista
                for (let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    if (ingredient && ingredient.trim()) {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.innerText = `${measure} ${ingredient}`;
                        ingredientsList.appendChild(li);
                    }
                }
            } else {
                document.getElementById('recipe-title').innerText = 'Recipe not found';
            }
        })
        .catch(error => {
            console.error('Errore nel recupero della ricetta:', error);
            document.getElementById('recipe-title').innerText = 'Error loading recipe';
        });
}

// Funzione per salvare la ricetta nel localStorage
function saveRecipe() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        alert('You must be logged in to save a recipe.');
        return;
    }

    const recipeId = getQueryParam('id');
    const recipeTitle = document.getElementById('recipe-title').innerText;
    const recipeImg = document.getElementById('recipe-img').src;

    // Ottieni le ricette salvate dall'utente loggato
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const savedRecipesKey = `${loggedInUser.email}_savedRecipes`;  // Corretto l'uso delle variabili nel nome della chiave
    const savedRecipes = JSON.parse(localStorage.getItem(savedRecipesKey)) || [];

    // Controlla se la ricetta è già stata salvata
    const isAlreadySaved = savedRecipes.some(recipe => recipe.id === recipeId);
    if (isAlreadySaved) {
        alert('You have already saved this recipe.');
        return;
    }

    // Aggiungi la nuova ricetta alla lista
    savedRecipes.push({ id: recipeId, title: recipeTitle, img: recipeImg });
    localStorage.setItem(savedRecipesKey, JSON.stringify(savedRecipes));

    alert('Recipe successfully saved!');
}


// Aggiungi il listener al pulsante "Salva Ricetta"
document.getElementById('save-recipe-btn').addEventListener('click', saveRecipe);


// Funzione per mostrare le recensioni salvate
function loadReviews() {
    const recipeId = getQueryParam('id');
    const savedReviews = JSON.parse(localStorage.getItem(`${recipeId}_reviews`)) || [];

    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '';

    if (savedReviews.length === 0) {
        reviewsList.innerHTML = '<p class="text-muted">No reviews yet.</p>';
        return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    savedReviews.forEach((review, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');

        reviewItem.innerHTML = `
            <p><strong>Email:</strong> ${review.email}</p>
            <p><strong>Data:</strong> ${review.date}</p>
            <p><strong>Difficulty:</strong> <span class="review-stars">${'★'.repeat(review.difficulty)}</span> (${review.difficulty}/5)</p>
            <p><strong>Taste:</strong> <span class="review-stars">${'★'.repeat(review.taste)}</span> (${review.taste}/5)</p>
        `;

        // Aggiungi bottone "Elimina" solo per l'utente loggato
        if (loggedInUser && loggedInUser.email === review.email) {
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-review-btn');
            deleteButton.textContent = 'Delete Review';
            deleteButton.addEventListener('click', function() {
                deleteReview(index);
            });
            reviewItem.appendChild(deleteButton);
        }

        reviewsList.appendChild(reviewItem);
    });
}

// Funzione per eliminare una recensione
function deleteReview(reviewIndex) {
    const recipeId = getQueryParam('id');
    let savedReviews = JSON.parse(localStorage.getItem(`${recipeId}_reviews`)) || [];

    // Rimuovi la recensione dall'array
    savedReviews.splice(reviewIndex, 1);

    // Salva di nuovo le recensioni aggiornate
    localStorage.setItem(`${recipeId}_reviews`, JSON.stringify(savedReviews));

    // Ricarica le recensioni
    loadReviews();
}


// Funzione per aggiungere una nuova recensione
function addReview(event) {
    event.preventDefault();

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        alert('You must be logged in to leave a review.');
        return;
    }

    const recipeId = getQueryParam('id');
    const reviewDate = document.getElementById('review-date').value;
    const reviewDifficulty = document.getElementById('review-difficulty-value').value;
    const reviewTaste = document.getElementById('review-taste-value').value;
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userObject = JSON.parse(loggedInUser);
    const loggedInUserEmail = userObject.email;

    if (!reviewDate || !reviewDifficulty || !reviewTaste) {
        alert('Please fill in all fields in the review.');
        return;
    }

    const newReview = {
        date: reviewDate,
        difficulty: parseInt(reviewDifficulty),
        taste: parseInt(reviewTaste),
        email: loggedInUserEmail
    };

    const savedReviews = JSON.parse(localStorage.getItem(`${recipeId}_reviews`)) || [];
    savedReviews.push(newReview);
    localStorage.setItem(`${recipeId}_reviews`, JSON.stringify(savedReviews));

    loadReviews();
    document.getElementById('review-form').reset();
    alert('Review successfully added!');
}




// Listener per il form di aggiunta recensioni
document.getElementById('review-form').addEventListener('submit', addReview);

// Listener per il form di aggiunta recensioni
document.addEventListener('DOMContentLoaded', function() {
    function handleStarClick(starsContainer, inputFieldId) {
        const stars = starsContainer.querySelectorAll('i');
        const inputField = document.getElementById(inputFieldId);

        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(star.getAttribute('data-value'));
                inputField.value = value;
                updateStars(stars, value);
            });

            star.addEventListener('mouseover', function() {
                const value = parseInt(star.getAttribute('data-value'));
                updateStars(stars, value);
            });

            star.addEventListener('mouseout', function() {
                const selectedValue = parseInt(inputField.value) || 0;
                updateStars(stars, selectedValue);
            });
        });
    }
    

    // Funzione per aggiornare l'illuminazione delle stelle
    function updateStars(stars, value) {
        stars.forEach(star => {
            if (parseInt(star.getAttribute('data-value')) <= value) {
                star.classList.remove('bi-star');
                star.classList.add('bi-star-fill');
            } else {
                star.classList.remove('bi-star-fill');
                star.classList.add('bi-star');
            }
        });
    }

    handleStarClick(document.getElementById('review-difficulty'), 'review-difficulty-value');
    handleStarClick(document.getElementById('review-taste'), 'review-taste-value');
});

// Funzione per caricare la nota salvata
function loadNote() {
    const recipeId = getQueryParam('id');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (!loggedInUser) {
        alert('You must be logged in to view your notes.');
        return;
    }

    const noteKey = `${loggedInUser.email}_${recipeId}_note`;
    const savedNote = localStorage.getItem(noteKey);

    if (savedNote) {
        document.getElementById('recipe-note').value = savedNote;
    }
}

// Funzione per salvare la nota
function saveNote() {
    const recipeId = getQueryParam('id');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('You must be logged in to save your notes.');
        return;
    }

    const note = document.getElementById('recipe-note').value;

    // Controllo se la nota è vuota
    if (!note.trim()) {
        alert('Please write a note before saving.');
        return;
    }

    // Salva la nota associata all'utente loggato e alla ricetta corrente
    const noteKey = `${loggedInUser.email}_${recipeId}_note`;
    localStorage.setItem(noteKey, note);

    alert('Note successfully saved!');
}

// Aggiungi il listener al pulsante "Salva Nota"
document.getElementById('save-note-btn').addEventListener('click', saveNote);

// Caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
    checkIfUserLoggedIn();
    fetchRecipeDetails();
    loadNote();
    loadReviews();
});

