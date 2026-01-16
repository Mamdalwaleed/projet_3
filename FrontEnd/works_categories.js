const connectedUser = localStorage.getItem("token"); // Récupération de l'utilisateur connecté

async function displayCategories() {
  const container = document.querySelector(".categories"); //// On pointe la boîte qui va contenir les boutons--Comme dire “je prends cette étagère

  const categories = await //attend la reponse transformé  en json
  (
    await fetch("http://localhost:5678/api/categories")
  ) //envoie une requête au serveur --Donne-moi la liste des projets
    .json(); //transforme la réponse en objet JavaScript utilisable

  // Bouton Tous
  const allBtn = document.createElement("button"); // Crée une balise <button> en JS
  allBtn.textContent = "Tous"; //Met du texte dans le bouton
  allBtn.dataset.id = "all"; //
  container.appendChild(allBtn); //Tu mets le bouton dans l’étagère

  // Boutons catégories
  categories.forEach((cat) => {
    //boucle sur chaque élément du tableau categories
    const btn = document.createElement("button");
    btn.textContent = cat.name; //Met le nom de la catégorie dans le bouton
    btn.dataset.id = cat.id; //Stocke l’ID
    container.appendChild(btn); //Ajoute le bouton dans le HTML
  });
}

// Fonction d'affichage SANS HTML dans JS
function showWorks(list, containerSelector = ".gallery") {
  // Fonction qui affiche des travaux,"Je vais afficher cette liste d’objets dans cette zone

  const gallery = document.querySelector(containerSelector); //Récupère la zone où afficher
  gallery.innerHTML = ""; //Vide la galerie avant de remettre,sinon ça ferait doublon

  list.forEach((work) => {
    const figure = document.createElement("figure"); //On fabrique un cadre pour l’image

    const img = document.createElement("img"); // On crée une image
    img.src = work.imageUrl; //on lui donne son lien
    img.alt = work.title; //on lui donne son texte alternatif

    const caption = document.createElement("figcaption"); //crée un texte sous l’image
    caption.textContent = work.title;

    figure.appendChild(img); //image → dans figure
    figure.appendChild(caption); //texte → dans figure
    gallery.appendChild(figure); //figure → dans la galerie
  });
}

async function getworks(id) {
  const works = await (await fetch("http://localhost:5678/api/works")).json(); // récupère projets

  return works.filter((work) => id === "all" || work.categoryId == id); //garde seulement ce qui correspond avec si id = "all" → tout passe ou sinon → garde ceux dont categoryId == id
}

async function displayWorks(categoryId) {
  const works = await getworks(categoryId);
  showWorks(works);
}
//Quand la page commence
displayCategories(); //afficher catégories
displayWorks("all"); //afficher tous les projets

// TRI AVEC FOREACH (SANS HTML)
document.querySelector(".categories").addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return; //Si on clique ailleurs → on arrête

  const id = e.target.dataset.id; //On récupère l’étiquette soit "all" soit numéro

  await displayWorks(id); //On affiche
});

document.addEventListener("DOMContentLoaded", () => {
  //Attendre que la page soit chargée

  const token = localStorage.getItem("token"); //prend l'accès ou Prend le badge admin
  const loginLink = document.getElementById("login-link");
  const logoutBtn = document.getElementById("logout");
  const editBtn = document.getElementById("openModal");

  if (!token) {
    editBtn.style.display = "none";
    loginLink.style.display = "block";
    logoutBtn.style.display = "none";
  } else {
    editBtn.style.display = "block";
    loginLink.style.display = "none";
    logoutBtn.style.display = "block";
  }

  // ---------------------- DECONNEXION ----------------------
  logoutBtn.addEventListener("click", () => {
    //quand tu cliques sur logout
    localStorage.removeItem("token"); //supprime le badge
    window.location.href = "login.html"; //renvoie à l’accueil
  });
});
