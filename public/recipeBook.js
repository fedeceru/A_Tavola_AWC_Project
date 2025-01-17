function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    const loginLink = document.getElementById('login');
    const registerLink = document.getElementById('register');
    const navItems = loginLink?.parentElement?.parentElement;  // Il contenitore <ul>

    if (!navItems) {
        console.error('Navbar items not found');
        return;
    }

    // Se l'utente è loggato
    if (isLoggedIn === 'true') {
        // Rimuovi i link "Accedi" e "Registrati"
        loginLink.parentElement.remove();
        registerLink.parentElement.remove();
        
        // Creazione del link "Profilo" con icona
        const editProfile = document.createElement('li');
        editProfile.classList.add('nav-item');

        const modprofileLink = document.createElement('a');
        modprofileLink.href = "editProfile.html";  // Modifica il link se necessario
        modprofileLink.classList.add('nav-link', 'd-flex', 'align-items-center');
        modprofileLink.id = 'recipeBook';

        const modprofileIcon = document.createElement('i');
        modprofileIcon.classList.add('bi', 'bi-person', 'me-2');

        modprofileLink.appendChild(modprofileIcon);
        modprofileLink.appendChild(document.createTextNode('Profile'));
        editProfile.appendChild(modprofileLink);

        const profileItem = document.createElement('li');
        profileItem.classList.add('nav-item', 'ms-3');

        const profileLink = document.createElement('a');
        profileLink.href = "recipeBook.html";  // Modifica il link se necessario
        profileLink.classList.add('nav-link', 'd-flex', 'align-items-center');
        profileLink.id = 'recipeBook';

        const profileIcon = document.createElement('i');
        profileIcon.classList.add('bi', 'bi-book', 'me-2');

        profileLink.appendChild(profileIcon);
        profileLink.appendChild(document.createTextNode('Recipe book'));
        profileItem.appendChild(profileLink);

        // Creazione del link "Logout" con icona
        const logoutItem = document.createElement('li');
        logoutItem.classList.add('nav-item', 'ms-3');  // Aggiunge spazio tra Profilo e Logout

        const logoutLink = document.createElement('a');
        logoutLink.href = "#";
        logoutLink.classList.add('nav-link', 'd-flex', 'align-items-center');
        logoutLink.id = 'logout';

        const logoutIcon = document.createElement('i');
        logoutIcon.classList.add('bi', 'bi-box-arrow-right', 'me-2');  // Icona di logout

        logoutLink.appendChild(logoutIcon);
        logoutLink.appendChild(document.createTextNode('Logout'));
        logoutItem.appendChild(logoutLink);

        // Aggiunta del link "Profilo" e "Logout" nel DOM
        navItems.appendChild(editProfile);
        navItems.appendChild(profileItem);
        navItems.appendChild(logoutItem);

        // Listener per il logout
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('loggedInUser');
            alert('Sei stato scollegato con successo!');
            location.reload();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});


document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // JSON.parse per ottenere l'oggetto utente
    
    // Controllo se l'utente è loggato e se l'oggetto loggedInUser esiste
    if (isLoggedIn !== 'true' || !loggedInUser || !loggedInUser.email) {
        alert('You must be logged in to see your saved recipes.');
        window.location.href = 'login.html';  // Reindirizza alla pagina di login se non loggato
        return;
    }

    const savedRecipesContainer = document.getElementById('saved-recipes-container');
    // Recupera le ricette salvate usando l'email dell'utente come chiave
    const savedRecipes = JSON.parse(localStorage.getItem(`${loggedInUser.email}_savedRecipes`)) || [];

    // Se non ci sono ricette salvate, mostra un messaggio
    if (savedRecipes.length === 0) {
        savedRecipesContainer.innerHTML = '<p>You have not saved any recipes yet.</p>';
        return;
    }

    // Funzione per aggiornare il localStorage e rimuovere una ricetta dai preferiti
    function removeRecipeFromFavorites(recipeId) {
        const updatedRecipes = savedRecipes.filter(recipe => recipe.id !== recipeId);
        localStorage.setItem(`${loggedInUser.email}_savedRecipes`, JSON.stringify(updatedRecipes));
        location.reload();  // Ricarica la pagina per aggiornare la lista delle ricette
    }

    // Aggiunge ogni ricetta salvata al DOM
    savedRecipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'col-md-4 mb-3';
        recipeDiv.innerHTML = `
            <div class="card">
                <img src="${recipe.img}" class="card-img-top" alt="${recipe.title}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <a href="recipeDetails.html?id=${recipe.id}" class="btn btn-primary w-100 mb-2">View Recipe</a>
                    <button class="btn btn-danger w-100 delete-recipe" data-id="${recipe.id}">Delete</button>
                </div>
            </div>
        `;
        savedRecipesContainer.appendChild(recipeDiv);
    });

    // Aggiungi event listener per i pulsanti di eliminazione
    const deleteButtons = document.querySelectorAll('.delete-recipe');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const recipeId = this.getAttribute('data-id');
            removeRecipeFromFavorites(recipeId);
        });
    });
});

