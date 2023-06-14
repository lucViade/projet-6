const submit = document.querySelector('input[type="submit"]');


submit.addEventListener("click", function (e) {
    e.preventDefault()
    FetchUserLogin()
});



async function FetchUserLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("mot-de-passe").value;
    const errorMsg = document.querySelector(".erreur-msg");
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
            })
        });

        if (response.ok) {
            
             // Token d'autentification
            const dataUser = await response.json();
            // console.log(dataUser)
            // Enregistrement du token d'authentification et du login dans le stockage local
            localStorage.setItem("token", dataUser.token)
            localStorage.setItem("login", true)
            
            window.location.href = "./index.html";
        }

        else {
            localStorage.setItem("token", undefined)
            localStorage.setItem("login", undefined)
            errorMsg.innerText = "Erreur dans l’identifiant ou le mot de passe";
            console.log("Connexion Impossible : Erreur Identifiant ou Mot de passe")
        }
    }

    catch (e) {
        console.log(e);
    }
};