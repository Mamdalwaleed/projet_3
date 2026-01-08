


// Récupération et affichage des catégories
async function displayCategories() {
  const container = document.querySelector(".categories");

  const categories = await (
    await fetch("http://localhost:5678/api/categories")
  ).json();

  // Bouton Tous
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.dataset.id = "all";
  container.appendChild(allBtn);

  // Boutons catégories
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.name;
    btn.dataset.id = cat.id;
    container.appendChild(btn);
  });
}




// Fonction d'affichage SANS HTML dans JS
function showWorks(list, containerSelector = ".gallery") {
  const gallery = document.querySelector(containerSelector);
  gallery.innerHTML = "";

  list.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement("figcaption");
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}




async function getworks(id) {
  const works = await (await fetch("http://localhost:5678/api/works")).json();

  return works.filter((work) => id === "all" || work.categoryId == id);
}




async function displayWorks(categoryId) {
     const works = await getworks(categoryId);
     showWorks(works);
    
}

displayCategories();
displayWorks("all")

// TRI AVEC FOREACH (SANS HTML)
document.querySelector(".categories").addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;
  

  const id = e.target.dataset.id;

  await displayWorks(id);
     
});




document.addEventListener("DOMContentLoaded", () => {
    // ----- AUTHENTIFICATION -----
    const token = localStorage.getItem("token");
    const loginLink = document.getElementById("login-link");
    const logoutBtn = document.getElementById("logout");
    const editBtn = document.getElementById("edit-btn");

    if (token) {
      logoutBtn.style.display = "block";
      editBtn.style.display = "block";
      loginLink.style.display = "none";
    }

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });


  })








