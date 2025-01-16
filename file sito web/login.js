document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Estrai i valori inseriti nei campi di email e password
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Recupera i dati degli utenti registrati da localStorage
    const storedUsers = localStorage.getItem('users');

    if (storedUsers) {
        try {
            const users = JSON.parse(storedUsers);

            // Cerca un utente con la combinazione di email e password
            const user = users.find(function(user) {
                return user.email === email && user.password === password;
            });

            if (user) {
                // Login riuscito, salvo in async storage il flag di login e l'utente loggato
                alert('Login successful!');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                redirectToHomePage();
            } else {
                // Autenticazione fallita
                alert('Invalid e-mail or password. Please try again.');
                redirectToLoginPage();
            }
        } catch (error) {
            //console.log(error);
            alert('Error reading stored users data.');
        }
    } else {
        // Nessun utente trovato
        alert('No users registered. Please register first.');
        window.location.href = "register.html";
    }
});

function redirectToHomePage() {
    window.location.href = "HomePage.html";
}

function redirectToLoginPage() {
    window.location.href = "login.html"; 
}
