const form = document.querySelector("form"); //cherche la balise <form> dans la page
const connectedUser = localStorage.getItem("token"); //Est-ce que l’utilisateur est déjà connecté ?

if (connectedUser) {
  //Si l’utilisateur est déjà connecté
  window.location.href = "index.html"; //Tu le renvoies directement à l’accueil, pas au login
}
form.addEventListener("submit", async (event) => {
  //quand on clique sur “Se connecter et attend des réponses serveur

  event.preventDefault(); //Empêche le navigateur de recharger la page

  const email = document.querySelector("#email").value; //tu prends ce que l’utilisateur a écrit dans Email
  const password = document.querySelector("#password").value; //tu prends ce qu’il a écrit dans Mot de passe

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      //Tu envoies au serveur
      method: "POST", //
      headers: { "Content-Type": "application/json" }, //
      body: JSON.stringify({ email, password }), //Email + mot de passe
    });

    if (!response.ok) {
      //si le serveur dit NON
      throw new Error("Identifiants incorrects");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } catch (error) {
    // 👉 MESSAGE UTILISATEUR
    alert(
      "❌ Impossible de se connecter.\n" +
        "Vérifiez vos identifiants ou réesayer plus tard."
    );
  }
});
