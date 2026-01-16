//Récupérer les éléments HTML
const modal = document.getElementById("modalOverlay");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const backArrow = document.getElementById("backArrow");

const deletePage = document.getElementById("deletePage");
const addPage = document.getElementById("addPage");
const openAddPageBtn = document.getElementById("openAddPage");
const loginLink = document.getElementById("login-link");
const logoutLink = document.getElementById("logout");

const imageInput = document.getElementById("imageInput");
const previewBox = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");
//Prévisualiser une image
imageInput.addEventListener("change", () => {
  //Quand l’utilisateur choisit une image → lance ce code
  const file = imageInput.files[0]; //récupère le premier fichier choisi

  if (!file) {
    //Si aucune image sélectionnée
    previewBox.style.display = "none"; //cache la boîte
    previewImg.src = ""; //enlève l’image
    return; //stoppe la fonction
  }
  //Lire le fichier
  const reader = new FileReader(); //outil pour lire un fichier
  reader.onload = () => {
    //Quand le fichier est prêt
    previewImg.src = reader.result; //mets son contenu dans l’image
    previewBox.style.display = "flex"; //affiche la box
  };

  reader.readAsDataURL(file); //Convertit l’image → format lisible par <img>
});

// ---------------------- OUVRIR ----------------------
openBtn.addEventListener("click", () => {
  //Quand tu cliques
  modal.style.display = "flex"; //Affiche la fenêtre
  document.body.style.overflow = "hidden"; //Empêche de scroller derrière

  deletePage.style.display = "block"; //page suppression visible
  addPage.style.display = "none"; //pas de 2 page
  backArrow.style.display = "none"; //pas de fleche retour

  displayWorksInModal(); //Charge les travaux
});

//???---------------------- FERMER ----------------------
const closeModal = () => {
  //Fonction quitter
  modal.style.display = "none"; //Masque la modal
  document.body.style.overflow = "auto"; //débloque le scroll
};

closeBtn.addEventListener("click", closeModal); //Quand tu cliques ❌

modal.addEventListener("click", (e) => {
  //
  if (e.target === modal) closeModal(); //Si tu cliques en dehors → ferme
});

// ---------------------- PAGE 1 → PAGE 2 ----------------------
openAddPageBtn.addEventListener("click", () => {
  //qd tu cliques sur ajouter
  deletePage.style.display = "none"; //cache page suppression
  addPage.style.display = "block"; //montre ajout page
  backArrow.style.display = "inline"; //montre retour

  fillCategoriesSelect(); //Charge les catégories
});

// ---------------------- PAGE 2 → PAGE 1 ----------------------
backArrow.addEventListener("click", () => {
  //qd tu cliques sur la fleche retour
  deletePage.style.display = "block"; //montre page suppression
  addPage.style.display = "none"; //cache ajout page
  backArrow.style.display = "none"; //cache retour
  displayWorksInModal(); //Charge les travaux
});

// ---------------------- AFFICHAGE WORKS ----------------------
async function displayWorksInModal() {
  //fonction pour Charger les travaux
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  const works = await fetch("http://localhost:5678/api/works").then((res) =>
    res.json()
  );

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const trash = document.createElement("button");
    trash.classList.add("trash-btn");
    trash.textContent = "🗑";
    trash.addEventListener("click", () => deleteWork(work.id));

    figure.appendChild(img);
    figure.appendChild(trash);
    modalGallery.appendChild(figure);
  });
}

