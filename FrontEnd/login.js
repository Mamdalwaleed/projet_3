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
    //J’essaie d’envoyer ces infos au serveur
    const response = await fetch("http://localhost:5678/api/users/login", {
      //Tu envoies au serveur;Va parler au serveur à cette adresse
      method: "POST", //Je veux ENVOYER des données au serveur
      headers: { "Content-Type": "application/json" }, //ce que je t’envoie est écrit en JSON
      body: JSON.stringify({ email, password }), //Tu transformes l’objet JS en texte JSON lisible par le serveur,Voici l’email et le mot de passe de l’utilisateur,
    });

    if (!response.ok) {
      //Si le serveur répond NON → je crée volontairement une erreur
      throw new Error("Identifiants incorrects");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } catch (error) {
    //Si n’importe quelle erreur arrive dans le try
    // 👉 MESSAGE UTILISATEUR
    alert(
      "❌ Impossible de se connecter.\n" +
        "Vérifiez vos identifiants ou réesayer plus tard."
    );
  }
});
