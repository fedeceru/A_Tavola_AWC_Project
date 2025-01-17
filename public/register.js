document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signUpForm').addEventListener('submit', function(event) {
        event.preventDefault(); 

        // Gestisce l'invio del modulo di registrazione
        if(localStorage.getItem('isLoggedIn') === 'true' ){
            alert('You are already logged in. Please log out before registering a new account.');
            window.location.href = "HomePage.html";
            return;
        }

        // Recupera i valori inseriti nei campi del modulo
        var firstName = document.getElementById('firstName').value;
        var lastName = document.getElementById('lastName').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confPassword').value;
        
        // Verifica la complessità della password
        if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
            alert('Password must be at least 8 characters long and contain at least one number and one uppercase letter.');
            return;
        }

        // Verifica che le password corrispondano
        if(password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        // Crea un oggetto utente con i dati raccolti
        var user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password 
        };

        // Recupera la lista degli utenti da localStorage
        var storedUsers = localStorage.getItem('users');
        var users = storedUsers ? JSON.parse(storedUsers) : [];

        // Verifica se l'utente esiste già 
        if (users.some(user => user.email === email)) {
            alert('User with this email already exists.');
            return; // Ferma il processo di registrazione se l'email è già in uso
        }

        // Aggiunge il nuovo utente alla lista
        users.push(user);

        // Salva la lista aggiornata su localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('isLoggedIn', 'true'); // Imposta l'utente come loggato
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Memorizza l'utente loggato

        alert('Registration successful!');
        redirectToHomePage(); 
    });

    function redirectToHomePage() {
        window.location.href = "HomePage.html"; 
    }
});