// ---------------------- DELETE 1 ----------------------
async function deleteWork(id) {
  // fonction pour Supprimer un travail
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5678/api/works/${id}`, {
    //va sur cette fonction id
    method: "DELETE", //supprime
    headers: { Authorization: `Bearer ${token}` }, //autorisation admin
  });

  displayWorksInModal(); //
  displayWorks("all"); //
}
// TO DO:
// ---------------------- DELETE MULTIPLE ----------------------
// const deleteAllBtn = document.getElementById("deleteAllBtn");
// const modalGallery = document.querySelector(".modal-gallery");

// modalGallery.addEventListener("click", (e) => {
//   const fig = e.target.closest("figure");
//   if (!fig) return;
//   fig.classList.toggle("selected");
// });

// deleteAllBtn.addEventListener("click", async () => {
//   const selected = modalGallery.querySelectorAll("figure.selected");
//   if (selected.length === 0) return alert("Sélectionnez des images à supprimer");

//   for (const fig of selected) {
//     const id = fig.dataset.id;

//     await fetch(`http://localhost:5678/api/works/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//       }
//     });

//     fig.remove();
//   }

//   displayWorks("all");
// });

// ---------------------- REMPLIR CATEGORIES ----------------------
async function fillCategoriesSelect() {
  const select = document.getElementById("categorySelect");
  select.innerHTML = ""; // On vide ce qu’il y avait déjà dedans

  const categories = await fetch("http://localhost:5678/api/categories").then(
    (res) => res.json()
  ); //on appelle le serveur, on transforme la réponse JSON en vrai JavaScript

  categories.forEach((cat) => {
    //On parcourt chaque catégorie une par une
    const option = document.createElement("option"); //On fabrique une balise <option>
    option.value = cat.id; //La valeur technique = id
    option.textContent = cat.name; //Le texte visible
    select.appendChild(option); //On ajoute cette option dans la liste
  });
}

// ---------------------- AJOUT PHOTO ----------------------
const addForm = document.getElementById("addForm");
const titleInput = document.getElementById("titleInput");
const categorySelect = document.getElementById("categorySelect");
const submitBtn = document.getElementById("addPageSubmitBtn");

addForm.addEventListener("input", () => {
  //Quand quelqu’un écrit dans un champ
  submitBtn.disabled =
    !imageInput.files[0] || !titleInput.value || !categorySelect.value;
}); //Si une info manque → bouton désactivé

addForm.addEventListener("submit", async (e) => {
  //Quand on clique sur “Valider”
  e.preventDefault(); //le navigateur attend un peu,On empêche la page de se recharger automatiquement

  // L’ordinateur efface les anciennes erreurs,les messages rouges disparaissent
  document.getElementById("imgError").textContent = ""; //
  document.getElementById("titleError").textContent = ""; //On efface l’erreur du titre
  document.getElementById("catError").textContent = ""; //

  let isValid = true; //on cree une var modifiable donc par défaut, tout est bon

  if (!imageInput.files[0]) {
    //S’il n’y a PAS d’image
    document.getElementById("imgError").textContent =
      "Veuillez sélectionner une image."; //Message rouge sous le champ image
    isValid = false;
  }

  if (!titleInput.value.trim()) {
    //Est-ce que le titre est vraiment rempli ?
    document.getElementById("titleError").textContent =
      "Veuillez entrer un titre.";
    isValid = false;
  }

  if (!categorySelect.value) {
    document.getElementById("catError").textContent =
      "Veuillez choisir une catégorie.";
    isValid = false;
  }

  if (!isValid) return; // Rien après ne s’exécute

  // ✅ Envoi à l'API car tout est OK
  const token = localStorage.getItem("token"); //Es-tu connecté
  const formData = new FormData(); //format spécial pour fichiers,Le navigateur prépare un colis

  formData.append("image", imageInput.files[0]); //Ajoute l’image au colis
  formData.append("title", titleInput.value); //Ajoute le titre
  formData.append("category", categorySelect.value); //Ajoute la catégorie
  try {
    await fetch("http://localhost:5678/api/works", {
      //appel serveur et attend la réponse
      method: "POST", //Je veux créer quelque chose
      headers: { Authorization: `Bearer ${token}` }, //Voici ma carte d’identité
      body: formData, //Voici le colis
    });

    displayWorks("all"); //Galerie mise à jour
    addForm.reset(); //Formulaire vidé
    backArrow.click(); //Retour à la page précédente de la modale
  } catch (error) {
    // 🔥 BACKEND ÉTEINT
    errorBox.textContent =
      "❌ Impossible d’ajouter le projet. Serveur indisponible.";
  }
});
