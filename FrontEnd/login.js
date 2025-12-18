const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();

        // Stockage du token
        localStorage.setItem("token", data.token);
        localStorage.getItem("token", data.token);

        // Redirection vers l’accueil
        window.location.href = "index.html";
    } else {
        alert("Erreur dans l’identifiant ou le mot de passe");
    }
});
