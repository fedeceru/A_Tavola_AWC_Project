document.addEventListener('DOMContentLoaded', function () {
    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('No user found. Please log in.');
        window.location.href = "login.html";
        return;
    }

    // Popolo i campi del form con i dati dell'utente loggato
    document.getElementById('firstName').value = loggedInUser.firstName;
    document.getElementById('lastName').value = loggedInUser.lastName;
    document.getElementById('email').value = loggedInUser.email;

    document.getElementById('editProfileForm').addEventListener('submit', function (event) {
        event.preventDefault();

        var firstName = document.getElementById('firstName').value;
        var lastName = document.getElementById('lastName').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confPassword').value;

        // Controllo che le password corrispondano
        if (password && (password !== confirmPassword)) {
            alert('Passwords do not match.');
            return;
        }

        // Aggiorno i dati dell'utente loggato
        loggedInUser.firstName = firstName;
        loggedInUser.lastName = lastName;

        // Controllo della password (se presente)
        if (password) {
            if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
                alert('Password must be at least 8 characters long and contain at least one number and one uppercase letter.');
                return;
            }
            loggedInUser.password = password;
        }

        // Aggiorno l'utente nel localStorage
        var users = JSON.parse(localStorage.getItem('users')) || [];
        var updatedUsers = users.map(user => user.email === loggedInUser.email ? loggedInUser : user);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        alert('Profile updated successfully.');
        window.location.href = "HomePage.html";
    });

    document.getElementById('deleteProfile').addEventListener('click', function () {
        if (confirm('Are you sure you want to delete your profile?')) {
            var users = JSON.parse(localStorage.getItem('users')) || [];
            var updatedUsers = users.filter(user => user.email !== loggedInUser.email);

            // Se non ci sono più utenti registrati, elimino anche la chiave 'users' e 'isLoggedIn'
            if (updatedUsers.length === 0) {
                localStorage.removeItem('users');
                localStorage.removeItem('isLoggedIn');
            } else {
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                localStorage.setItem('isLoggedIn', 'false');
            }

            localStorage.removeItem('loggedInUser');

            // Elimino le recensioni associate all'utente
            var reviewKeys = Object.keys(localStorage).filter(key => key.endsWith('_reviews'));
            reviewKeys.forEach(function (key) {
                var reviews = JSON.parse(localStorage.getItem(key)) || [];
                var updatedReviews = reviews.filter(review => review.email !== loggedInUser.email);
                if (updatedReviews.length > 0) {
                    localStorage.setItem(key, JSON.stringify(updatedReviews));
                } else {
                    localStorage.removeItem(key);
                }
            });

            // Elimino le note associate all'utente
            var noteKeys = Object.keys(localStorage).filter(key => key.endsWith('_note'));
            noteKeys.forEach(function (key) {
                var emailInKey = key.split('_')[0];
                if (emailInKey === loggedInUser.email) {
                    localStorage.removeItem(key);
                }
            });

            // Elimino le ricette salvate associate all'utente
            var savedRecipesKey = `${loggedInUser.email}_savedRecipes`;  // Corretto il nome della chiave
            if (localStorage.getItem(savedRecipesKey)) {
                localStorage.removeItem(savedRecipesKey);
            }

            alert('Profile deleted successfully.');
            window.location.href = "HomePage.html";
        }
    });
});
